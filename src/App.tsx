import React, { useState, useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import {
  homeOutline,
  shieldCheckmarkOutline,
  peopleOutline,
  cardOutline,
  personOutline,
} from 'ionicons/icons';

import Osago from './pages/Osago/Osago';
import Home from './pages/Home/Home';
import Agents from './pages/Agents/Agents';
import ReferralInfo from './pages/Referral/ReferralInfo';
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import InviteFriend from './pages/InviteFriend';
import Withdraw from './pages/Withdraw';
import OnboardingModal from './components/OnboardingModal';
import Finances from './pages/Finances';

import logo from './assets/logo.svg';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import './app.css';

setupIonicReact();

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('access');
    setShowOnboarding(!completed);
  }, []);

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
  };

  return (
    <IonApp>
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={handleOnboardingFinish}
      />
      <IonReactRouter>
        <IonHeader className='header'>
          <img src={logo} alt='' style={{ height: 22 }} />
          <span>ОСАГО Агент КГ</span>
          <select
            className="text-[#000] absolute right-0 top-0"
            style={{ background: 'transparent' }}
            defaultValue="kg"
          >
            <option value="ru">RU</option>
            <option value="kg">KG</option>
            <option value="en">ENG</option>
          </select>
        </IonHeader>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path='/a/home'>
              <Home />
            </Route>
            <Route exact path='/a/osago'>
              <Osago />
            </Route>
            <Route exact path='/a/agents'>
              <Agents />
            </Route>
            <Route exact path='/a/finances'>
              <Finances />
            </Route>
            <Route exact path='/a/profile'>
              <Profile />
            </Route>
            <Route exact path='/a/profile/edit'>
              <ProfileEdit />
            </Route>
            <Route exact path='/a/referral'>
              <ReferralInfo />
            </Route>
            <Route exact path='/a/invite'>
              <InviteFriend />
            </Route>
            <Route exact path='/a/withdraw'>
              <Withdraw />
            </Route>
            <Route exact path='/a/'>
              <Redirect to='/a/home' />
            </Route>
            <Route exact path='/'>
              <Redirect to='/a/home' />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/a/home'>
              <IonIcon aria-hidden='true' icon={homeOutline} />
              <IonLabel>Главная</IonLabel>
            </IonTabButton>
            <IonTabButton tab='osago' href='/a/osago'>
              <IonIcon aria-hidden='true' icon={shieldCheckmarkOutline} />
              <IonLabel>ОСАГО</IonLabel>
            </IonTabButton>
            <IonTabButton tab='agents' href='/a/agents'>
              <IonIcon aria-hidden='true' icon={peopleOutline} />
              <IonLabel>Агенты</IonLabel>
            </IonTabButton>
            <IonTabButton tab='finances' href='/a/finances'>
              <IonIcon aria-hidden='true' icon={cardOutline} />
              <IonLabel>Финансы</IonLabel>
            </IonTabButton>
            <IonTabButton tab='profile' href='/a/profile'>
              <IonIcon aria-hidden='true' icon={personOutline} />
              <IonLabel>Профиль</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
