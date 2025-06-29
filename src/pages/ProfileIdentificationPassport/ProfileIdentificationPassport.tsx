import React, { useEffect, useMemo, useState } from 'react';
import {
  IonPage,
  IonInput,
  IonButton,
  IonIcon,
  useIonRouter,
  IonToast,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import {
  OcrPassportData,
  useCreateIdentificationMutation,
} from '../../services/api';

import { identificationKeys, identificationSchema } from './schema';
import { useTexts } from '../../context/TextsContext';

import './styles.scss';

const ProfileIdentificationPassport = () => {
  const [createIdentification, { isLoading, isSuccess, isError, reset }] =
    useCreateIdentificationMutation();
  const { t } = useTexts();

  const navigate = useIonRouter();
  const { images, passportData } = useAppSelector(
    (state: RootState) => state.ocr
  );
  const localData = JSON.parse(
    localStorage.getItem('ocrPassportData') || '{}'
  ) as OcrPassportData;

  const [, setErrors] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const ocrData = localData || passportData;
  console.log(ocrData);

  const normalizedGender = useMemo(() => {
    const genderMap = {
      М: 'Мужчина',
      Ж: 'Женщина',
    };
    return genderMap[ocrData?.gender as keyof typeof genderMap] || 'Неизвестно';
  }, [ocrData?.gender]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formObj = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const unifiedObj = {
      inn: formObj.inn,
      passportLastName: formObj.surname,
      passportFirstName: formObj.name,
      passportMiddleName: formObj.patronymic,
      gender: formObj.gender,
      birthDate: formObj.birthDate,
      documentNumber: (formObj.documentNumber || '') + (formObj.idNumber || ''),
      issueAuthority: formObj.issueAuthority,
      issueDate: formObj.issueDate,
      expiryDate: formObj.expirationDate,
    };

    const result = identificationSchema.safeParse(unifiedObj);

    if (!result.success) {
      const errorsFormatted = result.error.format();
      const newErrors: Record<string, string[]> = {};
      identificationKeys.forEach((field) => {
        const fieldError = errorsFormatted[field];
        if (fieldError?._errors && fieldError._errors.length > 0) {
          newErrors[field] = fieldError._errors;
        }
      });
      setErrors(newErrors);
      setToast({
        open: true,
        message: 'Некоторые поля заполнены некорректно. Проверьте форму.',
      });
      return;
    }

    const finalFormData = new FormData();
    if (images.front) finalFormData.append('passportFront', images.front);
    if (images.back) finalFormData.append('passportBack', images.back);
    if (images.selfie) finalFormData.append('passportSelfie', images.selfie);

    finalFormData.append('inn', unifiedObj.inn);
    finalFormData.append('passportLastName', unifiedObj.passportLastName);
    finalFormData.append('passportFirstName', unifiedObj.passportFirstName);
    finalFormData.append('passportMiddleName', unifiedObj.passportMiddleName);
    finalFormData.append('gender', unifiedObj.gender);
    finalFormData.append('birthDate', unifiedObj.birthDate);
    finalFormData.append('documentNumber', unifiedObj.documentNumber);
    finalFormData.append('issueAuthority', unifiedObj.issueAuthority);
    finalFormData.append('issueDate', unifiedObj.issueDate);
    finalFormData.append('expiryDate', unifiedObj.expiryDate);

    createIdentification(finalFormData);
  };

  useEffect(() => {
    if (isError) {
      setToast({
        open: true,
        message: 'Ошибка при отправке данных. Пожалуйста, попробуйте ещё раз.',
      });
    }
    if (isSuccess) {
      setToast({
        open: true,
        message: 'Данные успешно отправлены. Спасибо!',
      });
      reset();
      navigate.push('/a/profile/identification/process');
    }
  }, [isError, isSuccess, navigate, reset]);

  return (
    <IonPage className='passport-page'>
      <div>
        <div className='passport-header'>
          <IonIcon
            onClick={() => navigate.goBack()}
            icon={arrowBackOutline}
            className='passport-back'
          />
          <span className='passport-title'>
            {t('passport_data') || 'Паспортные данные'}
          </span>
        </div>
        <form className='passport-form' onSubmit={handleFormSubmit}>
          <div className='passport-form-group'>
            <label className='passport-label' htmlFor='inn'>
              {t('inn') || 'ИНН'}
            </label>
            <IonInput
              name='inn'
              className='passport-input'
              placeholder={t('inn') || 'ИНН'}
              value={ocrData?.personalNumber}
            />
          </div>
          <div className='passport-form-group'>
            <label className='passport-label' htmlFor='surname'>
              {t('label_surname') || 'Фамилия'}
            </label>
            <IonInput
              name='surname'
              className='passport-input'
              placeholder={t('label_surname')}
              value={ocrData?.surname}
            />
          </div>
          <div className='passport-form-group'>
            <label className='passport-label' htmlFor='name'>
              {t('label_name') || 'Имя'}
            </label>

            <IonInput
              name='name'
              className='passport-input'
              placeholder={t('label_name')}
              value={ocrData?.name}
            />
          </div>
          <div className='passport-form-group'>
            <label className='passport-label' htmlFor='patronymic'>
              {t('label_patronymic') || 'Отчество'}
            </label>
            <IonInput
              name='patronymic'
              className='passport-input'
              placeholder={t('label_patronymic')}
              value={ocrData?.patronymic}
            />
          </div>
          <div className='passport-row'>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='gender'>
                {t('gender') || 'Пол'}
              </label>
              <IonInput
                name='gender'
                className='passport-input'
                placeholder={t('gender') || 'Пол'}
                value={normalizedGender}
              />
            </div>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='birthDate'>
                {t('birth_date') || 'Дата рождения'}
              </label>
              <IonInput
                name='birthDate'
                className='passport-input'
                placeholder={t('birth_date') || 'Дата рождения'}
                value={ocrData?.birthDate}
              />
            </div>
          </div>
          <div className='passport-row'>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='gender'>
                {t('gender') || 'Пол'}
              </label>
              <IonInput
                id='gender'
                name='gender'
                placeholder={t('gender') || 'Пол'}
                className='passport-input'
                value={normalizedGender}
              />
            </div>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='birthDate'>
                {t('birth_date') || 'Дата рождения'}
              </label>
              <IonInput
                id='birthDate'
                name='birthDate'
                placeholder={t('birth_date') || 'Дата рождения'}
                className='passport-input'
                value={ocrData?.birthDate}
              />
            </div>
          </div>
          <div className='passport-form-group'>
            <label className='passport-label' htmlFor='issueAuthority'>
              {t('issue_authority') || 'Орган выдачи'}
            </label>
            <IonInput
              name='issueAuthority'
              className='passport-input'
              placeholder={t('issue_authority') || 'Орган выдачи'}
              value={ocrData?.authority}
            />
          </div>
          <div className='passport-row'>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='issueDate'>
                {t('issue_date') || 'Дата выдачи'}
              </label>
              <IonInput
                id='issueDate'
                name='issueDate'
                placeholder={t('issue_date') || 'Дата выдачи'}
                className='passport-input'
                value={ocrData?.issueDate}
              />
            </div>
            <div className='passport-form-group'>
              <label className='passport-label' htmlFor='expirationDate'>
                {t('expiry_date') || 'Дата окончания'}
              </label>
              <IonInput
                id='expirationDate'
                name='expirationDate'
                placeholder={t('expiry_date') || 'Дата окончания'}
                className='passport-input'
                value={ocrData?.expiryDate}
              />
            </div>
          </div>
          <IonButton
            type='submit'
            expand='block'
            className='passport-next'
            disabled={isLoading}
          >
            {t('btn_next')}
          </IonButton>
        </form>
        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast({ open: false, message: '' })}
          message={toast.message}
          duration={5000}
        />
      </div>
    </IonPage>
  );
};

export default ProfileIdentificationPassport;
