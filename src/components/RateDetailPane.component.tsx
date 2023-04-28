import React, {FC} from "react";
import {EegTariff} from "../models/eeg.model";
import {IonContent, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import RateComponent from "./Rate.component";
import {FieldValues} from "react-hook-form";

interface RateDetailPaneComponentProps {
  selectedRate: EegTariff | undefined;
  onSubmit: (data: FieldValues) => void;
}

const RateDetailPaneComponent: FC<RateDetailPaneComponentProps> = ({selectedRate, onSubmit}) => {

  if (selectedRate) {
    return (
        <div className={"details-body"}>
          <div className={"details-header"}>
            <div><h4>{selectedRate?.name}</h4></div>
            <IonItem lines="none" style={{fontSize: "12px"}}>
              <IonIcon icon={trashBin} slot="start"></IonIcon>
              <IonLabel>Tarif löschen</IonLabel>
            </IonItem>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className={"rate-component"} style={{maxWidth: "600px",}}>
              <RateComponent rate={selectedRate} onSubmit={onSubmit} submitId={"change-rate-submit-id"} mode={""}/>
            </div>
          </div>
        </div>
    )
  }
  return <></>
}

export default RateDetailPaneComponent;