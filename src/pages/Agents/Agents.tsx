import React from 'react';
import { useHistory } from 'react-router';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { personAddOutline, searchOutline } from 'ionicons/icons';
import TeamCard from '../../components/TeamCard/TeamCard';

import './style.scss';

const Agents: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage className='agents-page'>
      <div className='search-bar'>
        <IonIcon icon={searchOutline} className='search-icon' />
        <IonInput placeholder='Поиск' className='search-input' />
      </div>

      <TeamCard />

      <div className='agent-card'>
        <div className='agent-name'>Асанов Асан Асанович</div>
        <div className='agent-info'>
          Дата регистрации: <span>12:00 01.06.2025</span>
        </div>
        <div className='agent-info'>
          Телефон: <span>+996555112233</span>
        </div>
        <div className='agent-stats'>
          <div className='stat-box'>
            <span className='stat-value'>10</span>
            <div className='stat-label'>Количество</div>
          </div>
          <div className='stat-box'>
            <span className='stat-value'>1000</span>
            <div className='stat-label'>Ваш заработок</div>
          </div>
        </div>
      </div>

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
