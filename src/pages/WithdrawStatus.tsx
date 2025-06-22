import React from 'react';
import { IonPage, IonButton, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';

const WithdrawStatus: React.FC = () => (
  <IonPage style={{ overflow: 'auto', background: '#f6f8fa', padding: 16 }}>
    <div>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
        padding: '20px 18px 18px 18px',
        marginBottom: 18,
        textAlign: 'center'
      }}>
        <IonIcon icon={timeOutline} style={{ fontSize: 38, color: '#ff9800', marginBottom: 8 }} />
        <div style={{ color: '#222', fontWeight: 500, marginBottom: 6 }}>
          Ваша заявка на вывод принята.<br />Ожидайте, скоро деньги поступят
        </div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>№3248</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>Реквизит: +996555112233 - MBANK</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>Сумма: 1000 сом</div>
        <div style={{ color: '#ff9800', fontWeight: 500, marginBottom: 2 }}>Статус: На рассмотрении</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Комментарий: Вывод денежных средств</div>
      </div>
      <IonButton expand="block" color="primary" style={{ borderRadius: 12, fontWeight: 500, fontSize: 17 }}>
        Вернуться на главную
      </IonButton>
    </div>
  </IonPage>
);

export default WithdrawStatus;
