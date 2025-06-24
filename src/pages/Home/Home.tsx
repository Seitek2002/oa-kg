import React from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
} from '@ionic/react';
import { personAddOutline, helpCircleOutline } from 'ionicons/icons';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import car from '../../assets/car.svg';

import './styles.scss';

const Home: React.FC = () => (
  <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
    <div>
      {/* Баланс */}
      <IncomeCard amount='22 000' totalEarned='1 400 000' />

      <IonCard className='card-block osago-card'>
        <IonCardContent>
          <h3 className='card-section-title'>Ваши полисы ОСАГО</h3>
          <IonGrid>
            <IonRow>
              <IonCol size='6'>
                <div className='stat-card'>
                  <p className='stat-title'>Ваши ОСАГО</p>
                  <p className='stat-number'>21</p>
                  <p className='stat-info'>В среднем агент продает 12 штук</p>
                </div>
              </IonCol>
              <IonCol size='6'>
                <div className='stat-card'>
                  <p className='stat-title'>Доход агентов</p>
                  <p className='stat-number'>17 000</p>
                  <p className='stat-info'>В среднем зарабатывают 2 030 сом</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonButton className='btn-osago' fill='solid'>
            <IonIcon slot='start' icon={car} />
            Оформить ОСАГО
          </IonButton>
          <p className='card-footer-text'>Вы заработаете 10% от полиса ОСАГО</p>
        </IonCardContent>
      </IonCard>

      {/* Моя команда */}
      <IonCard className='card-block team-card'>
        <IonCardContent>
          <h2 className='card-section-title'>Моя команда</h2>
          <IonGrid>
            <IonRow>
              <IonCol size='6'>
                <div className='stat-card'>
                  <p className='stat-title'>Ваши агенты</p>
                  <p className='stat-number'>4</p>
                  <p className='stat-info'>Всего агентов 3 402</p>
                </div>
              </IonCol>
              <IonCol size='6'>
                <div className='stat-card'>
                  <p className='stat-title'>Доход агентов</p>
                  <p className='stat-number'>13 700</p>
                  <p className='stat-info'>В среднем 2 030 сом</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonButton className='btn-invite' fill='solid'>
            <IonIcon slot='start' icon={personAddOutline} />
            Пригласить агента
          </IonButton>
          <p className='card-footer-text'>
            Вы заработаете 10% от всех ОСАГО агентов
          </p>
        </IonCardContent>
      </IonCard>

      <IonButton className='btn-questions' expand='block' fill='outline'>
        <IonIcon slot='start' icon={helpCircleOutline} />У меня есть вопросы
      </IonButton>
    </div>
  </IonPage>
);

export default Home;
