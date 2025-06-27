import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { personAddOutline, searchOutline } from 'ionicons/icons';
import TeamCard from '../../components/TeamCard/TeamCard';
import { useLazyGetReferralsQuery, Referral } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import './style.scss';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

const Agents: React.FC = () => {
  const history = useHistory();

  // Паттерн localData + data + getReferrals + handleFetch + useEffect
  const localData = localStorage.getItem('referrals') || '[]';

  const [data, setData] = useState<Referral[]>(JSON.parse(localData));
  const [getReferrals] = useLazyGetReferralsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFetch = async () => {
    const res = await getReferrals().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'referrals',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  // Фильтрация по имени
  const filtered = data.filter((agent) =>
    agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage className='agents-page'>
      <div className='search-bar'>
        <IonIcon icon={searchOutline} className='search-icon' />
        <IonInput
          placeholder='Поиск'
          className='search-input'
          value={searchTerm}
          onIonInput={(e) =>
            setSearchTerm((e.detail.value || '').toLowerCase())
          }
        />
      </div>

      <TeamCard />

      {filtered.map((agent) => (
        <div className='agent-card' key={agent.id}>
          <div className='agent-name'>{agent.fullName}</div>
          <div className='agent-info'>
            Дата регистрации: <span>{formatDate(agent.dateJoined)}</span>
          </div>
          <div className='agent-info'>
            Телефон: <span>{agent.phoneNumber}</span>
          </div>
          <div className='agent-stats'>
            <div className='stat-box'>
              <span className='stat-value'>{agent.osagoCount}</span>
              <div className='stat-label'>Количество</div>
            </div>
            <div className='stat-box'>
              <span className='stat-value'>{agent.osagoIncome}</span>
              <div className='stat-label'>Ваш заработок</div>
            </div>
          </div>
        </div>
      ))}

      <div className='agents-bottom'>
        <IonButton
          className='invite-button'
          fill='solid'
          onClick={() => {
            history.push('/a/invite');
          }}
        >
          <IonIcon slot='start' icon={personAddOutline} />
          Пригласить друга в команду
        </IonButton>
        <div className='commission-info'>
          Вы заработаете 10% от всех ОСАГО агента
        </div>
      </div>
    </IonPage>
  );
};

export default Agents;
