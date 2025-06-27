import React from 'react';
import { IonPage, IonButton } from '@ionic/react';
import identificationImg from '../../assets/identification-need.svg'; // замените на вашу картинку
import './styles.scss';

const WithdrawIdentification = () => {
  return (
    <IonPage className='withdraw-identification-page'>
      <div className='withdraw-identification-content'>
        <img
          src={identificationImg}
          alt='Требуется идентификация'
          className='withdraw-identification-img'
        />
        <div className='withdraw-identification-text'>
          Требуется идентификация для вывода денег
        </div>
        <IonButton
          expand='block'
          className='withdraw-identification-btn'
          routerLink='/a/profile/identification'
        >
          Идентификация
        </IonButton>
      </div>
    </IonPage>
  );
};

export default WithdrawIdentification;
