import React from 'react';
import { IonPage, IonButton, IonInput, IonRadioGroup, IonRadio, IonLabel } from '@ionic/react';

const Withdraw: React.FC = () => (
  <IonPage style={{ overflow: 'auto', background: '#f6f8fa', padding: 16 }}>
    <div>
      {/* Форма вывода */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
        padding: '20px 18px 18px 18px',
        marginBottom: 18
      }}>
        <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 12 }}>Вывод денег</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Номер телефона</div>
        <IonInput
          value="+996 500 604 644"
          style={{
            background: '#f6f8fa',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 16,
            marginBottom: 10
          }}
          readonly
        />
        <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Сумма (Доступно 24 000 сом)</div>
        <IonInput
          value="1000"
          style={{
            background: '#f6f8fa',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 16,
            marginBottom: 10
          }}
        />
        <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Куда</div>
        <IonRadioGroup value="BakAi" style={{ display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 16 }}>
          <IonLabel>
            <IonRadio value="BakAi" />
            <span style={{ marginLeft: 6 }}>BakAi</span>
          </IonLabel>
          <IonLabel>
            <IonRadio value="MBank" />
            <span style={{ marginLeft: 6 }}>MBank</span>
          </IonLabel>
          <IonLabel>
            <IonRadio value="Деньги" />
            <span style={{ marginLeft: 6 }}>О! Деньги</span>
          </IonLabel>
        </IonRadioGroup>
        <IonButton expand="block" color="primary" style={{ borderRadius: 12, fontWeight: 500, fontSize: 17 }}>
          Вывести деньги
        </IonButton>
      </div>
      {/* История */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
        padding: '14px 14px 10px 14px',
        marginBottom: 10
      }}>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№3248 | 12:00 01.06.2025</div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - MBANK</div>
        <div style={{ color: '#1abc9c', fontWeight: 600, fontSize: 15 }}>Статус: Успешный вывод</div>
        <div style={{ color: '#888', fontSize: 13 }}>Сумма: 1000 сом</div>
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
        padding: '14px 14px 10px 14px',
        marginBottom: 10
      }}>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№3249 | 12:00 01.06.2025</div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - О! Деньги</div>
        <div style={{ color: '#ff9800', fontWeight: 600, fontSize: 15 }}>Статус: На рассмотрении</div>
        <div style={{ color: '#888', fontSize: 13 }}>Сумма: 1000 сом</div>
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
        padding: '14px 14px 10px 14px',
        marginBottom: 10
      }}>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>№3249 | 12:00 01.06.2025</div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - BakAi</div>
        <div style={{ color: '#e53935', fontWeight: 600, fontSize: 15 }}>Статус: Отказано</div>
        <div style={{ color: '#888', fontSize: 13 }}>Сумма: 1000 сом</div>
      </div>
    </div>
  </IonPage>
);

export default Withdraw;
