import React from 'react';
import { IonPage, IonButton, IonIcon } from '@ionic/react';
import { cardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Finance: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage style={{ overflow: 'auto', background: '#f6f8fa', padding: 16 }}>
      <div>
        {/* Баланс и заявка */}
        <div style={{
          background: 'linear-gradient(135deg, #3880ff 60%, #2563eb 100%)',
          borderRadius: 18,
          color: '#fff',
          padding: '24px 20px 20px 20px',
          boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
          marginBottom: 18
        }}>
          <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>Доступно</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>24 000 <span style={{ fontSize: 20, fontWeight: 400 }}>сом</span></div>
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 20 }}>Вы заработали за все время 1 400 000 сом</div>
          <IonButton
            expand="block"
            fill="outline"
            color="light"
            style={{ fontWeight: 500, borderRadius: 12 }}
            onClick={() => history.push('/a/withdraw')}
          >
            <IonIcon icon={cardOutline} slot="start" />
            Вывести деньги
          </IonButton>
        </div>
        {/* Ваша заявка */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
          padding: '16px 14px 14px 14px',
          marginBottom: 18
        }}>
          <div style={{ color: '#222', fontWeight: 500, marginBottom: 6 }}>
            Ваша заявка на вывод принята, ожидайте, скоро деньги поступят
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>№3248</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>Реквизит: +996555112233 - MBANK</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>Сумма: 1000 сом</div>
          <div style={{ color: '#ff9800', fontWeight: 500, marginBottom: 2 }}>Статус: На рассмотрении</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Комментарий: Вывод денежных средств</div>
          <IonButton expand="block" fill="outline" color="primary" style={{ borderRadius: 10, fontWeight: 500 }}>
            Вывод денежных средств
          </IonButton>
        </div>
        {/* История */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
            padding: '14px 14px 10px 14px',
            marginBottom: 10
          }}>
            <div style={{ color: '#1abc9c', fontWeight: 600, fontSize: 16 }}>+200 сом</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№2345343 | 12:00 01.06.2025</div>
            <div style={{ color: '#888', fontSize: 13 }}>Агент Асанов Асан, оформление ОСАГО</div>
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
            padding: '14px 14px 10px 14px',
            marginBottom: 10
          }}>
            <div style={{ color: '#1abc9c', fontWeight: 600, fontSize: 16 }}>+250 сом</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№2345343 | 12:00 01.06.2025</div>
            <div style={{ color: '#888', fontSize: 13 }}>Оформление ОСАГО Асанову Асану</div>
          </div>
          <div style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
            padding: '14px 14px 10px 14px',
            marginBottom: 10
          }}>
            <div style={{ color: '#e53935', fontWeight: 600, fontSize: 16 }}>-1000 сом</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№2345343 | 12:00 01.06.2025</div>
            <div style={{ color: '#888', fontSize: 13 }}>Вывод на MBANK +996555112233</div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Finance;
