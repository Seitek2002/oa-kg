import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  IonActionSheet,
  IonButton,
  IonIcon,
  IonPage,
  isPlatform,
} from '@ionic/react';
import { arrowBackOutline, closeOutline } from 'ionicons/icons';

import { OcrPassportData, useOcrCreateMutation } from '../../services/api';
import { useAppDispatch } from '../../hooks';

import identificationCard from '../../assets/identificationCard.svg';
import identificationCardBack from '../../assets/identificationCard-back.svg';
import identificationSelfie from '../../assets/identificationSelfie.svg';

import './styles.scss';
import { setPassportData } from '../../store/index';
import { useTexts } from '../../context/TextsContext';

const ProfileIdentification = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTexts();

  const [ocrCreate, { data: ocrData, isSuccess, isError, error, isLoading }] =
    useOcrCreateMutation();

  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [photos, setPhotos] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [currentKey, setCurrentKey] = useState<
    'front' | 'back' | 'selfie' | null
  >(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const isAndroid = isPlatform('android');

  const fileRefs = {
    front: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  };

  const handleItemClick = (key: 'front' | 'back' | 'selfie') => {
    fileRefs[key].current?.click();
  };

  const handleSelectSource = (source: 'gallery' | 'camera') => {
    if (!currentKey) return;

    const inputEl = fileRefs[currentKey].current;
    if (inputEl) {
      if (source === 'camera' && isAndroid) {
        inputEl.setAttribute('capture', 'environment');
      } else {
        inputEl.removeAttribute('capture');
      }
      inputEl.click();
    }
    setShowActionSheet(false);
    setCurrentKey(null);
  };

  const handleFileChange = (
    key: 'front' | 'back' | 'selfie',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => ({ ...prev, [key]: reader.result as string }));
        if (fileRefs[key].current) fileRefs[key].current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const onNext = () => {
    if (!files.front || !files.back) return;
    // dispatch(
    //   setIdentificationImages({
    //     front: files.front,
    //     back: files.back,
    //     selfie: files.selfie || null,
    //   })
    // );
    ocrCreate({
      documentType: 'passport',
      frontImage: files.front,
      backImage: files.back,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      history.push('/a/profile/identification/passport');
      dispatch(setPassportData(ocrData.data as OcrPassportData));
      localStorage.setItem('ocrPassportData', JSON.stringify(ocrData.data));
    }
    if (isError) {
      console.log(error);
    }
  }, [dispatch, error, history, isError, isSuccess, ocrData]);

  const renderInputsObj = [
    {
      key: 'front',
      title: t('id_step_front') || 'Лицевая сторона',
      image: identificationCard,
    },
    {
      key: 'back',
      title: t('id_step_back') || 'Обратная сторона',
      image: identificationCardBack,
    },
    {
      key: 'selfie',
      title: t('id_step_selfie') || 'Селфи с паспортом',
      image: identificationSelfie,
    },
  ];

  return (
    <IonPage className='profile-identification'>
      <IonActionSheet
        mode='ios'
        isOpen={showActionSheet}
        onDidDismiss={() => {
          setShowActionSheet(false);
          setCurrentKey(null);
        }}
        header={t('choose_source') || 'Выберите источник'}
        buttons={[
          {
            text: t('gallery') || 'Галерея',
            handler: () => handleSelectSource('gallery'),
          },
          {
            text: t('camera') || 'Камера',
            handler: () => handleSelectSource('camera'),
          },
          {
            text: t('cancel') || 'Отмена',
            role: 'cancel',
          },
        ]}
      />
      <div className='identification-header'>
        <IonIcon
          onClick={() => history.goBack()}
          icon={arrowBackOutline}
          className='identification-back'
        />
        <span className='identification-title'>
          {t('screen_identification')}
        </span>
      </div>
      <div className='identification-list'>
        {renderInputsObj.map(({ key, title, image }) => {
          return (
            <div
              key={key}
              className='identification-item'
              onClick={() => {
                if (!photos[key]) {
                  setCurrentKey(key as 'front' | 'back' | 'selfie');
                  if (isAndroid) {
                    return setShowActionSheet(true);
                  }
                  handleItemClick(key as 'front' | 'back' | 'selfie');
                }
              }}
            >
              {photos[key] ? (
                <div className='identification-photo-wrapper'>
                  <img
                    src={photos[key]}
                    alt={key}
                    className='identification-photo-preview'
                    onClick={() =>
                      handleItemClick(key as 'front' | 'back' | 'selfie')
                    }
                  />
                  <IonIcon
                    icon={closeOutline}
                    className='identification-photo-remove'
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotos((prev) => ({ ...prev, [key]: undefined }));
                    }}
                  />
                </div>
              ) : (
                <>
                  <IonIcon icon={image} className='identification-icon' />
                  <span>{title}</span>
                </>
              )}
              <input
                ref={fileRefs[key as 'front' | 'back' | 'selfie']}
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileChange(key as 'front' | 'back' | 'selfie', e)
                }
              />
            </div>
          );
        })}
      </div>
      <IonButton
        disabled={!photos.front || !photos.back || !photos.selfie || isLoading}
        onClick={onNext}
        expand='block'
        className='identification-next'
      >
        {t('btn_next')}
      </IonButton>
    </IonPage>
  );
};

export default ProfileIdentification;
