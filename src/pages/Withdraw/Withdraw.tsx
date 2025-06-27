import React, { useEffect, useState } from 'react';
import { IonPage, IonButton, IonInput, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useLazyGetWithdrawalMethodsQuery, WithdrawalMethod, useLazyGetOperationsQuery, Operation } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

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

const Withdraw: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('1000');

  // Банки
  const localData = localStorage.getItem('withdrawalMethods') || '[]';
  const [data, setData] = useState<WithdrawalMethod[]>(JSON.parse(localData));
  const [getWithdrawalMethods] = useLazyGetWithdrawalMethodsQuery();

  const handleFetch = async () => {
    const res = await getWithdrawalMethods().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'withdrawalMethods',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Выбрать первый банк по умолчанию после загрузки
    if (data.length > 0 && !selectedBank) {
      setSelectedBank(data[0].name);
    }
  }, [data, selectedBank]);

  // История операций (выводов)
  const localHistory = localStorage.getItem('operations') || '[]';
  const [history, setHistory] = useState<Operation[]>(JSON.parse(localHistory));
  const [getOperations] = useLazyGetOperationsQuery();

  const handleFetchHistory = async () => {
    const res = await getOperations({ type: 'withdrawal' }).unwrap();
    CompareLocaldata({
      oldData: localHistory,
      newData: res,
      localKey: 'operations',
      setState: (data) => setHistory(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetchHistory();
    // eslint-disable-next-line
  }, []);

  const handleWithdraw = () => {
    console.log(`Вывести ${amount} сом на ${selectedBank}, номер ${phone}`);
  };

  return (
    <IonPage className='withdraw-page'>
      <div>
        <div className='withdraw-form-block'>
          <div className='withdraw-title'>Вывод денег</div>

          <div className='withdraw-label'>Номер телефона</div>
          <div className='withdraw-phone'>
            <span>(+996)</span>
            <IonInput
              className='withdraw-phone-input'
              value={phone}
              placeholder='XXX XXX XXX'
              inputMode='tel'
              maxLength={9}
              onIonChange={(e) => setPhone(e.detail.value!)}
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: 16,
                fontWeight: 500,
                padding: 0,
              }}
            />
          </div>
          <div className='withdraw-phone-hint'>
            Для изменения номера обратитесь в службу поддержки
          </div>

          <div className='withdraw-row'>
            <span>Сумма (сом)</span>
            <span className='withdraw-available'>Доступно 24 000 сом</span>
          </div>

          <IonInput
            className='withdraw-input'
            value={amount}
            placeholder='Введите сумму'
            onIonChange={(e) => setAmount(e.detail.value!)}
          />

          <div className='withdraw-label'>Куда</div>
          <div className='withdraw-bank-list'>
            {data.map((bank) => (
              <div
                key={bank.id}
                className={
                  'withdraw-bank-item' +
                  (selectedBank === bank.name ? ' selected' : '')
                }
                onClick={() => setSelectedBank(bank.name)}
              >
                <span className='withdraw-bank-radio'></span>
                <img
                  src={bank.image}
                  alt={bank.name}
                  className='withdraw-bank-icon'
                />
                <span className='withdraw-bank-label'>{bank.name}</span>
              </div>
            ))}
          </div>

          <IonButton
            expand='block'
            className='withdraw-btn'
            onClick={handleWithdraw}
          >
            Вывести деньги
          </IonButton>
        </div>

        {/* Блок с историей выводов */}
        <div className='withdraw-history'>
          {history.map((item) => (
            <div
              className='withdraw-history-card'
              key={item.id + item.status + item.createdAt}
            >
              <div className='withdraw-history-row'>
                <span className='withdraw-history-id'>№{item.id}</span>
                <span className='withdraw-history-date'>
                  <IonIcon
                    className='withdraw-history-icon'
                    icon={timeOutline}
                  />{' '}
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <div className='withdraw-history-info'>
                Сумма: <span>{item.amountDisplay} сом</span>
              </div>
              <div className={`withdraw-history-status ${item.status}`}>
                Статус: <span>{item.status}</span>
              </div>
              <div className='withdraw-history-info'>
                Комментарий: {item.comment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </IonPage>
  );
};

export default Withdraw;
