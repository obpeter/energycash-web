import React, {FC} from "react";
import {EegTariff} from "../models/eeg.model";
import {IonButton, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonToolbar} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import RateComponent from "./Rate.component";
import {useAppDispatch, useAppSelector} from "../store";
import {selectedRateSelector, selectRate, selectRateById} from "../store/rate";

interface RateDetailPaneComponentProps {
  onSubmit: (data: EegTariff) => void;
  submitId: string;
  mode?: 'NEW';
}

const RateDetailPaneComponent: FC<RateDetailPaneComponentProps> = ({onSubmit, submitId, mode}) => {
  const dispatcher = useAppDispatch();
  const selectedTariff = useAppSelector(selectedRateSelector)

  const getMode = (): (undefined | 'NEW') => {
    return (selectedTariff && selectedTariff.id.length === 0) ? 'NEW' : undefined
  }

  if (selectedTariff) {
    return (
        <div className={"details-body"} style={{height: "100%"}}>
          <div className={"details-header"}>
            <div><h4>{selectedTariff.name}</h4></div>
            <IonItem lines="none" style={{fontSize: "12px", marginRight: "60px"}} className={"participant-header"}>
              <IonIcon icon={trashBin} slot="start" style={{marginRight: "10px", fontSize: "16px"}}></IonIcon>
              <IonLabel>Tarif löschen</IonLabel>
            </IonItem>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className={"rate-component"} style={{maxWidth: "600px",}}>
              <RateComponent rate={selectedTariff} onSubmit={onSubmit} submitId={submitId} mode={getMode()}/>
            </div>
          </div>
          <div className={"details-footer"}>
            <IonFooter>
              <IonToolbar className={"ion-padding-horizontal"}>
                <IonButton fill="clear" slot="start" onClick={() => dispatcher(selectRate(undefined))}>Zurück</IonButton>
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