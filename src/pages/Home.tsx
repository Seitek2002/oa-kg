import React from 'react';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import {
  cardOutline,
  carOutline,
  personAddOutline,
  helpCircleOutline,
} from 'ionicons/icons';

const Home: React.FC = () => (
  <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
    {/* Баланс */}
    <div
      style={{
        background: 'linear-gradient(135deg, #3880ff 60%, #2563eb 100%)',
        borderRadius: 18,
        color: '#fff',
        padding: '24px 20px 20px 20px',
        boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
      }}
    >
      <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>
        Доступно
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
        24 000 <span style={{ fontSize: 20, fontWeight: 400 }}>сом</span>
      </div>
      <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 20 }}>
        Вы заработали за все время 1 400 000 сом
      </div>
      <IonButton
        expand='block'
        fill='outline'
        color='light'
        style={{ fontWeight: 500, borderRadius: 12 }}
      >
        <IonIcon icon={cardOutline} slot='start' />
        Вывести деньги
      </IonButton>
    </div>

    {/* Ваши полисы ОСАГО */}
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        marginTop: 24,
        padding: '20px 16px 16px 16px',
        boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
        Ваши полисы ОСАГО
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            background: '#f6f8fa',
            borderRadius: 12,
            padding: '12px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 15, color: '#888', marginBottom: 2 }}>
            Ваши ОСАГО
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>
            21
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            В среднем агент продает 12 штук
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: '#f6f8fa',
            borderRadius: 12,
            padding: '12px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 15, color: '#888', marginBottom: 2 }}>
            Доход агентов
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>
            17000
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            В среднем зарабатывают 2030 сом
          </div>
        </div>
      </div>
      <IonButton
        expand='block'
        color='primary'
        style={{ fontWeight: 500, borderRadius: 12, marginBottom: 8 }}
      >
        <IonIcon icon={carOutline} slot='start' />
        Оформить ОСАГО
      </IonButton>
      <div
        style={{
          color: '#1abc9c',
          fontSize: 13,
          textAlign: 'center',
          marginTop: 2,
        }}
      >
        Вы заработаете 10% от полиса ОСАГО
      </div>
    </div>

    {/* Моя команда */}
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        marginTop: 24,
        padding: '20px 16px 16px 16px',
        boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
        Моя команда
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            background: '#f6f8fa',
            borderRadius: 12,
            padding: '12px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 15, color: '#888', marginBottom: 2 }}>
            Ваши агенты
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>
            4
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Всего агентов 3402</div>
        </div>
        <div
          style={{
            flex: 1,
            background: '#f6f8fa',
            borderRadius: 12,
            padding: '12px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 15, color: '#888', marginBottom: 2 }}>
            Доход агентов
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>
            13700
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>В среднем 2030 сом</div>
        </div>
      </div>
      <IonButton
        expand='block'
        color='success'
        style={{ fontWeight: 500, borderRadius: 12, marginBottom: 8 }}
      >
        <IonIcon icon={personAddOutline} slot='start' />
        Пригласить агента
      </IonButton>
      <div
        style={{
          color: '#1abc9c',
          fontSize: 13,
          textAlign: 'center',
          marginTop: 2,
        }}
      >
        Вы заработаете 10% от всех ОСАГО агента
      </div>
    </div>

    {/* Вопросы */}
    <div style={{ marginTop: 24 }}>
      <IonButton
        expand='block'
        fill='outline'
        color='primary'
        style={{
          borderRadius: 12,
          fontWeight: 500,
          background: '#fff',
          border: '1.5px solid #3880ff',
        }}
      >
        <IonIcon icon={helpCircleOutline} slot='start' />У меня есть вопросы
      </IonButton>
    </div>
  </IonPage>
);

export default Home;
