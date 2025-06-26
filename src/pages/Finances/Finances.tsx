import { IonPage } from '@ionic/react';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';

import './styles.scss';

const Finances = () => {
  return (
    <IonPage className='finance-page'>
      <div>
        <IncomeCard />
        <div className='finance-history'>
          <TransactionStatusCard
            type='pending'
            transactionId='N°3248'
            timestamp='12:00 01.06.2025'
            amount='1000 сом'
            status='На рассмотрении'
            recipient='+9965511233 - MBANK'
            comments=''
          />
          <TransactionStatusCard
            type='deposit'
            transactionId='N°23423543'
            timestamp='12:00 01.06.2025'
            amount='200 сом'
            comments='Агент Асанов Асан, оформление ОСАГО'
            title='Заработок от агента'
          />
          <TransactionStatusCard
            type='withdrawal'
            transactionId='N°23423543'
            timestamp='12:00 01.06.2025'
            amount='1000 сом'
            comments='Агент Асанов Асан, оформление ОСАГО'
            title='Вывод средств'
          />
        </div>
      </div>
    </IonPage>
  );
};

export default Finances;
