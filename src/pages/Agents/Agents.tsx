import React from 'react';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import userAdd from '../../assets/userAdd.svg';
import './style.scss';
import TeamCard from '../../components/TeamCard/TeamCard';

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
      {/* <IonButton
          expand="block"
          className="invite-button"
          onClick={() => history.push("/a/invite")}
        >
          <img src={userAdd} alt="userAdd" />
          Пригласить друга в команду
        </IonButton>
        <div className="commission-info">
          Вы заработаете 10% от всех ОСАГО агента
        </div> */}
    </IonPage>
  );
};

export default Agents;
