import React, { useState } from 'react';
import { IonPage, IonButton, IonInput } from '@ionic/react';

const banks = [
  { value: 'BakAi', label: 'BakAi', color: '#2563eb', icon: '/src/assets/onboarding/image-1.png' },
  { value: 'MBank', label: 'Mbank', color: '#4caf50', icon: '/src/assets/onboarding/image-2.png' },
  { value: 'O! Деньги', label: 'O! Деньги', color: '#e53935', icon: '/src/assets/onboarding/image-3.png' },
];

const Withdraw: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState('BakAi');
  return (
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
          <div style={{
            background: '#f6f8fa',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 16,
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ color: '#222', fontWeight: 500 }}>KP (+996)</span>
            <span style={{ color: '#222', fontWeight: 500 }}>500 604 644</span>
          </div>
          <div style={{ color: '#b0b0b0', fontSize: 12, marginBottom: 8 }}>Для изменения номера обратитесь в службу поддержки</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>Сумма (сом)</span>
            <span style={{ color: '#b0b0b0', fontSize: 13 }}>Доступно 24 000 сом</span>
          </div>
          <IonInput
            value="1000"
            style={{
              background: '#f6f8fa',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 16,
              marginBottom: 12
            }}
          />
          <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Куда</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {banks.map(bank => (
              <div
                key={bank.value}
                onClick={() => setSelectedBank(bank.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: selectedBank === bank.value ? '#f0f6ff' : '#fff',
                  border: selectedBank === bank.value ? `2px solid #3880ff` : '1.5px solid #e0e4ea',
                  borderRadius: 10,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  gap: 10
                }}
              >
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${selectedBank === bank.value ? '#3880ff' : '#bbb'}`,
                  background: selectedBank === bank.value ? '#3880ff' : '#fff',
                  display: 'inline-block',
                  marginRight: 8,
                  position: 'relative'
                }}>
                  {selectedBank === bank.value && (
                    <span style={{
                      display: 'block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: 3,
                      left: 3
                    }} />
                  )}
                </span>
                <span style={{ fontWeight: 500, color: '#222' }}>{bank.label}</span>
              </div>
            ))}
          </div>
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
          <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>№3248</div>
          <div style={{ color: '#b0b0b0', fontSize: 13, marginBottom: 2 }}>12:00 01.06.2025</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - MBANK</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Сумма: 1000 сом</div>
          <div style={{ color: '#1abc9c', fontWeight: 600, fontSize: 15 }}>Статус: Успешный вывод</div>
          <div style={{ color: '#888', fontSize: 13 }}>Комментарий: Вывод</div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
          padding: '14px 14px 10px 14px',
          marginBottom: 10
        }}>
          <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>№3249</div>
          <div style={{ color: '#b0b0b0', fontSize: 13, marginBottom: 2 }}>12:00 01.06.2025</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - O! Деньги</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Сумма: 1000 сом</div>
          <div style={{ color: '#ff9800', fontWeight: 600, fontSize: 15 }}>Статус: На рассмотрении</div>
          <div style={{ color: '#888', fontSize: 13 }}>Комментарий: Вывод</div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
          padding: '14px 14px 10px 14px',
          marginBottom: 10
        }}>
          <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>№3249</div>
          <div style={{ color: '#b0b0b0', fontSize: 13, marginBottom: 2 }}>12:00 01.06.2025</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Реквизит: +996555112233 - BakAi</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Сумма: 1000 сом</div>
          <div style={{ color: '#e53935', fontWeight: 600, fontSize: 15 }}>Статус: Отказано</div>
          <div style={{ color: '#888', fontSize: 13 }}>Комментарий: Вывод</div>
        </div>
      </div>
    </IonPage>
  );
};

export default Withdraw;
