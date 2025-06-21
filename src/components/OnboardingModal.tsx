import React, { useState } from 'react';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonCheckbox,
  IonText,
  IonInputOtp,
} from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './OnboardingModal.css';

const slideData = [
  {
    image: '/src/assets/onboarding/image-1.png',
    title: 'Помоги другим оформить ОСАГО и заработай до 100 000 сом',
    subtitle: 'Вознаграждение 10% от ОСАГО',
  },
  {
    image: '/src/assets/onboarding/image-2.png',
    title: 'Научи регистрировать друзей и зарабатывай пассивно от их продаж',
    subtitle: 'Вознаграждение 5% от ОСАГО друзей',
  },
  {
    image: '/src/assets/onboarding/image-3.png',
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

  if (!isOpen) return null;

  const handleSkip = () => {
    setStep(3);
  };

  const handleSendSms = () => {
    setStep(4);
  };

  const handleFinish = () => {
    localStorage.setItem('onboardingComplete', '1');
    onFinish();
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
                <span>КР (+996)</span>
                <IonInput
                  type='tel'
                  placeholder='XXXXXXXXX'
                  value={phone}
                  onIonChange={(e) => setPhone(e.detail.value!)}
                  maxlength={9}
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
              <IonButton
                expand='block'
                disabled={!phone || !agree || phone.length < 9}
                onClick={handleSendSms}
                style={{ marginTop: 24 }}
              >
                {'Начать зарабатывать'}
              </IonButton>
            </div>
          )}
          {step === 4 && (
            <div className='onboarding-form'>
              <h2>Введите код из SMS</h2>
              <IonInputOtp
                length={5}
                onChange={(e) => setSmsCode((prev) => prev + e.currentTarget.value)}
              >
                Не получили код? <a href='#'>Отправить код заново</a>
              </IonInputOtp>
              <IonButton
                expand='block'
                disabled={smsCode.length < 5}
                onClick={handleFinish}
                style={{ marginTop: 24 }}
              >
                Начать зарабатывать
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </div>
  );
};

export default OnboardingModal;
