import React, {FC} from "react";
import {IonCard, IonCardContent, IonFooter, IonIcon} from "@ionic/react";
import {alertCircle, syncCircle} from "ionicons/icons";
import moment from "moment";
import {buildNotificationText} from "../../util/Notificaton.util";
import {EegNotification} from "../../models/eeg.model";

interface NotificationItemComponentProps {
  type: string
  date: Date
  notification: object
}

const NotificationItemComponent: FC<NotificationItemComponentProps> = ({type, date, notification}) => {

  const getIcon = () => {
    switch (type) {
      case "EDA_PROCESS":
        const n = notification as EegNotification
        return <IonIcon className={`notification-icon_${n.message.type}`} icon={syncCircle} size="large"></IonIcon>
    }
    return <IonIcon style={{color: "yellow"}} icon={alertCircle} size="large"></IonIcon>
  }

  const getProcessId = () => {
    switch (type) {
      case "EDA_PROCESS":
        const n = notification as EegNotification
        return n.message.type
    }
    return type
  }

  return (
    <div className="notification-item">
      <IonCard>
        <IonCardContent>
          <div style={{display: "grid", gridTemplateColumns:"5% 95%"}}>
            {getIcon()}
            <div>{buildNotificationText(type, notification)}</div>

          </div>
        </IonCardContent>
        <IonFooter>
          <div style={{display: "flex", flexFlow: "row", columnGap: "24px", alignItems: "center"}}>
            <div className="notification-date">{moment(date).format("dd, MMM Do YYYY, h:mm:ss")}</div>
            <div>{getProcessId()}</div>
          </div>
        </IonFooter>
      </IonCard>
    </div>
  )
}

export default NotificationItemComponent;