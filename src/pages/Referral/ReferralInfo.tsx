import { FC, useEffect, useState, useRef } from 'react';
import { IonButton, IonPage, IonInput, IonSpinner, IonModal } from '@ionic/react';
import { createPortal } from 'react-dom';
import referralLogo from '../../assets/referralInfo/hor-logo.png';
import {
  useLazyGetCurrentUserQuery,
  useLazyOsagoRetrieveQuery,
  OsagoCheckResponse,
  useDetectNumberMutation,
  DetectNumberResponse,
  DetectNumberItem,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import share from '../../assets/share.svg';
import warning from '../../assets/warning.svg';
import cameraIcon from '../../assets/camera.svg';
import example from '../../assets/example.svg';

import { useTexts } from '../../context/TextsContext';
import { useLocale } from '../../context/LocaleContext';
import kyDict from '../../locales/ky.json';
import ruDict from '../../locales/ru.json';

import './style.scss';

const ReferralInfo: FC = () => {
  const { t } = useTexts();
  const { t: lt } = useLocale();
  const localData =
    localStorage.getItem('usersInfo') ||
    `{
      "id": 0,
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "phoneNumber": "+996",
      "balance": "0",
      "totalIncome": "0",
      "osagoIncome": "0",
      "agentsIncome": "0",
      "osagoCount": 0,
      "agentsCount": 0,
      "referralLink": "string",
      "identificationStatus": "not_submitted"
    }`;

  const [data, setData] = useState(JSON.parse(localData));

  const [getUserInfo] = useLazyGetCurrentUserQuery();
  const [triggerOsago, { isFetching }] = useLazyOsagoRetrieveQuery();
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<{
    type: 'none' | 'success' | 'error';
    message: string;
  }>({ type: 'none', message: '' });
  const [details, setDetails] = useState<string[]>([]);
  const plateRef = useRef<HTMLIonInputElement>(null);

  // Модалка камеры и авто-сканирование
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'found' | 'notfound' | 'error' | 'info' }>>([]);
  const pushToast = (message: string, type: 'found' | 'notfound' | 'error' | 'info' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      // Синие (found) не накапливаем: удаляем предыдущие blue перед добавлением
      const base = type === 'found' ? prev.filter((t) => t.type !== 'found') : prev;
      const next = [...base, { id, message, type }];
      const MAX = 5; // общий лимит, зелёные (notfound) могут стакаться до MAX
      return next.length > MAX ? next.slice(next.length - MAX) : next;
    });
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);
  const lastCheckedRef = useRef<{ plate: string; ts: number } | null>(null);
  const [detectNumber] = useDetectNumberMutation();
  const [notFoundPlates, setNotFoundPlates] = useState<string[]>([]);

  const handleFetch = async () => {
    const res = await getUserInfo().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'usersInfo',
      setState: setData,
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleCheck = async () => {
    const current = (plateRef.current?.value as string | null) ?? plate;
    const trimmed = (current ?? '').trim();
    if (!trimmed) {
      setResult({
        type: 'error',
        message: `${ruDict['s_format_invalid']} / ${kyDict['s_format_invalid']}`,
      });
      setDetails([]);
      return;
    }

    try {
      const res = (await triggerOsago(trimmed).unwrap()) as OsagoCheckResponse;
      const has = res.hasOsago ?? res.has_osago ?? false;

      const d = res.details || {};
      const lines: string[] = [];
      if (d.startDate || d.endDate) {
        lines.push(
          `Период: ${d.startDate ?? ''}${
            d.startDate && d.endDate ? ' - ' : ''
          }${d.endDate ?? ''}`
        );
      }
      if (d.database1) lines.push(String(d.database1));
      if (d.database2) lines.push(String(d.database2));

      if (has) {
        setResult({
          type: 'success',
          message:
            res.status ||
            `${ruDict['s_has_osago']} ${res.plate} / ${kyDict['s_has_osago']} ${res.plate}`,
        });
        setDetails(lines);
      } else {
        setResult({
          type: 'error',
          message:
            res.status ||
            `${ruDict['s_not_found']} ${res.plate} / ${kyDict['s_not_found']} ${res.plate}`,
        });
        setDetails(lines);
      }
    } catch {
      setResult({
        type: 'error',
        message: `${ruDict['s_request_error']} / ${kyDict['s_request_error']}`,
      });
      setDetails([]);
    }
  };

  // Нормализация ответа detect-number
  const toItems = (resp: DetectNumberResponse): DetectNumberItem[] => {
    if (Array.isArray(resp)) return resp;
    if (resp && typeof resp === 'object' && 'results' in resp) {
      const r = (resp as { results?: DetectNumberItem[] }).results;
      return Array.isArray(r) ? r : [];
    }
    return [];
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        pushToast('Камера не поддерживается', 'error');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      if (videoRef2.current) {
        const vid = videoRef2.current as HTMLVideoElement & { srcObject: MediaStream | null };
        vid.srcObject = stream;
        await vid.play();
      }
    } catch (e) {
      console.error('camera start error', e);
      pushToast('Не удалось открыть камеру', 'error');
    }
  };

  const stopCamera = () => {
    const vid = videoRef2.current as (HTMLVideoElement & { srcObject: MediaStream | null }) | null;
    const mediaStream = vid?.srcObject ?? null;
    mediaStream?.getTracks().forEach((t) => t.stop());
    if (videoRef2.current) {
      const vid2 = videoRef2.current as HTMLVideoElement & { srcObject: MediaStream | null };
      vid2.pause();
      vid2.srcObject = null;
    }
  };

  const captureAndSend = async () => {
    if (!videoRef2.current || !canvasRef2.current || isSending) return;
    try {
      setIsSending(true);
      const video = videoRef2.current;
      const canvas = canvasRef2.current;

      // Debug: ensure we actually have real video dimensions
      if (!video.videoWidth || !video.videoHeight) {
        // eslint-disable-next-line no-console
        console.warn('[PlateScanner] video dimensions are 0; skip capture until metadata is loaded');
        setIsSending(false);
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      // eslint-disable-next-line no-console
      console.debug('[PlateScanner] capture dims', { vw, vh });
      const maxW = 1280;
      const scale = Math.min(1, maxW / vw);
      const cw = Math.round(vw * scale);
      const ch = Math.round(vh * scale);

      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsSending(false);
        return;
      }

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

      // eslint-disable-next-line no-console
      console.debug('[PlateScanner] blob size', blob.size);

      const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });
      const resp = await detectNumber({ frame: file }).unwrap();
      const items = toItems(resp);

      if (items.length === 0) {
        let msg: string | undefined;
        if (resp && typeof resp === 'object' && 'message' in resp) {
          const m = (resp as { message?: unknown }).message;
          msg = typeof m === 'string' ? m : undefined;
        }
        if (msg) {
          pushToast(msg, 'info'); // показываем текст сервера, например: "Номера не найдены"
        }
        return;
      }

      // лучший по confidence -> иначе первый
      const sorted = [...items].sort((a, b) => {
        const ca = typeof a.confidence === 'number' ? a.confidence : -1;
        const cb = typeof b.confidence === 'number' ? b.confidence : -1;
        return cb - ca;
      });
      const best = sorted[0];
      const bestPlate = best?.plate || '';
      if (bestPlate) {

        // Автозапрос ОСАГО по распознанному номеру (с анти-спамом на 10 секунд для одинакового номера)
        const now = Date.now();
        if (
          lastCheckedRef.current &&
          lastCheckedRef.current.plate === bestPlate &&
          now - lastCheckedRef.current.ts < 10000
        ) {
          // Пропускаем повторный запрос для того же номера в течение 10 секунд
        } else {
          lastCheckedRef.current = { plate: bestPlate, ts: now };
          try {
            const res = (await triggerOsago(bestPlate).unwrap()) as OsagoCheckResponse;
            const has = res.hasOsago ?? res.has_osago ?? false;

            const d = res.details || {};
            const lines: string[] = [];
            if (d.startDate || d.endDate) {
              lines.push(
                `Период: ${d.startDate ?? ''}${d.startDate && d.endDate ? ' - ' : ''}${d.endDate ?? ''}`
              );
            }
            if (d.database1) lines.push(String(d.database1));
            if (d.database2) lines.push(String(d.database2));

            if (has) {
              const msg = `Полис найден для номера ${res.plate}`;
              setResult({ type: 'success', message: msg });
              setDetails(lines);
              pushToast(msg, 'found'); // синий, не стакать
            } else {
              const msg = `Полис не найден для номера ${res.plate}`;
              setResult({ type: 'error', message: msg });
              setDetails(lines);
              // добавить в список не найденных (без дубликатов, с нормализацией регистра/пробелов)
              if (res.plate) {
                const p = String(res.plate).toUpperCase().trim();
                setNotFoundPlates((prev) => (prev.includes(p) ? prev : [...prev, p]));
              }
              pushToast(msg, 'notfound'); // зелёный, можно стакать
            }

            // Камеру не закрываем — продолжаем показывать превью и позволяем повторные сканы
          } catch {
            const msg = `${ruDict['s_request_error']} / ${kyDict['s_request_error']}`;
            setResult({ type: 'error', message: msg });
            setDetails([]);
            pushToast(msg, 'error');
          }
        }
      } else {
        const list = items.map((i) => i.plate).filter(Boolean).join(', ');
        if (list) {
          pushToast(`Найдены: ${list}`, 'info');
        }
      }
    } catch (e) {
      console.error('detect-number error', e);
      pushToast('Ошибка распознавания', 'error');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!isCamOpen) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopCamera();
      return;
    }
    startCamera();
    intervalRef.current = window.setInterval(() => {
      void captureAndSend();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopCamera();
    };
  }, [isCamOpen]);

  const openCamModal = () => setIsCamOpen(true);
  const closeCamModal = () => setIsCamOpen(false);

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        <img
          src={referralLogo}
          alt={t('company_name')}
          className='referral-logo'
        />
        <div className='referral-description'>
          {lt('referral_desc_line1')}
          <br />
          {lt('referral_desc_line2')}
          <br />
          <span>{lt('referral_desc_highlight')}</span>
        </div>
        {/* <div className='referral-title'>{t('referral_title')}</div>
        <div className='referral-code'>{data?.id}</div> */}
        <p className='' style={{ fontSize: '18px', fontWeight: '500' }}>
          {lt('referral_cashback')}
        </p>

        <IonButton
          expand='block'
          className='primary-btn'
          onClick={() => {
            if (data?.authReferralLink) {
              window.location.href = data.authReferralLink;
            }
          }}
        >
          <img src={car} alt='car' />
          {lt('referral_btn_issue_other')}
        </IonButton>

        <IonButton
          expand='block'
          fill='outline'
          className='referral-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: t('share_osago_link_title'),
                text: t('share_osago_link_text'),
                url: data.authReferralLink,
              });
            } else {
              alert(lt('web_share_not_supported'));
            }
          }}
        >
          <img src={share} alt='share' />
          {lt('referral_btn_share')}
        </IonButton>

        {/* <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>{t('referral_instructions')}</span>
        </div> */}

        <div className='osago-check'>
          <div className='osago-title'>{lt('osago_check_title')}</div>
          <div className='osago-subtitle'>{lt('osago_check_subtitle')}</div>
          <div style={{ position: 'relative' }}>
            <IonInput
              ref={plateRef}
              className={`osago-input ${result.type}`}
              placeholder={lt('osago_plate_placeholder')}
              value={plate}
              onIonInput={(e) => setPlate(e.detail.value?.toUpperCase() ?? '')}
              fill='outline'
              mode='md'
            />
            <img
              src={cameraIcon}
              alt='cameraIcon'
              onClick={openCamModal}
              style={{
                width: '30px',
                position: 'absolute',
                top: '12px',
                right: '10px',
                zIndex: 10,
                cursor: 'pointer',
              }}
            />
          </div>
          <IonModal isOpen={isCamOpen} onDidDismiss={closeCamModal}>
            <div style={{ padding: 12 }}>
              <video
                ref={videoRef2}
                playsInline
                autoPlay
                muted
                style={{ width: '100%', height: '40vh', objectFit: 'cover', borderRadius: 8, background: '#000' }}
              />
              <canvas ref={canvasRef2} style={{ display: 'none' }} />
              <IonButton expand='block' fill='outline' onClick={closeCamModal} style={{ marginTop: 12 }}>
                Закрыть
              </IonButton>
              {/* Список не найденных полисов */}
              {notFoundPlates.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Не найденные полисы</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '30vh', overflowY: 'auto' }}>
                    {notFoundPlates.map((p) => (
                      <div
                        key={p}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#f4f5f8',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{p}</span>
                        <IonButton
                          size='small'
                          onClick={() => window.open('https://oa.kg/bishkek-osago-online', '_blank')}
                        >
                          Оформить
                        </IonButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </IonModal>
          {/* Стек тостов через портал — поверх модалки */}
          {typeof document !== 'undefined' &&
            createPortal(
              <div
                style={{
                  position: 'fixed',
                  bottom: 20,
                  right: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  zIndex: 999999, // выше ion-modal
                  pointerEvents: 'none', // клики проходят к камере/странице
                }}
              >
                {toasts.map((t) => (
                  <div
                    key={t.id}
                    style={{
                  background:
                    t.type === 'found'
                      ? '#3880ff' // синий для найденного полиса
                      : t.type === 'notfound'
                      ? '#2e7d32' // зелёный для не найденного
                      : t.type === 'error'
                      ? '#c62828' // красный для ошибок
                      : 'rgba(0,0,0,0.85)',
                      color: '#fff',
                      padding: '10px 12px',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      maxWidth: 340,
                      fontSize: 14,
                      pointerEvents: 'auto',
                    }}
                  >
                    {t.message}
                  </div>
                ))}
              </div>,
              document.body
            )}
          <div>
            Пример: <b>01KG400AAP</b>
          </div>
          <img style={{ width: '200px' }} src={example} alt='example' />
          <IonButton
            expand='block'
            className='osago-submit primary-btn'
            disabled={isFetching}
            onClick={handleCheck}
          >
            {isFetching && (
              <IonSpinner
                name='dots'
                color='light'
                className='inline-spinner'
              />
            )}
            {isFetching
              ? lt('osago_check_searching')
              : lt('osago_check_button')}
          </IonButton>
          {result.type !== 'none' && (
            <>
              <div className={`osago-result ${result.type}`}>
                {result.message}
              </div>
              {details.length > 0 && (
                <div className={`osago-details ${result.type}`}>
                  {details.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span style={{ fontSize: 12, color: '#7B7F88' }}>
            {lt('referral_legal_notice')}
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default ReferralInfo;
