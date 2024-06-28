import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonAccordionGroup,
  IonActionSheet,
  IonApp,
  IonCol,
  IonContent,
  IonIcon,
  IonLabel,
  IonPopover,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, menu, timeOutline } from 'ionicons/icons';

import Checks from './pages/Checks';
import Employee from './pages/Employee';
import Reports from './pages/Reports';
import Login from './pages/Authentication/Login';
import TimeSheets from './pages/TimeSheets';
import Payroll from './pages/Payroll';
import Graphics from './pages/Graphics';

import Header from './components/Header';
import LogoutAlert from './components/Alerts/LogoutAlert';
import MenuModal from './components/PopOver/MenuPopover';
import AlertPopover from './components/PopOver/AlertPopover';
import MailPopover from './components/PopOver/MailPopover';

import useInactivityTimer from './hooks/useInactivityTimer';

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

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/background.css';
import './responsive.css'
import { useState } from 'react';


setupIonicReact();

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const history = useHistory();
  const [showMenuModal, setShowMenuModal] = useState(false);

  const openMenu = () => {
    setShowMenuModal(true);
  };

  const closeMenu = () => {
    setShowMenuModal(false);
  };


  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleMenuClick = () => {
    setShowMenuModal(true);
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const handleLogoutConfirm = () => {
    setAuthenticated(false);
    history.push('/Login');
    setShowLogoutAlert(false);
  };

  const [popoverState, setPopoverState] = useState<{ showAlertPopover: boolean; showMailPopover: boolean; event?: Event }>({
    showAlertPopover: false,
    showMailPopover: false,
  });

  const presentAlertPopover = (e: React.MouseEvent) => {
    setPopoverState({ ...popoverState, showAlertPopover: true, event: e.nativeEvent });
  };

  const dismissAlertPopover = () => setPopoverState({ ...popoverState, showAlertPopover: false });

  const presentMailPopover = (e: React.MouseEvent) => {
    setPopoverState({ ...popoverState, showMailPopover: true, event: e.nativeEvent });
  };

  const dismissMailPopover = () => setPopoverState({ ...popoverState, showMailPopover: false });

  const openMenuModal = () => setShowMenuModal(true);
  const closeMenuModal = () => setShowMenuModal(false);

  useInactivityTimer();


  return (
    <IonApp>
      <IonReactRouter>
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
            <Header presentAlertPopover={presentAlertPopover} presentMailPopover={presentMailPopover} handleLogout={handleLogout} />
          </IonCol>
        </IonRow>
        <IonContent className="ion-justify-content-center">
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/Graphics" component={Payroll} />
            <Route exact path="/Payroll" component={Payroll} />
            <Route exact path="/Checks" component={Checks} />
            <Route exact path="/TimeSheets" component={TimeSheets} />
            <Route exact path="/Employee" component={Employee} />
            <Route exact path="/Reports" component={Reports} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/" render={() => <Redirect to="/Checks" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="Checks" href="/Checks">
              <IonIcon aria-hidden="true" icon={timeOutline} />
              <IonLabel>Check Hours</IonLabel>
            </IonTabButton>
            <IonTabButton tab="timesheets" href="/timesheets">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>TimeSheets</IonLabel>
            </IonTabButton>
            <IonTabButton tab="menu" onClick={handleMenuClick}>
              <IonIcon aria-hidden="true" icon={menu} />
              <IonLabel>Menu</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <AlertPopover
            isOpen={popoverState.showAlertPopover}
            event={popoverState.event}
            onDidDismiss={dismissAlertPopover}
          />
        <MailPopover
            isOpen={popoverState.showMailPopover}
            event={popoverState.event}
            onDidDismiss={dismissMailPopover}
          />
        <LogoutAlert 
          isOpen={showLogoutAlert} 
          onDidDismiss={() => setShowLogoutAlert(false)} 
          handleLogoutConfirm={handleLogoutConfirm} 
          />
          
<         MenuModal isOpen={showMenuModal} onDidDismiss={closeMenuModal} />

      </IonContent>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
