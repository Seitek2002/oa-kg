import React from 'react';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { carOutline, shareOutline, informationCircleOutline } from 'ionicons/icons';

const ReferralInfo: React.FC = () => (
  <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px rgba(56,128,255,0.08)',
      padding: '24px 18px 18px 18px',
      marginBottom: 24,
      textAlign: 'center'
    }}>
      <img
        src="/src/assets/onboarding/image-3.png"
        alt="Бакаи Иншуренс"
        style={{ width: 120, marginBottom: 12 }}
      />
      <div style={{ color: '#222', fontSize: 15, marginBottom: 18 }}>
        ЗАО «Бакаи Иншуренс» является дочерней компанией ОАО «Бакаи Банк», что является гарантом надежности и финансовой устойчивости бренда.
      </div>
      <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 6 }}>Ваш реферальный код</div>
      <div style={{ fontWeight: 700, fontSize: 38, marginBottom: 18 }}>3142</div>
      <IonButton expand="block" color="primary" style={{ borderRadius: 12, fontWeight: 500, marginBottom: 10 }}>
        <IonIcon icon={carOutline} slot="start" />
        Оформить ОСАГО другому человеку
      </IonButton>
      <IonButton expand="block" fill="outline" color="primary" style={{ borderRadius: 12, fontWeight: 500, marginBottom: 10 }}>
        <IonIcon icon={shareOutline} slot="start" />
        Поделиться реферальной&nbsp;ссылкой
      </IonButton>
      <div style={{
        background: '#f6f8fa',
        borderRadius: 10,
        padding: '10px 12px',
        color: '#3b4a5a',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'left',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8
      }}>
        <IonIcon icon={informationCircleOutline} style={{ color: '#3880ff', fontSize: 20, marginTop: 2 }} />
        <span>
          Отправьте реферальную ссылку – промокод подставится автоматически после перехода по ней. Отправьте код – клиенту/партнеру необходимо будет ввести его в специальное поле.
        </span>
      </div>
    </div>
  </IonPage>
);

export default ReferralInfo;
