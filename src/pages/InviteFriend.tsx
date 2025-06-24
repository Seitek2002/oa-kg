import React from 'react';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { personAddOutline, informationCircleOutline } from 'ionicons/icons';
import inviteLogo from '../assets//onboarding/inviteLogo.png'

const InviteFriend: React.FC = () => (
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
        style={{ width: "100%", margin: '0 auto 18px auto', display: 'block' }}
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
      >
        <IonIcon icon={personAddOutline} slot='start' />
        Пригласить друга в команду
      </IonButton>
      <div
        style={{
          background: '#f6f8fa',
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
          style={{ color: '#3880ff', fontSize: 20, marginTop: 2 }}
        />
        <span>
          Отправьте реферальную ссылку – промокод подставится автоматически
          после перехода по ней. Отправьте код – клиенту/партнеру необходимо
          будет ввести его в специальное поле.
        </span>
      </div>
    </div>
  </IonPage>
);

export default InviteFriend;
