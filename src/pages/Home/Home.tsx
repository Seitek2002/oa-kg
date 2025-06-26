import React, { useEffect } from 'react';
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
import { helpCircleOutline } from 'ionicons/icons';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import car from '../../assets/car.svg';
import { useHistory } from 'react-router';

import './styles.scss';
import TeamCard from '../../components/TeamCard/TeamCard';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
      <div>
        {/* Баланс */}
        <IncomeCard />

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
                    <p className='stat-info'>
                      В среднем зарабатывают 2 030 сом
                    </p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonButton
              className='btn-osago'
              fill='solid'
              onClick={() => history.push('/a/referral')}
            >
              <IonIcon slot='start' icon={car} />
              Оформить ОСАГО
            </IonButton>
            <p className='card-footer-text'>
              Вы заработаете 10% от полиса ОСАГО
            </p>
          </IonCardContent>
        </IonCard>

        {/* Моя команда */}
        <TeamCard />

        <IonButton className='btn-questions' expand='block' fill='outline'>
          <IonIcon slot='start' icon={helpCircleOutline} />У меня есть вопросы
        </IonButton>
      </div>
    </IonPage>
  );
};

export default Home;
