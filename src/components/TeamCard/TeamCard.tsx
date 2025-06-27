import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { personAddOutline } from 'ionicons/icons';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { useEffect, useState } from 'react';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useHistory } from 'react-router-dom';

function calculateAverageIncome(totalIncome, numberOfAgents) {
  if (numberOfAgents === 0) {
    return 0;
  }
  return (totalIncome / numberOfAgents).toFixed(2);
}

const TeamCard = ({ showButton }: { showButton?: boolean }) => {
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
    <IonCard
      className='card-block team-card'
      style={{ overflow: 'visible', zIndex: 1 }}
    >
      <IonCardContent>
        <h2 className='card-section-title'>Моя команда</h2>
        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>Ваши агенты</p>
                <p className='stat-number'>{data?.agentsCount}</p>
                <p className='stat-info'>Всего агентов 3 402</p>
              </div>
            </IonCol>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>Доход агентов</p>
                <p className='stat-number'>{+data?.agentsIncome}</p>
                <p className='stat-info'>
                  В среднем{' '}
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
        {showButton && (
          <>
            <IonButton
              className='btn-invite'
              fill='solid'
              onClick={() => {
                history.push('/a/invite');
              }}
            >
              <IonIcon slot='start' icon={personAddOutline} />
              Пригласить агента
            </IonButton>
            <p className='card-footer-text'>
              Вы заработаете 10% от всех ОСАГО агентов
            </p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TeamCard;
