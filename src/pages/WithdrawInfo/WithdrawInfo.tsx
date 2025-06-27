import { IonPage, IonButton } from '@ionic/react';

import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';

import './styles.scss';

const WithdrawInfo = () => {
  const transaction = {
    type: 'pending' as 'withdrawal' | 'deposit' | 'pending',
    transactionId: '1234',
    timestamp: '12:00 01.06.2025',
    amount: '1000 сом',
    recipient: '+996555112233 - BakAi',
  };

  return (
    <IonPage className='withdraw-info-page'>
      <TransactionStatusCard {...transaction} />
      <IonButton
        expand='block'
        className='withdraw-info-btn'
        routerLink='/a/home'
      >
        Вернуться на главную
      </IonButton>
    </IonPage>
  );
};

export default WithdrawInfo;
