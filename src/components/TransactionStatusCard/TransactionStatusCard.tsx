import { FC } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonImg,
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import clock from '../../assets/clock-time.svg';

import './styles.scss';

interface ITransactionStatusCardProps {
  type: 'withdrawal' | 'deposit' | 'pending';
  transactionId: string;
  timestamp: string;
  amount: string;
  status?: string;
  recipient?: string;
  comments?: string;
  title?: string;
}

const TransactionStatusCard: FC<ITransactionStatusCardProps> = ({
  type,
  transactionId,
  timestamp,
  amount,
  status,
  recipient,
  comments,
  title,
}) => {
  return (
    <IonCard className='transactionStatusCard'>
      {status === 'created' && (
        <IonCardHeader className='transactionStatusCard-header'>
          <IonImg className='clock' src={clock} alt='Clock' />
          <div className='transactionHeader'>
            <p className=''>Ваша заявка на вывод принята.</p>
            <p className=''>Ожидайте, скоро деньги поступят</p>
          </div>
        </IonCardHeader>
      )}
      {(type === 'deposit' || type === 'withdrawal') && (
        <IonCardHeader>
          <IonCardTitle className='transactionStatusCard-title'>
            {title}
          </IonCardTitle>
          <p className={`transactionStatusCard-amount ${type}`}>
            {amount}
          </p>
        </IonCardHeader>
      )}
      <IonCardContent>
        <div
          className={`transactionStatusCard-header transactionDetails  ${type}`}
        >
          <h2>{transactionId}</h2>
          <p className='transactionDetails-item'>
            <IonIcon icon={timeOutline} /> {timestamp}
          </p>
        </div>

        {type === 'pending' && recipient && (
          <p className='transactionDetails-item'>
            Реквизиты: <span>{recipient}</span>
          </p>
        )}
        {type === 'pending' && (
          <p className='transactionDetails-item'>
            Сумма: <span>{amount}</span>
          </p>
        )}
        {type === 'pending' && status === 'created' && (
          <p className='transactionDetails-item status-item'>
            Статус: <span className='status'>На рассмотрении</span>
          </p>
        )}
        <p className='transactionDetails-item'>Комментарии:</p>
        <div className='transactionDetails-comments'>
          {comments || 'Вывод денежных средств'}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default TransactionStatusCard;
