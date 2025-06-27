import React, { FC, useEffect, useState } from 'react';
import { IonButton, IonPage } from '@ionic/react';
import referralLogo from '../../assets/onboarding/bakaiIshnersu.png';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import share from '../../assets/share.svg';
import warning from '../../assets/warning.svg';

import './style.scss';

const ReferralInfo: FC = () => {
  const localData =
    localStorage.getItem('usersInfo') ||
    `{
      "id": 0,
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "phoneNumber": "+996",
      "balance": "0",
      "totalIncome": "0",
      "osagoIncome": "0",
      "agentsIncome": "0",
      "osagoCount": 0,
      "agentsCount": 0,
      "referralLink": "string",
      "identificationStatus": "not_submitted"
    }`;

  const [data, setData] = useState(JSON.parse(localData));

  const [getUserInfo] = useLazyGetCurrentUserQuery();

  const handleFetch = async () => {
    const res = await getUserInfo().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'usersInfo',
      setState: setData,
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        <img
          src={referralLogo}
          alt='Бакаи Иншуренс'
          className='referral-logo'
        />
        <div className='referral-description'>
          ЗАО «Бакаи Иншуренс» является дочерней компанией ОАО «Бакаи Банк», что
          является гарантом надежности и финансовой устойчивости бренда.
        </div>
        <div className='referral-title'>Ваш реферальный код</div>
        <div className='referral-code'>{data?.id}</div>

        <IonButton
          expand='block'
          color='primary'
          className='referral-btn'
          onClick={() => {
            if (data?.referralLink) {
              window.location.href = data.referralLink;
            }
          }}
        >
          <img src={car} alt='car' />
          Оформить ОСАГО другому человеку
        </IonButton>

        <IonButton
          expand='block'
          fill='outline'
          color='primary'
          className='referral-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Бакаи Иншуренс',
                text: 'Онлайн оператор страховки ОСАГО',
                url: data.referralLink,
              });
            } else {
              alert('Web Share API не поддерживается на этом устройстве');
            }
          }}
        >
          <img src={share} alt='share' />
          Поделиться реферальной&nbsp;ссылкой
        </IonButton>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>
            Отправьте реферальную ссылку – промокод подставится автоматически
            после перехода по ней. Отправьте код – клиенту/партнеру необходимо
            будет ввести его в специальное поле.
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default ReferralInfo;
