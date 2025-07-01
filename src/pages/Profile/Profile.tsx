import React, { useMemo } from 'react';
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonPage,
  useIonRouter,
} from '@ionic/react';
import {
  chevronForwardOutline,
  createOutline,
  helpCircleOutline,
} from 'ionicons/icons';

import { useGetCurrentUserQuery } from '../../services/api';

import avatar from '../../assets/avatar-default.svg';
import helpBuoy from '../../assets/helpBuoyFilled.svg';
import helpQuestion from '../../assets/helpQuestionFilled.svg';

import './styles.scss';
import { useTexts } from '../../context/TextsContext';

const Profile: React.FC = () => {
  const navigate = useIonRouter();
  const { t } = useTexts();

  const { data: user } = useGetCurrentUserQuery();

  const editClick = () => {
    navigate.push('profile/edit');
  };

  const identificationClick = () => {
    if (user?.identificationStatus === 'not_submitted') {
      navigate.push('profile/identification');
    } else {
      window.open(
        'https://t.me/+ZMp1eTcT_4Y2MGEy',
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const fullName = useMemo(() => {
    return user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName} ${user.middleName}`
      : null;
  }, [user?.firstName, user?.lastName, user?.middleName]);

  return (
    <IonPage className='profile-page'>
      <div>
        <div className='profile-header'>
          <IonAvatar className='profile-avatar'>
            <img src={avatar} alt='Avatar' />
            <IonIcon
              onClick={editClick}
              className='profile-edit'
              icon={createOutline}
            ></IonIcon>
          </IonAvatar>
          <span className='profile-name'>{fullName || user?.phoneNumber}</span>
          <span
            className={`profile-status ${
              user?.identificationStatus === 'approved'
                ? 'identified'
                : 'not-identified'
            }`}
          >
            {user?.identificationStatus === 'approved'
              ? t('user_status_identified')
              : t('user_status_not_identified')}
          </span>
        </div>
        <div className='profile-actions'>
          <div
            className='profile-action'
            onClick={() => navigate.push('/a/instruction')}
          >
            <div className='profile-action__icon profile-action__icon--blue'>
              <IonIcon icon={helpBuoy} />
            </div>
            <div className='profile-action__content'>
              <div className='profile-action__title profile-action__title--blue'>
                {t('insurance_case_title')}
              </div>
              <div className='profile-action__subtitle'>
                {t('accident_instructions')}
              </div>
            </div>
            <IonIcon
              icon={chevronForwardOutline}
              className='profile-action__arrow'
            />
          </div>
          <div
            className='profile-action'
            onClick={() => navigate.push('/a/my-faq')}
          >
            <div className='profile-action__icon profile-action__icon--gray'>
              <IonIcon icon={helpQuestion} />
            </div>
            <div className='profile-action__content'>
              <div className='profile-action__title'>{t('faq_prompt')}</div>
              <div className='profile-action__subtitle'>
                {t('faq_title')}
              </div>
            </div>
            <IonIcon
              icon={chevronForwardOutline}
              className='profile-action__arrow'
            />
          </div>
          <IonButton
            onClick={identificationClick}
            className='outlined-btn'
            expand='block'
            fill='outline'
          >
            {(user?.identificationStatus === 'approved' ||
              user?.identificationStatus === 'pending') && (
              <IonIcon slot='start' icon={helpCircleOutline} />
            )}
            {user?.identificationStatus === 'not_submitted'
              ? t('verify_button')
              : t('btn_help')}
          </IonButton>
          <div className='profile-contacts'>
            <h2>{t('contacts_title')}</h2>
            <p>
              {t('contacts_address')}
            </p>
            <IonButton
              href='tel:+996777394080'
              className='outlined-btn'
              expand='block'
              fill='outline'
            >
              {t('call_button')}
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Profile;
