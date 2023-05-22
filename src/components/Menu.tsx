import {
  IonContent, IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {useLocation} from 'react-router-dom';
import {
  archiveOutline,
  archiveSharp,
  heartOutline,
  heartSharp, newspaper,
  paperPlaneOutline,
  paperPlaneSharp, people, person, personOutline,
  trashOutline,
  trashSharp, wallet, walletOutline, walletSharp
} from 'ionicons/icons';
import './Menu.css';
import React from "react";
import {eegChatIcon} from "../eegIcons";
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
    }
  ];

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
    </IonMenu>
  );
};

export default Menu;
