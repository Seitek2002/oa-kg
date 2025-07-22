import React, { useEffect, useMemo, useState } from 'react';
import {
  IonPage,
  IonButton,
  IonInput,
  IonIcon,
  useIonRouter,
  IonToast,
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import {
  useLazyGetWithdrawalMethodsQuery,
  WithdrawalMethod,
  useLazyGetOperationsQuery,
  Operation,
  useCreateWithdrawalRequestMutation,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useGetCurrentUserQuery } from '../../services/api';

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
  const navigate = useIonRouter();

  const localHistory = localStorage.getItem('operations') || '[]';
  const localData = localStorage.getItem('withdrawalMethods') || '[]';

  const { data: user } = useGetCurrentUserQuery();
  const [getOperations] = useLazyGetOperationsQuery();
  const [getWithdrawalMethods] = useLazyGetWithdrawalMethodsQuery();
  const [requestMoney] = useCreateWithdrawalRequestMutation();

  const defaultNumber = useMemo(
    () => user?.phoneNumber.slice(4) || '',
    [user?.phoneNumber]
  );

  const [phone, setPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState<WithdrawalMethod>({
    id: 0,
    name: '',
    image: '',
  });
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState<Operation[]>(JSON.parse(localHistory));
  const [data, setData] = useState<WithdrawalMethod[]>(JSON.parse(localData));
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: '',
  });

  const handleFetch = async () => {
    const res = await getWithdrawalMethods().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'withdrawalMethods',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  const handleFetchHistory = async () => {
    const res = await getOperations({ type: 'withdrawal' }).unwrap();
    CompareLocaldata({
      oldData: localHistory,
      newData: res,
      localKey: 'operations',
      setState: (data) => setHistory(Array.isArray(data) ? data : []),
    });
  };

  const handleWithdraw = () => {
    const balance = Number(user?.balance ?? 0);
    const amt = Number(amount);

    if (!amt) {
      setToast({ show: true, msg: 'Введите сумму' });
      return;
    }

    if (amt > balance) {
      setToast({
        show: true,
        msg: `Недостаточно средств. Доступно ${balance} сом`,
      });
      return;
    }

    if (user?.identificationStatus !== 'approved') {
      navigate.push('/a/withdraw/identification');
      return;
    }

    try {
      const res = requestMoney({
        amount: amt + '',
        method: selectedBank.id,
        requisite: '996' + defaultNumber,
      }).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    navigate.push('/a/withdraw/info', 'forward', 'replace');
  };

  useEffect(() => {
    handleFetchHistory();
    handleFetch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Выбрать первый банк по умолчанию после загрузки
    if (data.length > 0 && !selectedBank) {
      setSelectedBank(data[0]);
    }
  }, [data, selectedBank]);

  return (
    <IonPage className='withdraw-page'>
      <IonToast
        isOpen={toast.show}
        message={toast.msg}
        duration={2500}
        color='danger'
        onDidDismiss={() => setToast({ show: false, msg: '' })}
      />
      <div>
        <div className='withdraw-form-block'>
          <div className='withdraw-title'>Вывод денег</div>

          <div className='withdraw-label'>Номер телефона</div>
          <div className='withdraw-phone'>
            <span>+996</span>
            <IonInput
              className='withdraw-phone-input'
              value={defaultNumber || phone}
              placeholder='XXX XXX XXX'
              inputMode='tel'
              maxlength={9}
              onIonChange={(e) => setPhone(e.detail.value!)}
              readonly
              disabled
              mode='md'
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: 16,
                fontWeight: 400,
                padding: 0,
                width: '100%',
                color: '#222',
              }}
            />
          </div>
          <div className='withdraw-phone-hint'>
            Для изменения номера обратитесь в службу поддержки
          </div>

          <div className='withdraw-row'>
            <span>Сумма (сом)</span>
            <span className='withdraw-available'>
              Доступно {user?.balance} сом
            </span>
          </div>
          <IonInput
            className='withdraw-input'
            value={amount}
            type='number'
            placeholder='Введите сумму'
            onIonInput={(e) => setAmount(e.detail.value!)}
            max={user?.balance || 0}
          />

          <div className='withdraw-label'>Куда</div>
          <div className='withdraw-bank-list'>
            {data?.map((bank) => (
              <div
                key={bank.id}
                className={
                  'withdraw-bank-item' +
                  (selectedBank.id === bank.id ? ' selected' : '')
                }
                onClick={() => setSelectedBank(bank)}
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
