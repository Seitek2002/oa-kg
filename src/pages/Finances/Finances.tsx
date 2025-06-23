import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonPage,
} from '@ionic/react';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';

import './styles.scss';

const Finances = () => {
  return (
    <IonPage className='finance-page'>
      <div>
        <IonCard color='white' className='finance-card incomeCard'>
          <IonCardHeader>
            <IonCardSubtitle className='finance-card-subtitle'>
              Доступно
            </IonCardSubtitle>
            <IonCardTitle className='finance-card-title'>
              24 000 сом
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Вы заработали за все время 1 400 000 сом
          </IonCardContent>
          <IonCardContent>
            <button className='finance-button'>Вывести деньги</button>
          </IonCardContent>
        </IonCard>
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
