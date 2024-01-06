import React, {FC} from "react";
import {EegTariff} from "../models/eeg.model";
import {IonButton, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonToolbar, useIonAlert, useIonToast} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import RateComponent from "./Rate.component";
import {useAppDispatch, useAppSelector} from "../store";
import {archiveRate, selectedRateSelector, selectRate, selectRateById} from "../store/rate";
import {selectedTenant} from "../store/eeg";
import {HttpError} from "../service/base.service";
import {participantsSelector1} from "../store/participant";

interface RateDetailPaneComponentProps {
  onSubmit: (data: EegTariff) => void;
  submitId: string;
  mode?: 'NEW';
}

const RateDetailPaneComponent: FC<RateDetailPaneComponentProps> = ({onSubmit, submitId, mode}) => {
  const dispatcher = useAppDispatch();
  const selectedTariff = useAppSelector(selectedRateSelector)
  const tenant = useAppSelector(selectedTenant)

  const [presentAlert] = useIonAlert();
  const [showToast] = useIonToast();

  const getMode = (): (undefined | 'NEW') => {
    return (selectedTariff && selectedTariff.id.length === 0) ? 'NEW' : undefined
  }

  const participants = useAppSelector(participantsSelector1)

  const archiveTariff = () => {
    if(participants.filter(p => p.tariffId === selectedTariff!.id).length > 0) {
      presentAlert(
        {
          header: 'Tarif löschen nicht möglich',
          message: 'Der Tarif wird noch von folgenden Teilnehmern verwendet: ' + participants.filter(p => p.tariffId === selectedTariff!.id).map(p => p.firstname + " " + p.lastname).join(', ') + ' und kann daher nicht gelöscht werden.  Bitte weisen Sie den Teilnehmern einen anderen Tarif zu.',
          buttons: [
            {text: 'Abbrechen', role: 'cancel'},
          ]
        }
      )
    } else if (selectedTariff) {

      dispatcher(archiveRate({rate: selectedTariff, tenant: tenant}))
        .unwrap()
        .catch((e) => {
          if (e.state && e.state === 900) {
            showToast({
              message: 'Tarif wird noch benutzt!',
              duration: 4500,
              color: "warning"
            })
          } else {
            showToast({
              message: 'Tarif konnte nicht gelöscht werden. Bitte kontaktieren Sie ihren Administrator. Grund: ' + e.message,
              duration: 4500,
              color: "danger"
            })
          }}
        )
    }
  }

  if (selectedTariff) {
    return (
        <div className={"details-body"} style={{height: "100%"}}>
          <div className={"details-header"}>
            <div><h4>{selectedTariff.name}</h4></div>
            <IonItem button lines="none" style={{fontSize: "12px", marginRight: "60px"}} className={"participant-header"} onClick={() => archiveTariff()}>
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