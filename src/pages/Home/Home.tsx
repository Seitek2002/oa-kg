import { FC, useEffect, useState } from 'react';
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
import { useHistory } from 'react-router';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import TeamCard from '../../components/TeamCard/TeamCard';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';

import './styles.scss';

function calculateAverageIncome(totalIncome: number, numberOfAgents: number) {
  if (numberOfAgents === 0) {
    return 0;
  }
  return (totalIncome / numberOfAgents).toFixed(2);
}

const Home: FC = () => {
  const history = useHistory();
  const localData =
    localStorage.getItem('usersInfo') ||
    `{
        "id": 0,
        "firstName": "",
        "lastName": "",
        "middleName": "",
        "phoneNumber": "+996",
        "balance": "0",
        "totalIncome": "0",
        "osagoIncome": "0",
        "agentsIncome": "0",
        "osagoCount": 0,
        "agentsCount": 0,
        "referralLink": "string",
        "identificationStatus": "not_submitted"
      }`;

  const [data, setData] = useState(JSON.parse(localData));

  const [getUserInfo] = useLazyGetCurrentUserQuery();

  const handleFetch = async () => {
    const res = await getUserInfo().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'usersInfo',
      setState: setData,
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

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
                    <p className='stat-number'>{data.osagoCount}</p>
                    <p className='stat-info'>В среднем агент продает 12 штук</p>
                  </div>
                </IonCol>
                <IonCol size='6'>
                  <div className='stat-card'>
                    <p className='stat-title'>Доход агентов</p>
                    <p className='stat-number'>{+data?.agentsIncome}</p>
                    <p className='stat-info'>
                      В среднем зарабатывают{' '}
                      {calculateAverageIncome(
                        data?.agentsIncome,
                        data?.agentsCount
                      )}{' '}
                      сом
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
        <TeamCard showButton={true} />

        <IonButton
          onClick={() => {
            window.open(
              'https://t.me/+ZMp1eTcT_4Y2MGEy',
              '_blank',
              'noopener,noreferrer'
            );
          }}
          className='btn-questions'
          expand='block'
          fill='outline'
        >
          <IonIcon slot='start' icon={helpCircleOutline} />У меня есть вопросы
        </IonButton>
      </div>
    </IonPage>
  );
};

export default Home;
