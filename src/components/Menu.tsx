import {
  createAnimation, IonAvatar, IonButton,
  IonButtons, IonCard, IonCardContent,
  IonContent, IonFooter, IonHeader,
  IonIcon, IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle, IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {useLocation} from 'react-router-dom';
import {
  archiveOutline,
  archiveSharp,
  heartOutline,
  heartSharp, informationCircle, newspaper,
  paperPlaneOutline,
  paperPlaneSharp, people, person, personOutline,
  trashOutline,
  trashSharp, wallet, walletOutline, walletSharp
} from 'ionicons/icons';
import './Menu.css';
import React, {useRef} from "react";
import {eegChatIcon, eegProcess} from "../eegIcons";
import {useAppSelector} from "../store";
import {eegSelector} from "../store/eeg";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const Menu: React.FC = () => {
  const location = useLocation();
  const eeg = useAppSelector(eegSelector);

  const appPages : AppPage[] = [
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
    {
      title: 'Prozesse',
      url: '/page/processes',
      iosIcon: eegProcess,
      mdIcon: eegProcess
    }  ];

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
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
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
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
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
          <IonItem className={location.pathname === "/pages/info" ? 'selected' : ''} id={"open-modal"} lines="none" detail={false}>
            <IonIcon aria-hidden="true" slot="start" ios={informationCircle} md={informationCircle} />
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
            <div style={{padding: "25px"}}>
                  <img alt="vfeeg image" src="/assets/vfeeg-image.png" style={{width:"200px", background: "rgb(16, 57, 49)"}}/>
                  <p>Verein zur Förderung von Erneuerbaren Energiegemeinschaften</p>
                  <p>ZVR-Zahl 1528480260</p>
                  <p>Obmensch: Harald Geissler</p>
                  <p>Anschrift: Fellingerstraße 9, 4730 Waizenkirchen</p>
            </div>
          </IonContent>
          <IonFooter color="eeg">
            <IonItem lines="none" style={{marginBottom: "10px", marginTop: "10px"}}>
              <IonLabel>Sponserd by LEADER</IonLabel>
              <img slot="end" src="/assets/leader-image.png" style={{height: "50px"}}/>
            </IonItem>
          </IonFooter>
        </IonModal>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
