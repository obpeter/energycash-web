import {IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

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
import React from "react";
import {KeycloakProvider, useKeycloak} from "./store/hook/AuthProvider";
import {authKeycloak} from "./keycloak";
import Login from "./pages/Login";
import Participants from "./pages/Participants";
import {EegProvider} from "./store/hook/Eeg.provider";
import ParticipantProvider from "./store/hook/ParticipantProvider";
import MemberViewProvider from "./store/hook/MemberViewProvider";
import MemberFormComponent from "./components/MemberForm.component";
import TestPage from "./pages/TestPage";
import RatesPage from "./pages/Rates.page";
import EegPage from "./pages/Eeg.page";
import ParticipantRegisterPage from "./pages/ParticipantRegister.page";

setupIonicReact();

const PublicSection: React.FC = () => {
  return (
    <IonRouterOutlet id="public">
      <Route path="/login" component={Login} exact={true}/>
      <Route path="/" render={() => <Redirect to="/login"/>} exact={true}/>
    </IonRouterOutlet>
  )
}

const SecureSection: React.FC = () => {
  return (
    <IonReactRouter>
      <EegProvider>
        <ParticipantProvider>
          <IonSplitPane contentId="main">
            <Menu/>
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/page/participants"/>
              </Route>
              <MemberViewProvider>
                <Route path="/page/participants" exact={true}>
                  <Participants></Participants>
                  <Route path="inner/details" exact={true}>
                    <TestPage/>
                  </Route>
                </Route>
              </MemberViewProvider>
              <Route path="/page/rates" component={RatesPage} exact={true}/>
              <Route path="/page/eeg" component={EegPage} exact={true}/>
              <Route path="/page/addParticipant" exact={true}>
                <ParticipantRegisterPage/>
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </ParticipantProvider>
      </EegProvider>
    </IonReactRouter>
  )
}

const PrivateRouter: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const {isAuthenticated} = useKeycloak();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Redirect to="/"/>
  )
}

const PublicRouter: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const {isAuthenticated} = useKeycloak();
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Redirect to="/page/participants"/>
  )
}

const App: React.FC = () => {
  return (
    <KeycloakProvider authClient={authKeycloak}>
      <IonApp>
        <IonReactRouter>
          <Route path="/">
            <PublicRouter>
              <PublicSection></PublicSection>
            </PublicRouter>
          </Route>
          <Route path="/*">
            <PrivateRouter>
              <SecureSection></SecureSection>
            </PrivateRouter>
          </Route>
        </IonReactRouter>
      </IonApp>
    </KeycloakProvider>
  );
};

export default App;
