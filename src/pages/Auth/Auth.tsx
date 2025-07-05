import React, { useState } from 'react';
import {
  IonContent,
  IonButton,
  IonItem,
  IonCheckbox,
  IonText,
  IonInput,
  IonInputOtp,
} from '@ionic/react';
import { useSendSmsMutation, useVerifySmsMutation, useUsersNameRetrieveQuery } from '../../services/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useHistory, useLocation } from 'react-router-dom';

// import '../../components/OnboardingModal.css';
import './style.scss';
import { useTexts } from '../../context/TextsContext';

type ErrorWithData = { data?: { error?: string; secondsLeft?: number } };

function isErrorWithData(e: unknown): e is ErrorWithData {
  return (
    typeof e === 'object' &&
    e !== null &&
    'data' in e &&
    typeof (e as { data?: unknown }).data === 'object' &&
    (e as { data?: unknown }).data !== null
  );
}

const Auth: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTexts();
  const history = useHistory();

  // Редирект если уже авторизован
  React.useEffect(() => {
    try {
      const tokenObj = JSON.parse(localStorage.getItem('access') || '{}');
      if (tokenObj.access) {
        history.replace('/a/home');
      }
    } catch (e) {
      // ignore JSON parse error
    }
    // eslint-disable-next-line
  }, []);
  const [step, setStep] = useState(1); // 1: номер, 2: код
  const [phone, setPhone] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('auth_secondsLeft');
    const savedTime = localStorage.getItem('auth_secondsLeft_time');
    if (saved && savedTime) {
      const diff = Math.floor((Date.now() - Number(savedTime)) / 1000);
      const left = Number(saved) - diff;
      return left > 0 ? left : 0;
    }
    return 0;
  });
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Получаем id из pathname
  const referralId = pathname.split('/')[3];
  // Делаем запрос, если есть id
  const { data: referralData } = useUsersNameRetrieveQuery(
    referralId ? Number(referralId) : skipToken
  );
  const [agree, setAgree] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState('');
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();
  const [verifySms, { isLoading: isVerifying }] = useVerifySmsMutation();

  // Автоматический вход при вводе 6-значного кода
  React.useEffect(() => {
    if (smsCode.length === 6 && !isVerifying) {
      handleVerify();
    }
    // eslint-disable-next-line
  }, [smsCode, isVerifying]);

  const handleSendSms = async () => {
    setError('');
    const num = '+996' + phone;
    try {
      await sendSms({ phoneNumber: num }).unwrap();
      setSmsCode('');
      setStep(2);
    } catch (e: unknown) {
      if (isErrorWithData(e) && e.data) {
        if (e.data.secondsLeft) {
          setSecondsLeft(e.data.secondsLeft);
          localStorage.setItem('auth_secondsLeft', String(e.data.secondsLeft));
          localStorage.setItem('auth_secondsLeft_time', String(Date.now()));
        }
        setError(e.data.error || 'Ошибка отправки SMS');
      } else {
        setError('Ошибка отправки SMS');
      }
    }
  };

  const handleVerify = async () => {
    setError('');
    const num = '+996' + phone;
    const send: { phoneNumber: string; code: string; referralCode?: string } = {
      phoneNumber: num,
      code: smsCode,
      referralCode: undefined,
    };
    setSmsCode('');

    if (pathname.split('/')[3]) {
      send.referralCode = pathname.split('/')[3];
    }

    try {
      const data = await verifySms({ ...send }).unwrap();
      if (data.access) {
        localStorage.setItem('access', JSON.stringify(data));
      }
      // После успешной авторизации можно редиректить или закрывать модалку
      history.replace('/a/home');
    } catch (e: unknown) {
      if (isErrorWithData(e) && e.data) {
        setError(e.data.error || 'Ошибка проверки кода');
      } else {
        setError('Ошибка проверки кода');
      }
    }
  };

  // Таймер
  React.useEffect(() => {
    if (secondsLeft > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            localStorage.removeItem('auth_secondsLeft');
            localStorage.removeItem('auth_secondsLeft_time');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [secondsLeft]);

  // Сброс таймера при переходе на шаг 1
  React.useEffect(() => {
    if (step === 1) {
      setSecondsLeft(0);
      localStorage.removeItem('auth_secondsLeft');
      localStorage.removeItem('auth_secondsLeft_time');
    }
  }, [step]);

  return (
    <IonContent scrollY={false}>
      <div className='ion-content'>
        <div style={{ padding: '120px 24px 0 24px', textAlign: 'center' }}>
          {step === 1 && (
            <div className='onboarding-form'>
              <h2 className='onboarding-title'>{t('screen_title_earn')}</h2>
              <p className='onboarding-subtitle'>{t('input_phone_label')}</p>
              <div className='onboarding-phoneNumber'>
                <span style={{ marginRight: 8, fontSize: 22 }}>+996</span>
                <IonInput
                  type='tel'
                  placeholder='XXXXXXXXX'
                  value={phone}
                  onIonInput={(e) => {
                    const raw = (e.detail.value || '').replace(/\D/g, '');
                    if (raw.length > 0 && raw[0] === '0') return;
                    setPhone(raw.slice(0, 9));
                  }}
                  maxlength={9}
                  style={{
                    fontSize: 22,
                    padding: 8,
                    borderRadius: 4,
                    width: 140,
                  }}
                />
              </div>
              <IonItem style={{ width: '100%' }}>
                <IonCheckbox
                  className='onboarding-checkbox'
                  checked={agree}
                  onIonChange={(e) => setAgree(e.detail.checked)}
                  labelPlacement='end'
                >
                  Согласен с условиями{' '}
                  <a
                    href='/a/ПУБЛИЧНАЯ ОФЕРТА для субагентов.docx'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      textDecoration: 'underline',
                      color: '#1976d2',
                      marginLeft: 4,
                      whiteSpace: 'break-spaces',
                    }}
                  >
                    публичной оферты
                  </a>{' '}
                  OA.KG
                </IonCheckbox>
              </IonItem>
              {isSending ? (
                <p className='onboarding-sms'>{t('sms_disclaimer')}</p>
              ) : (
                ''
              )}
              {referralId && (
                <div
                  style={{
                    textAlign: 'left',
                    paddingTop: 16,
                    gap: 8,
                  }}
                >
                  Вас пригласил:
                  <IonInput
                    readonly
                    fill='outline'
                    value={
                      referralData?.fullName?.trim()
                        ? referralData.fullName
                        : referralData?.referralId
                    }
                    style={{
                      height: 40,
                      minHeight: 20,
                      marginTop: 8,
                    }}
                  />
                </div>
              )}
              {error && (
                <IonText
                  color='danger'
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  {error}
                </IonText>
              )}
              <IonButton
                expand='block'
                disabled={!phone || !agree || phone.length < 9 || isSending}
                onClick={handleSendSms}
                style={{ marginTop: 24 }}
                className='primary-btn'
              >
                {isSending
                  ? t('sending') || 'Отправка...'
                  : t('cta_start_earning_1')}
              </IonButton>
            </div>
          )}
          {step === 2 && (
            <div className='onboarding-form'>
              <h2>{t('input_sms_label')}</h2>
              <IonInputOtp
                length={6}
                value={smsCode}
                onIonInput={(e) => setSmsCode(e.detail.value!)}
              />
              <div style={{ marginTop: 16 }}>
                {t('not_received_code') || 'Не получили код?'}{' '}
                {secondsLeft > 0 ? (
                  <span style={{ color: '#888', marginLeft: 8 }}>
                    Повторная отправка через {secondsLeft} сек.
                  </span>
                ) : (
                  <a
                    href='#'
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleSendSms();
                    }}
                    style={{ color: '#1976d2', cursor: 'pointer' }}
                  >
                    {t('resend_sms')}
                  </a>
                )}
              </div>
              {error && (
                <IonText
                  color='danger'
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </IonText>
              )}
              <IonButton
                expand='block'
                disabled={smsCode.length < 5 || isVerifying}
                onClick={handleVerify}
                style={{ marginTop: 24 }}
                className='primary-btn'
              >
                {isVerifying
                  ? t('verifying') || 'Проверка...'
                  : t('cta_start_earning_1')}
              </IonButton>
            </div>
          )}
        </div>
      </div>
    </IonContent>
  );
};

export default Auth;
