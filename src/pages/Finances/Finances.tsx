import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import { useLazyGetOperationsQuery, Operation } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';
import IncomeCard from '../../components/IncomeCard/IncomeCard';

import './styles.scss';

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
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  return (
    <IonPage className='finances-page'>
      <div style={{ paddingTop: 20 }}>
        <IncomeCard />

        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            Нет операций
          </div>
        )}

        {data.map((op) => {
          let cardType: 'withdrawal' | 'deposit' | 'pending' = 'pending';
          if (op.type === 'withdrawal') cardType = 'withdrawal';
          else if (op.type === 'deposit') cardType = 'deposit';
          return (
            <TransactionStatusCard
              key={op.id}
              type={cardType}
              transactionId={`№${op.id}`}
              timestamp={op.createdAt}
              amount={op.amount}
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
