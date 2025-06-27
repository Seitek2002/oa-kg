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

import './styles.scss';

const ProfileIdentificationPassport = () => {
  const [createIdentification, { isLoading, isSuccess, isError }] =
    useCreateIdentificationMutation();
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

  const normalizedGender = useMemo(() => {
    const genderObj = {
      М: 'Мужчина',
      Ж: 'Женщина',
    };
    return genderObj[ocrData?.gender as keyof typeof genderObj] || 'Неизвестно';
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
    console.log({ unifiedObj });
    console.log({ formObj });

    const result = identificationSchema.safeParse(unifiedObj);

    console.log({ result });

    if (!result.success) {
      const formatted = result.error.format();
      const newErrors: Record<string, string[]> = {};

      identificationKeys.forEach((field) => {
        const fieldError = formatted[field];
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
        message: 'Ошибка при отправке данных. Пожалуйста, попробуйте еще раз.',
      });
    }
    if (isSuccess) {
      setToast({
        open: true,
        message: 'Данные успешно отправлены. Спасибо!',
      });
      navigate.push('/a/profile/identification/process');
    }
  }, [isError, isSuccess, navigate]);

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
          <IonInput
            name='inn'
            className='passport-input'
            placeholder='ИНН'
            value={ocrData?.personalNumber}
          />
          <IonInput
            name='surname'
            className='passport-input'
            placeholder='Фамилия'
            value={ocrData?.surname}
          />
          <IonInput
            name='name'
            className='passport-input'
            placeholder='Имя'
            value={ocrData?.name}
          />
          <IonInput
            name='patronymic'
            className='passport-input'
            placeholder='Отчество'
            value={ocrData?.patronymic}
          />
          <div className='passport-row'>
            <IonInput
              name='gender'
              className='passport-input'
              placeholder='Пол'
              value={normalizedGender}
            />
            <IonInput
              name='birthDate'
              className='passport-input'
              placeholder='Дата рождения'
              value={ocrData?.birthDate}
            />
          </div>
          <div className='passport-row'>
            <IonInput
              name='documentNumber'
              className='passport-input'
              placeholder='ID'
              value={ocrData?.documentNumber.slice(0, 2)}
            />
            <IonInput
              name='idNumber'
              className='passport-input'
              placeholder='2303-04'
              type='number'
              value={ocrData?.documentNumber.slice(2)}
            />
          </div>
          <IonInput
            name='issueAuthority'
            className='passport-input'
            placeholder='Орган выдачи'
            value={ocrData?.authority}
          />
          <div className='passport-row'>
            <IonInput
              name='issueDate'
              className='passport-input'
              placeholder='Дата выдачи'
              value={ocrData?.issueDate}
            />
            <IonInput
              name='expirationDate'
              className='passport-input'
              placeholder='Дата окончания'
              value={ocrData?.expiryDate}
            />
          </div>
          <IonButton
            disabled={isLoading}
            type='submit'
            expand='block'
            className='passport-next'
          >
            Далее
          </IonButton>
        </form>
        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast({ open: false, message: '' })}
          message={toast.message}
          duration={5000}
        ></IonToast>
      </div>
    </IonPage>
  );
};

export default ProfileIdentificationPassport;
