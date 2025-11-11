import { useEffect, useRef, useState } from 'react';
import {
  useDetectNumberMutation,
  type DetectNumberItem,
  type DetectNumberResponse,
} from '../../services/api';

interface Props {
  onPlateDetected: (plate: string) => void;
  onClose: () => void;
}

/**
 * Лёгкий сканер:
 * - Открывает камеру (задняя).
 * - По кнопке "Сканировать" делает снимок из видео в canvas.
 * - Отправляет multipart/form-data на /api/detect-number/ (frame: File).
 * - Типобезопасно парсит ответ и логирует его в console.log.
 * - Пробрасывает лучший распознанный номер наружу через onPlateDetected.
 */
export default function PlateScanner({ onPlateDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [detectNumber] = useDetectNumberMutation();

  // Запуск камеры
  useEffect(() => {
    let mounted = true;

    const start = async () => {
      const getStream = async (constraints: MediaStreamConstraints) => {
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[camera] getUserMedia failed for', constraints, err);
          return null;
        }
      };

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setErr('Камера не поддерживается в этом окружении');
          return;
        }

        // 1) Пытаемся открыть заднюю камеру с разумным разрешением
        let stream =
          (await getStream({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          })) || null;

        // 2) Если не вышло — ищем явным образом устройство videoinput (back/rear/environment)
        if (!stream && navigator.mediaDevices.enumerateDevices) {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            const back =
              videoInputs.find((d) => /back|rear|environment/i.test(d.label)) || videoInputs[0];
            if (back) {
              stream = await getStream({
                video: { deviceId: { exact: back.deviceId } },
                audio: false,
              });
            }
          } catch {
            // ignore enumerateDevices failures
          }
        }

        // 3) Последний шанс — фронталка/дефолт
        if (!stream) {
          stream =
            (await getStream({ video: { facingMode: { ideal: 'user' } }, audio: false })) ||
            (await getStream({ video: true, audio: false }));
        }

        if (!stream) {
          setErr('Не удалось открыть камеру. Проверьте разрешения браузера и наличие HTTPS/localhost.');
          return;
        }

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          const v = videoRef.current;
          (v as HTMLVideoElement & { srcObject: MediaStream | null }).srcObject = stream;
          v.setAttribute('playsinline', 'true');
          v.muted = true;
          v.autoplay = true;

          await new Promise<void>((resolve) => {
            if (v.readyState >= 2) return resolve();
            v.onloadedmetadata = () => resolve();
          });

          try {
            await v.play();
          } catch (playErr) {
            // eslint-disable-next-line no-console
            console.warn('[camera] video.play() was rejected', playErr);
          }
        }
      } catch (e: unknown) {
        console.error('Camera error', e);
        const name =
          typeof e === 'object' && e !== null && 'name' in e ? (e as { name?: string }).name : undefined;
        if (name === 'NotAllowedError') {
          setErr('Доступ к камере запрещён. Разрешите доступ в настройках браузера.');
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          setErr('Камера не найдена. Подключите или выберите другое устройство.');
        } else if (name === 'SecurityError') {
          setErr('Нужен безопасный контекст (HTTPS) или localhost для доступа к камере.');
        } else {
          setErr('Не удалось открыть камеру');
        }
      }
    };

    start();

    return () => {
      mounted = false;
      const mediaStream =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (videoRef.current?.srcObject as MediaStream | null) ?? (null as MediaStream | null);
      mediaStream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) {
        videoRef.current.pause();
        (videoRef.current as HTMLVideoElement & { srcObject: MediaStream | null }).srcObject = null;
      }
    };
  }, []);

  // Вспомогательная функция нормализации ответа
  const toItems = (resp: DetectNumberResponse): DetectNumberItem[] => {
    if (Array.isArray(resp)) return resp;
    if (resp && typeof resp === 'object' && 'results' in resp) {
      const r = (resp as { results?: DetectNumberItem[] }).results;
      return Array.isArray(r) ? r : [];
    }
    return [];
  };

  // Захват кадра и отправка на /api/detect-number/
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsDetecting(true);
      setErr(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Проверяем, что видео-элемент готов (получены размеры потока)
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        setErr('Камера ещё не готова. Подождите 1–2 секунды и попробуйте снова.');
        setIsDetecting(false);
        return;
      }

      // Масштабируем до разумной ширины для веса запроса (~1280px)
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      const maxW = 1280;
      const scale = Math.min(1, maxW / vw);
      const cw = Math.round(vw * scale);
      const ch = Math.round(vh * scale);

      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, cw, ch);

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (!b) return reject(new Error('Не удалось получить Blob'));
            resolve(b);
          },
          'image/jpeg',
          0.9
        );
      });

      const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });

      const resp = await detectNumber({ frame: file }).unwrap();

      console.log('detectNumber response:', resp);

      const items = toItems(resp);
      if (items.length === 0) {
        console.log('detectNumber: результатов нет');
        return;
      }

      // Выбираем лучший по confidence (если есть), иначе первый
      const sorted = [...items].sort((a, b) => {
        const ca = typeof a.confidence === 'number' ? a.confidence : -1;
        const cb = typeof b.confidence === 'number' ? b.confidence : -1;
        return cb - ca;
      });

      const best = sorted[0];
      const bestPlate = best?.plate || '';

      console.log('detectNumber best item:', best);
      if (bestPlate) {
        setText(bestPlate);
        onPlateDetected(bestPlate);
      }
    } catch (e) {
      console.error('detectNumber error', e);
      setErr('Ошибка распознавания');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 1000,
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {text && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: 'yellow',
            textShadow: '0 0 10px black',
          }}
        >
          {text}
        </div>
      )}

      {err && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#ffb4b4',
            fontSize: 14,
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        <button
          onClick={captureAndDetect}
          disabled={isDetecting}
          style={{
            padding: '12px 20px',
            background: '#ffffff',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            border: 'none',
            minWidth: 140,
          }}
        >
          {isDetecting ? 'Сканирую...' : 'Сканировать'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '12px 20px',
            background: '#ffffff',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            border: 'none',
            minWidth: 140,
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
