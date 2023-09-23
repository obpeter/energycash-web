import {
  createAnimation, IonButton,
  IonButtons,
  IonContent, IonFooter, IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle, IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {useLocation} from 'react-router-dom';
import {
  informationCircle, newspaper,
  people, person, wallet, walletSharp
} from 'ionicons/icons';
import './Menu.css';
import React, {useRef} from "react";
import {eegChartBubble, eegChatIcon, eegProcess} from "../eegIcons";
import {useAppSelector} from "../store";
import {eegSelector} from "../store/eeg";
import {useAccessGroups} from "../store/hook/Eeg.provider";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  forOnline?: boolean;
}

const Menu: React.FC = () => {
  const location = useLocation();
  const eeg = useAppSelector(eegSelector);
  const {isAdmin} = useAccessGroups()

  const appPages: AppPage[] = [
    {
      title: 'Dashboard',
      url: '/page/dashboard',
      iosIcon: eegChatIcon,
      mdIcon: eegChatIcon
    },
    {
      title: eeg ? eeg.name : "Meine EEG",
      url: '/page/eeg',
      iosIcon: newspaper,
      mdIcon: newspaper
    },
    {
      title: 'Mitglieder',
      url: '/page/participants',
      iosIcon: people,
      mdIcon: people
    },
    {
      title: 'Tarife',
      url: '/page/rates',
      iosIcon: wallet,
      mdIcon: walletSharp
    },
    {
      title: 'Profil',
      url: '/page/profiles',
      iosIcon: person,
      mdIcon: person
    },
  ];

  const adminPages: AppPage[] = [
    {
      title: 'Prozesse',
      url: '/page/processes',
      iosIcon: eegProcess,
      mdIcon: eegProcess,
      forOnline: true,
    },
  ];

/////////////////////////////////////////////////////////////////////////////////////////////////////
  // TEST
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        {offset: 0, opacity: '0', transform: 'scale(0)'},
        {offset: 1, opacity: '0.99', transform: 'scale(1)'},
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction('reverse');
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar
          color="primary"><IonTitle>EEG <span style={{color: "#79DFB4"}}>Faktura</span></IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem button lines="full" routerLink={"/page/notifications"} routerDirection="none">
          <IonIcon aria-hidden="true" slot="start" ios={eegChartBubble} md={eegChartBubble}/>
          <IonLabel>Messages</IonLabel>
        </IonItem>
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url}
                         routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon}/>
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          {isAdmin() && adminPages.filter(p => !(p.forOnline && p.forOnline !== eeg?.online)).map((adminPage, adminIdx) => {
            return (
              <IonMenuToggle key={appPages.length + adminIdx} autoHide={false}>
                <IonItem className={location.pathname === adminPage.url ? 'selected' : ''} routerLink={adminPage.url}
                         routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={adminPage.iosIcon} md={adminPage.mdIcon}/>
                  <IonLabel>{adminPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}
        </IonList>

        {/*<IonList id="labels-list">*/}
        {/*  <IonListHeader>Labels</IonListHeader>*/}
        {/*  {labels.map((label, index) => (*/}
        {/*    <IonItem lines="none" key={index}>*/}
        {/*      <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />*/}
        {/*      <IonLabel>{label}</IonLabel>*/}
        {/*    </IonItem>*/}
        {/*  ))}*/}
        {/*</IonList>*/}
      </IonContent>
      <IonFooter>
        <IonMenuToggle autoHide={false}>
          <IonItem className={location.pathname === "/pages/info" ? 'selected' : ''} id={"open-modal"} lines="none"
                   detail={false}>
            <IonIcon aria-hidden="true" slot="start" ios={informationCircle} md={informationCircle}/>
            <IonLabel>{"Info"}</IonLabel>
          </IonItem>
        </IonMenuToggle>
        <IonModal
          id="example-modal"
          ref={modal}
          trigger="open-modal"
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
        >
          <IonContent color="eeg">
            <IonToolbar>
              <IonTitle>Impressum</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => dismiss()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
            <div style={{padding: "25px", fontSize:"14px"}}>
              <img alt="vfeeg image" src="/assets/vfeeg-image.png"
                   style={{width: "150px", background: "rgb(16, 57, 49)"}}/>
              <p>Verein zur Förderung von Erneuerbaren Energiegemeinschaften</p>
              <p>ZVR-Zahl 1528480260</p>
              <p>Obmensch: Harald Geissler</p>
              <p>Anschrift: Fellingerstraße 9, 4730 Waizenkirchen</p>
            </div>
            <div>
              <img src="/assets/leader-image-v1.png"/>
              <div style={{padding: "10px"}}>
                <div>
                <a href="https://ec.europa.eu/info/departments/agriculture-and-rural-development_de"
                   style={{fontSize: "12px"}}>https://ec.europa.eu/info/departments/agriculture-and-rural-development_de</a>
                </div>
                <div>
                <a href="https://www.bml.gv.at/" style={{fontSize: "12px"}}>https://www.bml.gv.at/</a>
                </div>
                <div>
                <a href="https://www.land-oberoesterreich.gv.at/"
                   style={{fontSize: "12px"}}>https://www.land-oberoesterreich.gv.at/</a>
                </div>
              </div>
            </div>
          </IonContent>
          <IonFooter color="eeg">
            <IonItem lines="none" style={{fontSize: "12px", textAlign: "center"}}>
              <IonLabel>eegFaktura ist eine freie und quelloffene Software und steht unter der AGPL</IonLabel>
            </IonItem>
          </IonFooter>
        </IonModal>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
