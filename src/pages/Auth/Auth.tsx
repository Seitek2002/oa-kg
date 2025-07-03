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

const Auth: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTexts();
  const [step, setStep] = useState(1); // 1: номер, 2: код
  const [phone, setPhone] = useState('');

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
  const history = useHistory();

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
    } catch (e: any) {
      setError(e?.data?.error || 'Ошибка отправки SMS');
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
    } catch (e: any) {
      setError(e?.data?.error || 'Ошибка проверки кода');
    }
  };

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
                        : referralData?.phoneNumber || referralId
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
              >
                {t('not_received_code') || 'Не получили код?'}{' '}
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
              </IonInputOtp>
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
