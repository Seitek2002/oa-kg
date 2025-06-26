import React from 'react';
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
import { useLocation } from 'react-router-dom';
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
import ProfileIdentification from './pages/ProfileIdentification/ProfileIdentification';
import ProfileIdentificationPassport from './pages/ProfileIdentificationPassport/ProfileIdentificationPassport';
import InviteFriend from './pages/InviteFriend';
import Withdraw from './pages/Withdraw';
import Onboarding from './pages/Onboarding/Onboarding';
import Auth from './pages/Auth/Auth';
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

/* Theme variables */
import './theme/variables.css';
import './app.css';

setupIonicReact();

const isAuthorized = () => {
  // Можно доработать: проверять валидность токена
  return !!localStorage.getItem('access');
};

type ProtectedRouteProps = {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthorized() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/a/onboarding" />
      )
    }
  />
);

const AppTabs: React.FC = () => {
  const location = useLocation();
  const hideTabBar = location.pathname === '/a/onboarding' || location.pathname === '/a/auth';

  const [lang, setLang] = React.useState<'kg' | 'ru'>('kg');

  return (
    <>
      <IonHeader className='header'>
        <img src={logo} alt='' style={{ height: 22 }} />
        <span>ОСАГО Агент КГ</span>
        <span
          className="text-[#000] absolute right-0 top-0 cursor-pointer"
          style={{ background: 'transparent', padding: 8 }}
          onClick={() => setLang(lang === 'kg' ? 'ru' : 'kg')}
        >
          {lang === 'kg' ? 'Кыргызча' : 'Русский'}
        </span>
      </IonHeader>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path='/a/onboarding'>
            <Onboarding />
          </Route>
          <Route exact path='/a/auth'>
            <Auth />
          </Route>
          <ProtectedRoute exact path='/a/home' component={Home} />
          <ProtectedRoute exact path='/a/osago' component={Osago} />
          <ProtectedRoute exact path='/a/agents' component={Agents} />
          <ProtectedRoute exact path='/a/finances' component={Finances} />
          <ProtectedRoute exact path='/a/profile' component={Profile} />
          <ProtectedRoute exact path='/a/profile/edit' component={ProfileEdit} />
          <ProtectedRoute exact path='/a/referral' component={ReferralInfo} />
          <ProtectedRoute exact path='/a/invite' component={InviteFriend} />
          <ProtectedRoute exact path='/a/withdraw' component={Withdraw} />
          <ProtectedRoute exact path='/a/profile/identification' component={ProfileIdentification} />
          <ProtectedRoute exact path='/a/profile/identification/passport' component={ProfileIdentificationPassport} />
          <Route exact path='/a/'>
            <Redirect to='/a/home' />
          </Route>
          <Route exact path='/'>
            <Redirect to='/a/home' />
          </Route>
        </IonRouterOutlet>
        {!hideTabBar && (
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
              <IonLabel>Команда</IonLabel>
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
        )}
      </IonTabs>
    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <AppTabs />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
