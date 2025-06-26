import React from 'react';
import {
  IonPage,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import {
  idOptions,
  issueAuthorityOptions,
} from './ProfileIdentificationPassport.helpers';
import toggle from '../../assets/toggle.svg';

import './styles.scss';

const ProfileIdentificationPassport = () => {
  const navigate = useIonRouter();
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <IonPage className='passport-page'>
      <div>
        <div className='passport-header'>
          <IonIcon
            onClick={() => navigate.goBack()}
            icon={arrowBackOutline}
            className='passport-back'
          />
          <span className='passport-title'>Паспортные данные</span>
        </div>
        <form className='passport-form' onSubmit={handleFormSubmit}>
          <IonInput name='inn' className='passport-input' placeholder='Инн' />
          <IonInput
            name='lastName'
            className='passport-input'
            placeholder='Фамилия'
          />
          <IonInput
            name='firstName'
            className='passport-input'
            placeholder='Имя'
          />
          <IonInput
            name='patronymic'
            className='passport-input'
            placeholder='Отчество'
          />
          <div className='passport-row'>
            <IonSelect
              name='gender'
              className='passport-input'
              placeholder='Пол'
              toggleIcon={toggle}
              interface='popover'
            >
              <IonSelectOption value='male'>Мужской</IonSelectOption>
              <IonSelectOption value='female'>Женский</IonSelectOption>
            </IonSelect>
            <IonInput
              name='birthDate'
              className='passport-input'
              placeholder='Дата рождения'
            />
          </div>

          <div className='passport-row'>
            <IonSelect
              name='idType'
              className='passport-input'
              placeholder='ID'
              toggleIcon={toggle}
              interface='popover'
            >
              {idOptions.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonInput
              name='idNumber'
              className='passport-input'
              placeholder='2303-04'
              type='number'
            />
          </div>
          <IonSelect
            name='issueAuthority'
            className='passport-input'
            placeholder='Орган выдачи'
            toggleIcon={toggle}
            interface='popover'
          >
            {issueAuthorityOptions.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
          <div className='passport-row'>
            <IonInput
              name='issueDate'
              className='passport-input'
              placeholder='Дата выдачи'
            />
            <IonInput
              name='expirationDate'
              className='passport-input'
              placeholder='Дата окончания'
            />
          </div>
          <IonButton type='submit' expand='block' className='passport-next'>
            Далее
          </IonButton>
        </form>
      </div>
    </IonPage>
  );
};

export default ProfileIdentificationPassport;
