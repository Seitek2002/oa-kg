import React from 'react';
import { IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import './style.scss';
import TeamCard from '../../components/TeamCard/TeamCard';

const Agents: React.FC = () => {
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
      {/* <IonButton
          expand="block"
          className="invite-button"
          onClick={() => history.push("/a/invite")}
        >
          <img src={userAdd} alt="userAdd" />
          Пригласить друга в команду
        </IonButton>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => {
            let data = localStorage.getItem('usersInfo');
            let link = '';
            try {
              link = JSON.parse(data || '{}').referralLink || '';
            } catch {
              link = '';
            }
            if (navigator.share) {
              navigator.share({
                title: 'Реферальная ссылка',
                text: link ? link : 'тут должна быть ссылка',
              });
            } else {
              alert(link ? link : 'тут должна быть ссылка');
            }
          }}
        >
          Поделиться реферальной ссылкой
        </IonButton>
        <div className="commission-info">
          Вы заработаете 10% от всех ОСАГО агента
        </div> */}
    </IonPage>
  );
};

export default Agents;
