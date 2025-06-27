import React from 'react';
import { IonPage } from '@ionic/react';
import instructionImg from '../../assets/faq.png';

const Faq: React.FC = () => (
  <IonPage
    className='instruction-page'
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      height: '100%',
      background: '#fff',
      overflow: 'auto',
    }}
  >
    <div style={{ padding: '160px 0' }}>
      <img
        src={instructionImg}
        alt='Инструкция при ДТП'
        style={{
          maxWidth: '100%',
          maxHeight: '90vh',
          margin: '0 auto',
          display: 'block',
        }}
      />
    </div>
  </IonPage>
);

export default Faq;
