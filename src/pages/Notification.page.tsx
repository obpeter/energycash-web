import React, {FC, useEffect, useState} from "react";
import {IonContent, IonHeader, IonItem, IonPage, IonToolbar} from "@ionic/react";
import {EegNotification, Message} from "../models/eeg.model";
import {eegService} from "../service/eeg.service";
import {useAppSelector} from "../store";
import {selectedTenant} from "../store/eeg";
import NotificationLayoutComponent from "../components/notification/NotificationLayout.component";


const NotificationPage: FC = () => {
  const tenant = useAppSelector(selectedTenant);
  const [notifictions, setNotifications] = useState<{type: string, date: Date, notification: EegNotification}[]>([])

  useEffect(() => {
    eegService.getNotifications(tenant, 0).then(r => {
      setNotifications(r.map(x => {
        x.message = new Message(x.message)
        return {type: "EDA_PROCESS", date: x.date, notification: x}
      }))
    })
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div style={{paddingLeft: "16px"}}><h3>Messages</h3></div>
        </IonToolbar>
      </IonHeader>
      <IonContent color="eeg">
        {/*<div className="">*/}
        {/*{notifictions.map((n,i) => (*/}
        {/*  <IonItem key={n.id*i} style={{justifyItems: "space-between"}}>*/}
        {/*    /!*<div key={n.id*i} style={{display: "flex", width: "100%", justifyContent:"space-between"}}>*!/*/}
        {/*    <div key={n.id*i} style={{display: "grid", width: "100%", gridTemplateColumns: "20% auto 30% 20%"}}>*/}
        {/*      <div>{n.date}</div>*/}
        {/*      <div>{n.message.meteringPoint}</div>*/}
        {/*      <div>{n.message.responseCode}</div>*/}
        {/*      <div>{n.message.type}</div>*/}
        {/*    </div>*/}
        {/*  </IonItem>*/}
        {/*))}*/}
        {/*</div>*/}
        <NotificationLayoutComponent notifications={notifictions}/>
      </IonContent>
    </IonPage>
  )
}

export default NotificationPage;