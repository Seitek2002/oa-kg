import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { arrowBackOutline, closeOutline } from 'ionicons/icons';

import { OcrPassportData, useOcrCreateMutation } from '../../services/api';
import { useAppDispatch } from '../../hooks';

import identificationCard from '../../assets/identificationCard.svg';
import identificationCardBack from '../../assets/identificationCard-back.svg';
import identificationSelfie from '../../assets/identificationSelfie.svg';

import './styles.scss';
import { setIdentificationImages, setPassportData } from '../../store/index';

const ProfileIdentification = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [ocrCreate, { data: ocrData, isSuccess, isError, error, isLoading }] =
    useOcrCreateMutation();

  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [photos, setPhotos] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  const fileRefs = {
    front: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  };

  const handleItemClick = (key: 'front' | 'back' | 'selfie') => {
    fileRefs[key].current?.click();
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
    dispatch(
      setIdentificationImages({
        front: files.front,
        back: files.back,
        selfie: files.selfie || null,
      })
    );
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

  return (
    <IonPage className='profile-identification'>
      <div className='identification-header'>
        <IonIcon
          onClick={() => history.goBack()}
          icon={arrowBackOutline}
          className='identification-back'
        />
        <span className='identification-title'>Идентификация</span>
      </div>
      <div className='identification-list'>
        {/* Лицевая сторона */}
        <div
          className='identification-item'
          onClick={() => !photos.front && handleItemClick('front')}
        >
          {photos.front ? (
            <div className='identification-photo-wrapper'>
              <img
                src={photos.front}
                alt='front'
                className='identification-photo-preview'
                onClick={() => handleItemClick('front')}
              />
              <IonIcon
                icon={closeOutline}
                className='identification-photo-remove'
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotos((prev) => ({ ...prev, front: undefined }));
                }}
              />
            </div>
          ) : (
            <>
              <IonIcon
                icon={identificationCard}
                className='identification-icon'
              />
              <span>Лицевая сторона паспорта</span>
            </>
          )}
          <input
            ref={fileRefs.front}
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange('front', e)}
          />
        </div>

        {/* Обратная сторона */}
        <div
          className='identification-item'
          onClick={() => !photos.back && handleItemClick('back')}
        >
          {photos.back ? (
            <div className='identification-photo-wrapper'>
              <img
                src={photos.back}
                alt='back'
                className='identification-photo-preview'
                onClick={() => handleItemClick('back')}
              />
              <IonIcon
                icon={closeOutline}
                className='identification-photo-remove'
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotos((prev) => ({ ...prev, back: undefined }));
                }}
              />
            </div>
          ) : (
            <>
              <IonIcon
                icon={identificationCardBack}
                className='identification-icon'
              />
              <span>Обратная сторона паспорта</span>
            </>
          )}
          <input
            ref={fileRefs.back}
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange('back', e)}
          />
        </div>

        {/* Селфи */}
        <div
          className='identification-item'
          onClick={() => !photos.selfie && handleItemClick('selfie')}
        >
          {photos.selfie ? (
            <div className='identification-photo-wrapper'>
              <img
                src={photos.selfie}
                alt='selfie'
                className='identification-photo-preview'
                onClick={() => handleItemClick('selfie')}
              />
              <IonIcon
                icon={closeOutline}
                className='identification-photo-remove'
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotos((prev) => ({ ...prev, selfie: undefined }));
                }}
              />
            </div>
          ) : (
            <>
              <IonIcon
                icon={identificationSelfie}
                className='identification-icon'
              />
              <span>Селфи с паспортом</span>
            </>
          )}
          <input
            ref={fileRefs.selfie}
            type='file'
            accept='image/*'
            capture='user'
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange('selfie', e)}
          />
        </div>
      </div>
      <IonButton
        disabled={!photos.front || !photos.back || !photos.selfie || isLoading}
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
