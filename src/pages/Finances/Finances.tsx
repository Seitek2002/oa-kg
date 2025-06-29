import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import { useLazyGetOperationsQuery, Operation } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import './styles.scss';
import { useTexts } from '../../context/TextsContext';

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

  const { t } = useTexts();
  return (
    <IonPage className='finances-page'>
      <div>
        <IncomeCard />
        <h2 className='finances-title'>{t('screen_finance') || 'История операций'}</h2>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            {t('no_operations') || 'Нет операций'}
          </div>
        )}
        {data.map((op) => {
          return (
            <TransactionStatusCard
              key={op.id}
              {...op}
              timestamp={op.createdAt}
            />
          );
        })}
      </div>
    </IonPage>
  );
};

export default Finances;
