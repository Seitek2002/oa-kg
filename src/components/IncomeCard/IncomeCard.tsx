import { FC } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

import './styles.scss';

interface IncomeCardProps {
  amount?: string;
  totalEarned?: string;
  onWithdraw?: () => void;
}

const IncomeCard: FC<IncomeCardProps> = ({
  amount,
  totalEarned,
  onWithdraw,
}) => {
  return (
    <IonCard color='white' className='incomeCard'>
      <IonCardHeader>
        <IonCardSubtitle className='incomeCard-subtitle'>
          Доступно
        </IonCardSubtitle>
        <IonCardTitle className='incomeCard-title'>{amount} сом</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Вы заработали за все время {totalEarned} сом
      </IonCardContent>
      <IonCardContent>
        <button onClick={onWithdraw} className='incomeCard-button'>
          Вывести деньги
        </button>
      </IonCardContent>
    </IonCard>
  );
};

export default IncomeCard;
