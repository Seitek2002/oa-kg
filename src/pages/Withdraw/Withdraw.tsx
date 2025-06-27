import React, { useState } from 'react';
import { IonPage, IonButton, IonInput, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';

import bakaiLogo from '../../assets/bakai-logo.svg';
import mbankLogo from '../../assets/mbank-logo.svg';
import oMoneyLogo from '../../assets/OMoney-logo.svg';

import './styles.scss';

const banks = [
  {
    value: 'BakAi',
    label: 'BakAi',
    icon: bakaiLogo,
  },
  {
    value: 'MBank',
    label: 'Mbank',
    icon: mbankLogo,
  },
  {
    value: 'O! Деньги',
    label: 'O! Деньги',
    icon: oMoneyLogo,
  },
];

const history = [
  {
    id: 3248,
    date: '12:00 01.06.2025',
    requisit: '+996555112233 - MBANK',
    amount: 1000,
    status: 'success', // success | pending | declined
    statusText: 'Успешный вывод',
    comment: 'Вывод',
  },
  {
    id: 3249,
    date: '12:00 01.06.2025',
    requisit: '+996555112233 - O! Деньги',
    amount: 1000,
    status: 'pending',
    statusText: 'На рассмотрении',
    comment: 'Вывод',
  },
  {
    id: 3249,
    date: '12:00 01.06.2025',
    requisit: '+996555112233 - BakAi',
    amount: 1000,
    status: 'declined',
    statusText: 'Отказано',
    comment: 'Вывод',
  },
];

const Withdraw: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState('BakAi');
  const [amount, setAmount] = useState('1000');

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
              inputmode='tel'
              maxlength={9}
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
            {banks.map((bank) => (
              <div
                key={bank.value}
                className={
                  'withdraw-bank-item' +
                  (selectedBank === bank.value ? ' selected' : '')
                }
                onClick={() => setSelectedBank(bank.value)}
              >
                <span className='withdraw-bank-radio'></span>
                <img
                  src={bank.icon}
                  alt={bank.label}
                  className='withdraw-bank-icon'
                />
                <span className='withdraw-bank-label'>{bank.label}</span>
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
              key={item.id + item.status + item.requisit}
            >
              <div className='withdraw-history-row'>
                <span className='withdraw-history-id'>№{item.id}</span>
                <span className='withdraw-history-date'>
                  <IonIcon
                    className='withdraw-history-icon'
                    icon={timeOutline}
                  />{' '}
                  {item.date}
                </span>
              </div>
              <div className='withdraw-history-info'>
                Реквизит: <span>{item.requisit}</span>
              </div>
              <div className='withdraw-history-info'>
                Сумма: <span>{item.amount} сом</span>
              </div>
              <div className={`withdraw-history-status ${item.status}`}>
                Статус: <span>{item.statusText}</span>
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
