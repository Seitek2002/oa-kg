import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLazyGetPoliciesQuery, Policy } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import car from '../../assets/car.svg';
import './style.scss';

const Osago: React.FC = () => {
  const history = useHistory();

  // Паттерн localData + data + getPolicies + handleFetch + useEffect
  const localData = localStorage.getItem('policies') || '[]';

  const [data, setData] = useState<Policy[]>(JSON.parse(localData));
  const [getPolicies] = useLazyGetPoliciesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFetch = async () => {
    const res = await getPolicies().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'policies',
      setState: (data: any) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  // Фильтрация по поиску
  const filtered = data.filter((policy) => {
    const term = searchTerm.toLowerCase();
    return policy.fullName.toLowerCase().includes(term);
  });

  return (
    <IonPage className='osago-page'>
      <div>
        {/* Поиск */}
        <div className='search-bar'>
          <IonIcon icon={searchOutline} className='search-icon' />
          <IonInput
            placeholder='Поиск'
            className='search-input'
            value={searchTerm}
            onIonInput={e => setSearchTerm((e.detail.value || '').toLowerCase())}
          />
        </div>

        {/* Список полисов */}
        {filtered.map((policy) => (
          <div className='policy-card' key={policy.id}>
            <div className='policy-name'>{policy.fullName}</div>
            <div className='policy-number'>№{policy.id}</div>
            <div className='policy-info'>
              <span className='label'>Машина:</span>
              <span className='until'> {policy.vehicle || '—'}</span>
            </div>
            <div className='policy-info'>
              <span className='label'>Дата:</span>
              <span className='until'> {policy.startDate}</span>
            </div>
            <div className='policy-status'>
              <span className='active'>Активен</span>
              <span className='until'> до {policy.endDate}</span>
            </div>
            <div className='policy-buttons'>
              <IonButton
                expand='block'
                fill='outline'
                color='primary'
                className='policy-btn'
                style={{ padding: 0 }}
                href={policy.policyPdfUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Скачать ОСАГО
              </IonButton>
            </div>
          </div>
        ))}

        {/* Кнопка оформить ОСАГО */}
        <div className='bottom-button-wrapper'>
          <IonButton
            expand='block'
            color='primary'
            className='create-osago-btn'
            onClick={() => history.push('/a/referral')}
          >
            <img src={car} alt='Оформить ОСАГО' />
            Оформить ОСАГО
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default Osago;
