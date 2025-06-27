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
  type: 'withdrawal' | 'referral' | 'osago';
  id: string;
  timestamp: string;
  amountDisplay: string;
  status: 'rejected' | 'paid' | 'created' | '';
  requisiteDisplay?: string;
  comments?: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

const getTitleByType = (type: string): string => {
  switch (type) {
    case 'referral':
      return 'Заработок от агента';
    case 'osago':
      return 'Заработок от ОСАГО';
    case 'withdrawal':
      return 'Вывод средств';
    default:
      return 'Транзакция';
  }
};

const TransactionStatusCard: FC<ITransactionStatusCardProps> = ({
  type,
  id,
  timestamp,
  amountDisplay,
  status,
  requisiteDisplay,
  comments,
}) => {
  const title = getTitleByType(type);
  const isPending = status === 'created';
  const formattedTimestamp = formatDate(timestamp);

  return (
    <IonCard className='transactionStatusCard'>
      {isPending && (
        <IonCardHeader className='transactionStatusCard-header'>
          <IonImg className='clock' src={clock} alt='Clock' />
          <div className='transactionHeader'>
            <p className=''>Ваша заявка на вывод принята.</p>
            <p className=''>Ожидайте, скоро деньги поступят</p>
          </div>
        </IonCardHeader>
      )}
      {/* Заголовок с суммой */}
      {(status === '' || status === 'rejected' || status === 'paid') && (
        <IonCardHeader>
          <IonCardTitle className='transactionStatusCard-title'>
            {title}
          </IonCardTitle>
          <p className={`transactionStatusCard-amount ${type}`}>
            {amountDisplay}
          </p>
        </IonCardHeader>
      )}
      {/* Контент с деталями */}
      <IonCardContent>
        <div
          className={`transactionStatusCard-header transactionDetails  ${type}`}
        >
          <h2>№{id}</h2>
          <p className='transactionDetails-item'>
            <IonIcon icon={timeOutline} /> {formattedTimestamp}
          </p>
        </div>

        {isPending && requisiteDisplay && (
          <p className='transactionDetails-item'>
            Реквизиты: <span>{requisiteDisplay}</span>
          </p>
        )}
        {isPending && (
          <p className='transactionDetails-item'>
            Сумма: <span>{amountDisplay} сом</span>
          </p>
        )}
        {isPending && (
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
