import React, { useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
  IonPage,
  IonRow,
  IonCol,

  IonSplitPane,
  IonContent,
  IonTabs,
  IonAvatar,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, menu, timeOutline } from 'ionicons/icons';


import Checks from './pages/Tabs/Checks/Checks';
import Reports from './pages/Tabs/Reports/Reports';
import Login from './pages/Authentication/Login';
import TimeSheets from './pages/Tabs/TimeSheets/TimeSheets';
import Payroll from './pages/Tabs/Payrolls/Payroll';
import Graphics from './pages/Tabs/Graphics/Graphics';

import Header from './components/Header';
import LogoutAlert from './components/Alerts/LogoutAlert';
import MenuModal from './components/PopOver/MenuPopover';
import AlertPopover from './components/PopOver/AlertPopover';
import MailPopover from './components/PopOver/MailPopover';

import Employee from './pages/Catalogs/Employees/Employee';
import CreateContractor from './pages/Catalogs/Contractors/CreateContractor';
import CreateDepartment from './pages/Catalogs/Departaments/CreateDepartment';
import CreateEmployeeProjectAssignment from './pages/Catalogs/EmployeeProjectAssignments/CreateEmployeeProjectAssignment';
import CreateEmployee from './pages/Catalogs/Employees/CreateEmployee';
import CreateEmploymentType from './pages/Catalogs/EmploymentTypes/CreateEmploymentType';
import CreateProject from './pages/Catalogs/Projects/CreateProject';
import CreateStatus from './pages/Catalogs/Statuses/CreateStatus';
import { useUser } from './components/UserContext'

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
import './responsive.css';

setupIonicReact();

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const history = useHistory();
  const [showMenuModal, setShowMenuModal] = useState(false);
  const { username, avatarUrl, setUsername, setAvatarUrl } = useUser();


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

  useInactivityTimer();

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main-content">

          <IonPage id="main-content">
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
                <Header presentAlertPopover={presentAlertPopover} presentMailPopover={presentMailPopover} handleLogout={handleLogout}  />
              </IonCol>
            </IonRow>
            <IonContent className="ion-justify-content-center">
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/CreateStatus" component={CreateStatus} />
                  <Route exact path="/CreateProjects" component={CreateProject} />
                  <Route exact path="/EmploymentTypes" component={CreateEmploymentType} />
                  <Route exact path="/CreateEmployees" component={CreateEmployee} />
                  <Route exact path="/EmployeeProjectAssignments" component={CreateEmployeeProjectAssignment} />
                  <Route exact path="/Departaments" component={CreateDepartment} />
                  <Route exact path="/Contractors" component={CreateContractor} />
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
                    <IonIcon aria-hidden="true" icon={timeOutline} size='large'/>
                    <IonLabel>Check Hours</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="timesheets" href="/timesheets">
                    <IonIcon aria-hidden="true" icon={calendar} size='large'/>
                    <IonLabel>TimeSheets</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="menu" onClick={handleMenuClick}>
                    <IonIcon aria-hidden="true" icon={menu} size='large' />
                    <IonLabel>Menu</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="profile" href="/profile">
                    <IonAvatar>
                      <img src={avatarUrl} alt="User Avatar" />
                    </IonAvatar>
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
              <MenuModal isOpen={showMenuModal} onDidDismiss={() => setShowMenuModal(false)} />
            </IonContent>
          </IonPage>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

