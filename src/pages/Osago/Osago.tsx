import React from 'react';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import car from '../../assets/car.svg'
import './style.scss'; 

const Osago: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage className="osago-page">
      <div>
        {/* Поиск */}
        <div className="search-bar">
          <IonIcon icon={searchOutline} className="search-icon" />
          <IonInput placeholder="Поиск" className="search-input" />
        </div>

        {/* Карточка полиса */}
        <div className="policy-card">
          <div className="policy-name">Асанов Асан Асанович</div>
          <div className="policy-number">№384345</div>
          <div className="policy-info">
            <span className="label">Машина:</span>
            <span className='until'> Honda CRV 01KG123AGV</span>
          </div>
          <div className="policy-info">
            <span className="label">Дата:</span>
            <span className="until"> 12:00 01.06.2025</span>

          </div>
          <div className="policy-status">
            <span className="active">Активен</span>
            <span className="until"> до 23:59 01.06.2026</span>
          </div>
          <div className="policy-buttons">
            <IonButton expand="block" fill="outline" color="primary" className="policy-btn" style={{ padding: 0 }}>
              Скачать ОСАГО
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              color="primary"
              className="policy-btn"
              onClick={() => history.push('/a/referral')}
            >
              Подробнее
            </IonButton>
          </div>
        </div>

        {/* Кнопка оформить ОСАГО */}
        <div className="bottom-button-wrapper">
          <IonButton expand="block" color="primary" className="create-osago-btn">
            <img src={car} alt="Оформить ОСАГО" />
            Оформить ОСАГО
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default Osago;
