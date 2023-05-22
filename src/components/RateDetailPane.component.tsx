import React, {FC} from "react";
import {EegTariff} from "../models/eeg.model";
import {IonButton, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonToolbar} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import RateComponent from "./Rate.component";
import {FieldValues} from "react-hook-form";
import {useRateType} from "../store/hook/Rate.provider";

interface RateDetailPaneComponentProps {
  selectedRate: EegTariff | undefined;
  onSubmit: (data: EegTariff) => void;
  submitId: string;
  mode?: 'NEW';
}

const RateDetailPaneComponent: FC<RateDetailPaneComponentProps> = ({selectedRate, onSubmit, submitId, mode}) => {

  const getMode = (): (undefined | 'NEW') => {
    return (selectedRate && selectedRate.id.length === 0) ? 'NEW' : undefined
  }

  if (selectedRate) {
    return (
        <div className={"details-body"} style={{height: "100%"}}>
          <div className={"details-header"}>
            <div><h4>{selectedRate?.name}</h4></div>
            <IonItem lines="none" style={{fontSize: "12px", marginRight: "60px"}} className={"participant-header"}>
              <IonIcon icon={trashBin} slot="start" style={{marginRight: "10px", fontSize: "16px"}}></IonIcon>
              <IonLabel>Tarif löschen</IonLabel>
            </IonItem>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className={"rate-component"} style={{maxWidth: "600px",}}>
              <RateComponent rate={selectedRate} onSubmit={onSubmit} submitId={submitId} mode={getMode()}/>
            </div>
          </div>
          <div className={"details-footer"}>
            <IonFooter>
              <IonToolbar className={"ion-padding-horizontal"}>
                <IonButton fill="clear" slot="start">Zurück</IonButton>
                <IonButton form={submitId} type="submit" slot="end">Änderungen speichern</IonButton>
              </IonToolbar>
            </IonFooter>
          </div>
        </div>
    )
  }
  return <></>
}

export default RateDetailPaneComponent;