import React from 'react';
import { IonPage } from '@ionic/react';
import instructionImg from '../../assets/faq.png';
import { useTexts } from '../../context/TextsContext';

const Faq: React.FC = () => {
  const { t } = useTexts();
  return (
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
          alt={t('accident_instructions')}
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
};

export default Faq;
