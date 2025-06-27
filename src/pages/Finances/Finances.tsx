import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import { useLazyGetOperationsQuery, Operation } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import './styles.scss';

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

const Finances: React.FC = () => {
  // Паттерн localData + data + getOperations + handleFetch + useEffect
  const localData = localStorage.getItem('operations') || '[]';

  const [data, setData] = useState<Operation[]>(JSON.parse(localData));
  const [getOperations] = useLazyGetOperationsQuery();

  const handleFetch = async () => {
    const res = await getOperations().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'operations',
      setState: (data: any) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  return (
    <IonPage className='finances-page'>
      <div>
        <IncomeCard />
        <h2 className='finances-title'>История операций</h2>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            Нет операций
          </div>
        )}
        {data.map((op) => {
          let cardType: "withdrawal" | "deposit" | "pending" = "pending";
          if (op.type === "withdrawal") cardType = "withdrawal";
          else if (op.type === "deposit") cardType = "deposit";
          return (
            <TransactionStatusCard
              key={op.id}
              type={cardType}
              transactionId={`№${op.id}`}
              timestamp={formatDate(op.createdAt)}
              amount={op.amountDisplay || op.amount}
              status={op.status}
              comments={op.comment}
            />
          );
        })}
      </div>
    </IonPage>
  );
};

export default Finances;
