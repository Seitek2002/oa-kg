import React from 'react';
import { IonPage, IonButton } from '@ionic/react';

import identificationProcessImg from '../../assets/identification-processing.svg'; // замените на нужную иллюстрацию
import './styles.scss';

const IdentificationProcess: React.FC = () => {
  return (
    <IonPage className='identification-process-page'>
      <div className='identification-process-content'>
        <h2 className='identification-process-title'>
          Идентификация в процессе
        </h2>
        <img
          src={identificationProcessImg}
          alt='Идентификация'
          className='identification-process-img'
        />
        <div className='identification-process-subtitle'>
          Подождите пока идет процесс
          <br />
          идентификации
        </div>
        <IonButton
          expand='block'
          className='identification-process-btn'
          routerLink='/a/home'
        >
          На главную
        </IonButton>
      </div>
    </IonPage>
  );
};

export default IdentificationProcess;
