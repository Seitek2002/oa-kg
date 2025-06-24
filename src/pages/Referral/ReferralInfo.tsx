import React from "react";
import { IonButton, IonPage } from "@ionic/react";
import referralLogo from "../../assets/onboarding/bakaiIshnersu.png";
import car from "../../assets/car.svg";
import share from "../../assets/share.svg";
import warning from "../../assets/warning.svg";

import "./style.scss";

const ReferralInfo: React.FC = () => (
  <IonPage className="referral-page">
    <div className="referral-card">
      <img src={referralLogo} alt="Бакаи Иншуренс" className="referral-logo" />
      <div className="referral-description">
        ЗАО «Бакаи Иншуренс» является дочерней компанией ОАО «Бакаи Банк», что
        является гарантом надежности и финансовой устойчивости бренда.
      </div>
      <div className="referral-title">Ваш реферальный код</div>
      <div className="referral-code">3142</div>

      <IonButton expand="block" color="primary" className="referral-btn">
        <img src={car} alt="car" />
        Оформить ОСАГО другому человеку
      </IonButton>

      <IonButton
        expand="block"
        fill="outline"
        color="primary"
        className="referral-btn"
      >
        <img src={share} alt="share" />
        Поделиться реферальной&nbsp;ссылкой
      </IonButton>

      <div className="referral-hint">
        
        <img src={warning} alt="warning" />
        <span>
          Отправьте реферальную ссылку – промокод подставится автоматически
          после перехода по ней. Отправьте код – клиенту/партнеру необходимо
          будет ввести его в специальное поле.
        </span>
      </div>
    </div>
  </IonPage>
);

export default ReferralInfo;
