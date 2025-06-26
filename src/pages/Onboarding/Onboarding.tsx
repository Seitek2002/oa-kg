import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonContent, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import SwiperCore from 'swiper';

import img1 from '../../assets/onboarding/image-1.png';
import img2 from '../../assets/onboarding/image-2.png';
import img3 from '../../assets/onboarding/image-3.png';

import 'swiper/css';
import '../../components/OnboardingModal.css'
import './style.scss';

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

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();
  const swiperRef = useRef<SwiperCore>(null);

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

  const handleStart = () => {
    if (currentSlide < slideData.length - 1) {
      swiperRef.current?.slideNext();
    } else {
      history.push('/a/auth');
    }
  };

  return (
    <IonContent scrollY={false}>
      <div className='ion-content onboarding-content' style={{ overflow: 'auto' }}>
        <div style={{ paddingTop: '120px', textAlign: 'center' }}>
          <Swiper
            slidesPerView={1}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            initialSlide={currentSlide}
            speed={400}
            allowTouchMove={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
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
                <p>{slide.subtitle}</p>
              </SwiperSlide>
            ))}
          </Swiper>
          {renderPagination()}
        </div>
        <div style={{ background: 'white', width: '100%', paddingBottom: '40px' }}>
          <IonButton
            expand='block'
            onClick={handleStart}
            style={{ marginTop: 32 }}
          >
            Начать зарабатывать
          </IonButton>
          <IonButton fill='clear' expand='block' onClick={() => history.push('/a/auth')}>
            Пропустить
          </IonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default Onboarding;
