import { IonPage, IonButton } from '@ionic/react';

import { Operation } from '../../services/api';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';

import './styles.scss';

const WithdrawInfo = () => {
  const transaction: Operation = {
    type: 'withdrawal',
    status: 'paid',
    id: '1234',
    createdAt: '12:00 01.06.2025',
    amountDisplay: '1000',
    requisiteDisplay: '+996555112233 - BakAi',
  };

  return (
    <IonPage className='withdraw-info-page'>
      <TransactionStatusCard
        {...transaction}
        timestamp={transaction.createdAt}
      />
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
