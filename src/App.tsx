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
import IdentificationProcess from './pages/IdentificationProcess/IdentificationProcess';
import InviteFriend from './pages/InviteFriend';
import Withdraw from './pages/Withdraw/Withdraw';
import WithdrawIdentification from './pages/WithdrawIdentification/WithdrawIdentification';
import WithdrawInfo from './pages/WithdrawInfo/WithdrawInfo';
import Onboarding from './pages/Onboarding/Onboarding';
import Auth from './pages/Auth/Auth';
import AuthVerify from './pages/Auth/AuthVerify';
import Finances from './pages/Finances';
import InstructionAccident from './pages/InstructionAccident/InstructionAccident';
import MyFaqPage from './pages/FaqPage/FaqPage';

import logo from './assets/logo.svg';
import { TextsProvider } from './context/TextsContext';

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
// {"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1OTQ2ODc0NiwiaWF0IjoxNzUxNjkyNzQ2LCJqdGkiOiJiYjAxMTNkNmIxYjg0YjNlODVkYTMzMzE3ZmMxNWMyOCIsInVzZXJfaWQiOjEwMX0.DNFtWT2S65ZEpIDGOBMS5ilIaCax94qt0-ovOuGcHhA","access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNjk2MzQ2LCJpYXQiOjE3NTE2OTI3NDYsImp0aSI6IjM1ODUwZTdjN2RiYzRjMTE5ODYwNmU1NjFkMGJlMTZmIiwidXNlcl9pZCI6MTAxfQ.w3Oj1CXXZSCSA2EjsE2IhWvWK8vw3DvBKY6Ti4YFXSA"}
/* Theme variables */
import './theme/variables.css';
import './app.css';

setupIonicReact();

const AppTabs: React.FC = () => {
  const location = useLocation();

  // Determine when to skip fetching current user (avoid loops for unauthenticated users)
  const isAuthRoute = location.pathname.startsWith('/a/auth');
  const isOnboarding = location.pathname === '/a/onboarding';
  const hideTabBar = isOnboarding || isAuthRoute;

  // Глобальный редирект на Onboarding при первом заходе
  React.useEffect(() => {
    const onboardingNotSeen = localStorage.getItem('onboardingSeen') !== 'true';
    if (onboardingNotSeen && !isAuthRoute && location.pathname !== '/a/onboarding') {
      window.location.replace('/a/onboarding');
    }
  }, [location.pathname, isAuthRoute]);

  // Трекинг PageView для SPA-переходов (Meta Pixel + GA4)
  const firstPv = React.useRef(true);
  React.useEffect(() => {
    if (firstPv.current) {
      // Первую загрузку уже отправил базовый пиксель в index.html
      firstPv.current = false;
      return;
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-ZYHNYD1P7D', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname, location.search]);


  const [lang, setLang] = React.useState<'ky' | 'ru'>(() => {
    const stored = localStorage.getItem('lang');
    return stored === 'ru' || stored === 'ky' ? stored : 'ky';
  });

  return (
    <>
      <IonHeader className='header'>
        <img src={logo} alt='' style={{ height: 22 }} />
        <span>ОСАГО Агент КГ</span>
        <span
          className='text-[#000] absolute right-0 top-0 cursor-pointer'
          style={{ background: 'transparent', padding: 8 }}
          onClick={() => {
            const newLang = lang === 'ky' ? 'ru' : 'ky';
            localStorage.setItem('lang', newLang);
            setLang(newLang);
            window.location.reload();
          }}
        >
          {lang === 'ky' ? 'Русский' : 'Кыргызча'}
        </span>
      </IonHeader>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path='/a/onboarding'>
            <Onboarding />
          </Route>
          <Route exact path='/a/auth/:id'>
            <Auth />
          </Route>
          <Route exact path='/a/auth/verify'>
            <AuthVerify />
          </Route>
          <Route exact path='/a/auth'>
            <Auth />
          </Route>
          <Route exact path='/a/home' component={Home} />
          <Route exact path='/a/osago' component={Osago} />
          <Route exact path='/a/agents' component={Agents} />
          <Route exact path='/a/finances' component={Finances} />
          <Route exact path='/a/profile' component={Profile} />
          <Route exact path='/a/profile/edit' component={ProfileEdit} />
          <Route exact path='/a/referral' component={ReferralInfo} />
          <Route exact path='/a/invite' component={InviteFriend} />
          <Route exact path='/a/withdraw' component={Withdraw} />
          <Route
            exact
            path='/a/withdraw/identification'
            component={WithdrawIdentification}
          />
          <Route exact path='/a/withdraw/info' component={WithdrawInfo} />
          <Route
            exact
            path='/a/profile/identification'
            component={ProfileIdentification}
          />
          <Route
            exact
            path='/a/profile/identification/passport'
            component={ProfileIdentificationPassport}
          />
          <Route
            exact
            path='/a/profile/identification/process'
            component={IdentificationProcess}
          />
          <Route exact path='/a/instruction' component={InstructionAccident} />
          <Route exact path='/a/my-faq' component={MyFaqPage} />
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
        <TextsProvider>
          <AppTabs />
        </TextsProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
