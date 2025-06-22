import React from 'react';
import { IonButton, IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline, personAddOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Agents: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
      {/* Поиск */}
      <div>
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

        {/* Моя команда */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            marginBottom: 18,
            padding: '20px 16px 16px 16px',
            boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
            Моя команда
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
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
              <div style={{ fontSize: 12, color: '#888' }}>
                Всего агентов 3402
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
                13700
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>
                В среднем зарабатывают 2030 сом
              </div>
            </div>
          </div>
        </div>

        {/* Карточка агента */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            marginBottom: 18,
            padding: '18px 16px 16px 16px',
            boxShadow: '0 2px 8px rgba(56,128,255,0.04)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
            Асанов Асан Асанович
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
            Дата регистрации:{' '}
            <span style={{ color: '#222' }}>12:00 01.06.2025</span>
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 10 }}>
            Телефон: <span style={{ color: '#222' }}>+996555112233</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
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
                Количество
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>
                10
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
                Ваш заработок
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>
                1000
              </div>
            </div>
          </div>
          <IonButton
            expand='block'
            color='success'
            style={{ fontWeight: 500, borderRadius: 12, marginBottom: 8 }}
            onClick={() => history.push('/invite')}
          >
            <IonIcon icon={personAddOutline} slot='start' />
            Пригласить друга в команду
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
      </div>
    </IonPage>
  );
};

export default Agents;
