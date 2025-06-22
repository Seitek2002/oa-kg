import React from 'react';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline, carOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Osago: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
      <div>
        {/* Поиск */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 1px 6px rgba(56,128,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            marginBottom: 24,
            height: 48,
            border: '1.5px solid #e0e4ea',
          }}
        >
          <IonIcon
            icon={searchOutline}
            style={{ fontSize: 22, color: '#222', marginRight: 8 }}
          />
          <IonInput
            placeholder='Поиск'
            style={{
              border: 'none',
              outline: 'none',
              fontSize: 17,
              background: 'transparent',
              flex: 1,
            }}
          />
        </div>

        {/* Карточка полиса */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px rgba(56,128,255,0.08)',
            padding: '20px 18px 16px 18px',
            marginBottom: 32,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            Асанов Асан Асанович
          </div>
          <div style={{ color: '#b0b0b0', fontSize: 14, marginBottom: 6 }}>
            №384345
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>
            <span style={{ fontWeight: 500 }}>Машина:</span> Honda CRV
            01KG123AGV
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>
            <span style={{ fontWeight: 500 }}>Дата:</span> 12:00 01.06.2025
          </div>
          <div style={{ fontSize: 15, marginBottom: 14 }}>
            <span style={{ color: '#1abc9c', fontWeight: 600 }}>Активен</span>
            <span style={{ color: '#888', fontWeight: 400 }}>
              {' '}
              до 23:59 01.06.2026
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <IonButton
              expand='block'
              fill='outline'
              color='primary'
              style={{ flex: 1, borderRadius: 10, fontWeight: 500 }}
            >
              Скачать ОСАГО
            </IonButton>
            <IonButton
              expand='block'
              fill='outline'
              color='primary'
              style={{ flex: 1, borderRadius: 10, fontWeight: 500 }}
              onClick={() => history.push('/referral')}
            >
              Подробнее
            </IonButton>
          </div>
        </div>

        {/* Кнопка оформить ОСАГО */}
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 16,
            background: 'transparent',
            zIndex: 10,
          }}
        >
          <IonButton
            expand='block'
            color='primary'
            style={{ borderRadius: 14, fontWeight: 500, fontSize: 17 }}
          >
            <IonIcon icon={carOutline} slot='start' />
            Оформить ОСАГО
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default Osago;
