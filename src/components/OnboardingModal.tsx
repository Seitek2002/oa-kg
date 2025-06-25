import React, { useState } from 'react';
import { useSendSmsMutation, useVerifySmsMutation } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  IonContent,
  IonButton,
  IonItem,
  IonCheckbox,
  IonText,
  IonInput,
  IonInputOtp,
} from '@ionic/react';

import img1 from '../assets/onboarding/image-1.png';
import img2 from '../assets/onboarding/image-2.png';
import img3 from '../assets/onboarding/image-3.png';

import 'swiper/css';
import './OnboardingModal.css';

const slideData = [
  {
    image: img1,
    title: 'Помоги другим оформить ОСАГО и заработай до 100 000 сом',
    subtitle: 'Вознаграждение 10% от ОСАГО',
  },
  {
    image: img2,
    title: 'Научи регистрировать друзей и зарабатывай пассивно от их продаж',
    subtitle: 'Вознаграждение 5% от ОСАГО друзей',
  },
  {
    image: img3,
    title: 'Все легально! Стань агентом по продаже ОСАГО за 2 минуты',
    subtitle: 'Вознаграждение 5% от ОСАГО друзей',
    extra:
      'Агент ОСАГО - маркетинговая платформа компании ОСОО "Агент КейДжи" по ОСАГО. ОСОО "Агент КейДжи" является официальным партнером ЗАО "Басай Иншуренс"',
  },
];

type OnboardingModalProps = {
  isOpen: boolean;
  onFinish: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
}) => {
  const [step, setStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState('');
  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();
  const [verifySms, { isLoading: isVerifying }] = useVerifySmsMutation();

  if (!isOpen) return null;

  const handleSkip = () => {
    setStep(3);
  };

  const handleSendSms = async () => {
    setError('');
    const num = '+996' + phone;
    try {
      await sendSms({ phoneNumber: num }).unwrap();
      setSmsCode('');
      setStep(4);
    } catch (e: any) {
      setError(e?.data?.message || 'Ошибка отправки SMS');
    }
  };

  const handleFinish = async () => {
    setError('');
    const num = '+996' + phone;
    try {
      const data = await verifySms({
        phoneNumber: num,
        code: smsCode,
      }).unwrap();
      console.log(data, smsCode);
      if (data.access) {
        localStorage.setItem('access', data.access);
      }
      onFinish();
    } catch (e: any) {
      setError(e?.data?.message || 'Ошибка проверки кода');
    }
  };

  // Кастомная пагинация
  const renderPagination = () => (
    <div className='onboarding-pagination'>
      {slideData.map((_, idx) => (
        <span
          key={idx}
          className={`onboarding-dot${currentSlide === idx ? ' active' : ''}`}
        />
      ))}
    </div>
  );

  return (
    <div className='onboarding-overlay onboarding-modal'>
      <IonContent scrollY={false}>
        <div className='ion-content'>
          {step <= 2 && (
            <>
              <Swiper
                slidesPerView={1}
                onSlideChange={(swiper) => {
                  setCurrentSlide(swiper.activeIndex);
                  setStep(swiper.activeIndex);
                }}
                initialSlide={currentSlide}
                speed={400}
                allowTouchMove={true}
              >
                {slideData.map((slide, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={slide.image}
                      alt=''
                      style={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                      }}
                    />
                    {slide.extra && (
                      <IonText color='medium' style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: 14,
                            display: 'block',
                            marginTop: 12,
                          }}
                        >
                          {slide.extra}
                        </span>
                      </IonText>
                    )}
                    <h2 style={{ marginTop: 24 }} className='swiper-title'>
                      {slide.title}
                    </h2>
                    <IonText color='primary'>
                      <p>{slide.subtitle}</p>
                    </IonText>
                  </SwiperSlide>
                ))}
              </Swiper>
              {renderPagination()}
              <div style={{ background: 'white', width: '100%' }}>
                <IonButton
                  expand='block'
                  onClick={handleSkip}
                  style={{ marginTop: 32 }}
                >
                  Начать зарабатывать
                </IonButton>
                <IonButton fill='clear' expand='block' onClick={handleSkip}>
                  Пропустить
                </IonButton>
              </div>
            </>
          )}
          {step === 3 && (
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
                    width: 100,
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
          {step === 4 && (
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
                onClick={handleFinish}
                style={{ marginTop: 24 }}
              >
                {isVerifying ? 'Проверка...' : 'Начать зарабатывать'}
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </div>
  );
};

export default OnboardingModal;
