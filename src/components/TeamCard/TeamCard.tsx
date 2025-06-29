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
import { useTexts } from '../../context/TextsContext';

function calculateAverageIncome(totalIncome: number, numberOfAgents: number) {
  if (numberOfAgents === 0) {
    return 0;
  }
  return (totalIncome / numberOfAgents).toFixed(2);
}

const TeamCard = ({ showButton }: { showButton?: boolean }) => {
  const history = useHistory();
  const { t } = useTexts();
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
        <h2 className='card-section-title'>{t('section_team')}</h2>
        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('agents_count_label')}</p>
                <p className='stat-number'>{data?.agentsCount}</p>
                <p className='stat-info'>{t('team_total_desc')}</p>
              </div>
            </IonCol>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('income_agents_label')}</p>
                <p className='stat-number'>{+data?.agentsIncome}</p>
                <p className='stat-info'>
                  {t('stat_desc_4').replace(
                    '2030',
                    calculateAverageIncome(
                      data?.agentsIncome,
                      data?.agentsCount
                    ).toString()
                  )}
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
              {t('btn_invite_agent')}
            </IonButton>
            <p className='card-footer-text'>{t('earn_10_percent')}</p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TeamCard;
