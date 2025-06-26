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
import { useSendSmsMutation, useVerifySmsMutation } from '../../services/api';
import { useHistory } from 'react-router-dom';

// import '../../components/OnboardingModal.css';
import './style.scss';

const Auth: React.FC = () => {
  const [step, setStep] = useState(1); // 1: номер, 2: код
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState('');
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();
  const [verifySms, { isLoading: isVerifying }] = useVerifySmsMutation();
  const history = useHistory();

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
    try {
      const data = await verifySms({
        phoneNumber: num,
        code: smsCode,
      }).unwrap();
      if (data.access) {
        localStorage.setItem('access', JSON.stringify(data));
      }
      // После успешной авторизации можно редиректить или закрывать модалку
      history.replace('/a/home');
    } catch (e: any) {
      setError(e?.data?.message || 'Ошибка проверки кода');
    }
  };

  return (
    <IonContent scrollY={false}>
      <div className='ion-content'>
        <div style={{ padding: '120px 24px 0 24px', textAlign: 'center' }}>
          {step === 1 && (
            <div className='onboarding-form'>
              <h2 className='onboarding-title'>Начните зарабатывать</h2>
              <p className='onboarding-subtitle'>Введите номер телефона</p>
              <div className='onboarding-phoneNumber'>
                <span style={{ marginRight: 8, fontSize: 18 }}>+996</span>
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
                    fontSize: 18,
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </div>
              <IonItem lines='none'>
                <IonCheckbox
                  className='onboarding-checkbox'
                  checked={agree}
                  onIonChange={(e) => setAgree(e.detail.checked)}
                  labelPlacement='end'
                >
                  Согласен с условиями оферты OA.KG
                </IonCheckbox>
              </IonItem>
              <p className='onboarding-sms'>
                На номер телефона указанный выше будет отправлен СМС код
              </p>
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
              >
                {isSending ? 'Отправка...' : 'Начать зарабатывать'}
              </IonButton>
            </div>
          )}
          {step === 2 && (
            <div className='onboarding-form'>
              <h2>Введите код из SMS</h2>
              <IonInputOtp
                length={6}
                value={smsCode}
                onIonInput={(e) => setSmsCode(e.detail.value!)}
              >
                Не получили код?{' '}
                <a
                  href='#'
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleSendSms();
                  }}
                  style={{ color: '#1976d2', cursor: 'pointer' }}
                >
                  Отправить код заново
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
              >
                {isVerifying ? 'Проверка...' : 'Начать зарабатывать'}
              </IonButton>
            </div>
          )}
        </div>
      </div>
    </IonContent>
  );
};

export default Auth;
