import { IonButton, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

import identificationCard from '../../assets/identificationCard.svg';
import identificationCardBack from '../../assets/identificationCard-back.svg';
import identificationSelfie from '../../assets/identificationSelfie.svg';

import './styles.scss';

const ProfileIdentification = () => {
  const navigate = useIonRouter();

  const onNext = () => {
    navigate.push('/a/profile/identification/passport');
  };

  return (
    <IonPage className='profile-identification'>
      <div className='identification-header'>
        <IonIcon
          onClick={() => navigate.goBack()}
          icon={arrowBackOutline}
          className='identification-back'
        />
        <span className='identification-title'>Идентификация</span>
      </div>
      <div className='identification-list'>
        <div className='identification-item'>
          <IonIcon icon={identificationCard} className='identification-icon' />
          <span>Лицевая сторона паспорта</span>
        </div>
        <div className='identification-item'>
          <IonIcon
            icon={identificationCardBack}
            className='identification-icon'
          />
          <span>Обратная сторона паспорта</span>
        </div>
        <div className='identification-item'>
          <IonIcon
            icon={identificationSelfie}
            className='identification-icon'
          />
          <span>Селфи с паспортом</span>
        </div>
      </div>
      <IonButton
        onClick={onNext}
        expand='block'
        className='identification-next'
      >
        Далее
      </IonButton>
    </IonPage>
  );
};

export default ProfileIdentification;
