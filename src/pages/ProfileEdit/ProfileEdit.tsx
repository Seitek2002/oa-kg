import React, { useState } from 'react';
import {
  IonAvatar,
  IonButton,
  IonInput,
  IonLabel,
  IonPage,
} from '@ionic/react';
import avatar from '../../assets/avatar-default.svg';
import { z } from 'zod';

import './styles.scss';

const initialFormState = {
  firstName: '',
  lastName: '',
  patronymic: '',
};

const formDataSchema = z.object({
  firstName: z.string().min(2, { message: 'Минимум 2 символа' }),
  lastName: z.string().min(2, { message: 'Минимум 2 символа' }),
  patronymic: z.string().min(2, { message: 'Минимум 2 символа' }),
});

type FormData = z.infer<typeof formDataSchema>;

const ProfileEdit = () => {
  const [userFormData, setFormData] = useState<Partial<FormData>>({});

  const formData = {
    ...initialFormState,
    ...userFormData,
  };

  const validate = () => {
    const res = formDataSchema.safeParse(formData);

    if (res.success) {
      return undefined;
    }
    return res.error.format();
  };

  const errors = validate();

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors) {
      console.log('Form has errors:', errors);
      return;
    }
  };

  return (
    <IonPage className='profile-page profile-edit'>
      <div className='profile-edit-header'>
        <IonAvatar className='profile-edit-avatar'>
          <img src={avatar} alt='Avatar' />
        </IonAvatar>
        <span>Редактировать</span>
      </div>
      <form className='profile-edit-form' onSubmit={handleSubmit}>
        <div className='profile-edit-group'>
          <IonLabel className='profile-edit-label'>Имя</IonLabel>
          <IonInput
            name='firstName'
            className='profile-edit-input'
            placeholder='Иван'
            value={userFormData.firstName}
            onIonChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                firstName: e.detail.value ?? '',
              }))
            }
          />
          {errors && errors?.firstName?._errors && (
            <span className='error'>{errors.firstName._errors.join(', ')}</span>
          )}
        </div>
        <div className='profile-edit-group'>
          <IonLabel className='profile-edit-label'>Фамилия</IonLabel>
          <IonInput
            name='lastName'
            className='profile-edit-input'
            placeholder='Иванов'
            value={userFormData.lastName}
            onIonChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lastName: e.detail.value ?? '',
              }))
            }
          />
          {errors && errors?.lastName?._errors && (
            <span className='error'>{errors.lastName._errors.join(', ')}</span>
          )}
        </div>
        <div className='profile-edit-group'>
          <IonLabel className='profile-edit-label'>Отчество</IonLabel>
          <IonInput
            name='patronymic'
            className='profile-edit-input'
            placeholder='Иванович'
            value={userFormData.patronymic}
            onIonChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                patronymic: e.detail.value ?? '',
              }))
            }
          />
          {errors && errors?.patronymic?._errors && (
            <span className='error'>
              {errors.patronymic._errors.join(', ')}
            </span>
          )}
        </div>

        <IonButton
          disabled={!!errors}
          type='submit'
          expand='block'
          size='default'
          className='profile-edit-save'
        >
          Сохранить
        </IonButton>
      </form>
    </IonPage>
  );
};

export default ProfileEdit;
