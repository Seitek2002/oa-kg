import React from 'react';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { personAddOutline, informationCircleOutline } from 'ionicons/icons';
import inviteLogo from '../assets//onboarding/inviteLogo.png';

import { useLazyGetCurrentUserQuery } from '../services/api';
import { useEffect, useState } from 'react';
import { CompareLocaldata } from '../helpers/CompareLocaldata';

const InviteFriend: React.FC = () => {
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
    // eslint-disable-next-line
  }, []);

  return (
    <IonPage
      style={{
        padding: 16,
        background: '#f6f8fa',
        overflow: 'auto',
        textAlign: 'center',
      }}
    >
      <div>
        <img
          src={inviteLogo}
          alt='Invite'
          style={{
            width: '100%',
            margin: '0 auto 18px auto',
            display: 'block',
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
          Научи регистрировать друзей и зарабатывай
          <br />
          пассивно от их продаж
        </div>
        <div style={{ color: '#1abc9c', fontSize: 16, marginBottom: 22 }}>
          Вознаграждение 5% от ОСАГО друзей
        </div>
        <IonButton
          expand='block'
          color='primary'
          style={{
            fontWeight: 500,
            borderRadius: 12,
            marginBottom: 18,
            fontSize: 17,
          }}
          onClick={() => {
            const link = data?.referralLink || '';
            if (navigator.share) {
              navigator.share({
                title: 'Приглашение в команду',
                text: 'Приглашаю тебя в мою команду! Давай зарабатывать вместе на ОСАГО',
                url: link,
              });
            } else {
              alert(link ? link : 'тут должна быть ссылка');
            }
          }}
        >
          <IonIcon icon={personAddOutline} slot='start' />
          Пригласить друга в команду
        </IonButton>
        <div
          style={{
            background: '#F2F5FF',
            borderRadius: 10,
            padding: '10px 12px',
            color: '#3b4a5a',
            fontSize: 14,
            marginTop: 8,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <IonIcon
            icon={informationCircleOutline}
            style={{
              color: '#3880ff',
              fontSize: 20,
              marginTop: 2,
              width: 24,
              height: 24,
            }}
          />
          <span style={{ fontSize: 12, width: '80%' }}>
            Отправьте реферальную ссылку – промокод подставится автоматически
            после перехода по ней. Отправьте код – клиенту/партнеру необходимо
            будет ввести его в специальное поле.
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default InviteFriend;
