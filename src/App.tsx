import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPopover,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, closeOutline, documentTextOutline, ellipse, menu, peopleOutline, square, timeOutline, triangle } from 'ionicons/icons';
import Checks from './pages/Checks';
import Employee from './pages/Employee';
import Reports from './pages/Reports';
import Login from './pages/Authentication/Login';
import Header from './components/Header';
import LogoutAlert from './components/LogoutAlert';
import TimeSheets from './pages/TimeSheets';
import useInactivityTimer from './hooks/useInactivityTimer';
import MenuPopover from './components/MenuPopover';

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
  const [showMenuPopover, setShowMenuPopover] = useState(false);

  const openMenu = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent the page from navigating
      setShowMenuPopover(true);
  };
  const closeMenu = () => setShowMenuPopover(false);


  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleMenuClick = () => {
    setShowMenuPopover(true);
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
        <IonPopover isOpen={popoverState.showAlertPopover} event={popoverState.event} onDidDismiss={dismissAlertPopover}>
          <IonList>
            <IonItemDivider>
              Alert Details
              <IonButton fill="clear" slot="end" onClick={dismissAlertPopover}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonItemDivider>
            <IonItem>
              <IonLabel>Name: Your Name</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
        <IonPopover isOpen={popoverState.showMailPopover} event={popoverState.event} onDidDismiss={dismissMailPopover}>
          <IonList>
            <IonItemDivider>
              Mail Details
              <IonButton fill="clear" slot="end" onClick={dismissMailPopover}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonItemDivider>
            <IonItem>
              <IonLabel>Email: your@email.com</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
        <LogoutAlert isOpen={showLogoutAlert} onDidDismiss={() => setShowLogoutAlert(false)} handleLogoutConfirm={handleLogoutConfirm} />
        <IonPopover
          isOpen={showMenuPopover}
          onDidDismiss={closeMenu}
        >
          <MenuPopover onClose={closeMenu} />
        </IonPopover>

      </IonContent>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
