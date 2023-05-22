import React, {FC, useState} from "react";
import {IonButton, IonContent, IonLabel, IonTitle, useIonLoading, useIonViewDidLeave} from "@ionic/react";
import DatePicker from "react-datepicker";


const DatepickerPopover: FC<{onDismiss: (startDate: Date, endDate: Date) => void}> = ({onDismiss}) => {

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const onOk = () => {
    if (startDate && endDate) {
      onDismiss(startDate, endDate)
    }
  }

  return (
    <IonContent className="ion-padding">
      <IonLabel>Zeitspanne auswählen</IonLabel>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable={true}
        portalId="root-portal"
      />
      <IonButton expand="block" onClick={() => onOk()}>Export</IonButton>
    </IonContent>
  )
}

export default DatepickerPopover;