import React, {FC, forwardRef, useState} from "react";
import {
  IonButton, IonCol,
  IonContent,
  IonGrid, IonInput, IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";
import DatePicker from "react-datepicker";

import "./upload.popover.scss"

const DatepickerPopover: FC<{tenant: string, onDismiss: (startDate: Date, endDate: Date) => void}> = ({tenant, onDismiss}) => {

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const onOk = () => {
    if (startDate && endDate) {
      onDismiss(startDate, endDate)
    }
  }

  const DateInputComponent = forwardRef<HTMLIonInputElement, {}>(function CustomInput(p, ref) {
    return (
      <IonInput style={{"--padding-start": "16px"}}
        {...p}
        label={"Zeitraum"}
        placeholder="Enter text"
        fill="outline"
        labelPlacement={"floating"}
        ref={ref}
      >
      </IonInput>
    );
  });

  return (
    <IonContent className="ion-padding" color="eeglight">
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <IonItem lines="none">
              <IonLabel>Download Daten für <strong>{tenant}</strong></IonLabel>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <div>Zeitspanne auswählen</div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>

              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                // isClearable={true}
                customInput={<DateInputComponent/>}
                dateFormat="dd.MMM yyyy"
                portalId="root-portal"
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      <IonButton expand="block" onClick={() => onOk()}>Export</IonButton>
    </IonContent>
  )
}

export default DatepickerPopover;