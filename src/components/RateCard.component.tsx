import React, {FC} from "react";
import {EegTariff} from "../models/eeg.model";
import {IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonLabel, IonRow} from "@ionic/react";
import {bug, person} from "ionicons/icons";
import {eegPlug, eegSolar} from "../eegIcons";

interface RateCardComponentProps {
  rate: EegTariff;
  editable?: boolean;
  onSelect?: (rate: EegTariff) => void;
}

const RateCardComponent: FC<RateCardComponentProps> = ({rate, editable, onSelect}) => {

  const defineIcon = (type: string) => {
    switch (type) {
      case "EEG":
        return person;
      case "EZP":
        return eegSolar;
      case "VZP":
        return eegPlug;
      default:
        return bug;
    }
  }

  const onShowDetails = (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => {
    e.preventDefault();
    // history.push(`/rates/edit/${rate.id}`)

    onSelect && onSelect(rate)
  }

  const RateCardType = (rate: EegTariff) => {
    switch (rate.type) {
      case "EEG":
        return (
          <div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Mitgliedsbeitrag</p>
              <p>{(Number(rate.participantFee)) + " €"}</p>
            </div>
            {rate.useVat && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p>Umsatzsteuer</p>
                <p>{(rate.vatInPercent && rate.vatInPercent.length > 0 ? rate.vatInPercent : "0") + " %"}</p>
            </div>}
            {rate.discount && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Rabatt</p>
              <p>{rate.discount + " %"}</p>
            </div>}
          </div>
        )
      case "VZP":
        return (
          <div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Cent pro kWh</p>
              <p>{rate.centPerKWh ? rate.centPerKWh.toString().replace(".", ",") + " Cent" : ''}</p>
            </div>
            {rate.useVat && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p>Umsatzsteuer</p>
                <p>{(rate.vatInPercent && rate.vatInPercent.length > 0 ? rate.vatInPercent : "0") + " %"}</p>
            </div>}
            {rate.useMeteringPointFee && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p>Zählpunktgebühr</p>
                <p>{rate.meteringPointFee + " €"}</p>
            </div>}
            {rate.freeKWh && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Inklusive kWh</p>
              <p>{rate.freeKWh + " kWh"}</p>
            </div>}
            {rate.discount && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Rabatt</p>
              <p>{rate.discount + " %"}</p>
            </div>}
          </div>
        )
      case "EZP":
        return (
          <div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Cent pro kWh</p>
              <p>{rate.centPerKWh ? rate.centPerKWh.toString().replace(".", ",") + " Cent" : ''}</p>
            </div>
            {rate.useVat && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p>Umsatzsteuer</p>
                <p>{(rate.vatInPercent && rate.vatInPercent.length > 0 ? rate.vatInPercent : "0") + " %"}</p>
            </div>}
            {rate.useMeteringPointFee && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p>Zählpunktgebühr</p>
                <p>{rate.meteringPointFee + " €"}</p>
            </div>}
            {rate.discount && <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <p>Rabatt</p>
              <p>{rate.discount + " %"}</p>
            </div>}
          </div>
        )
    }
  }

  return (
    <IonCard color="eeglight" onClick={editable ? onShowDetails : undefined}>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <div style={{paddingTop: "5px", display: "flex", fontSize: "20px"}}>
                <IonIcon icon={defineIcon(rate.type)}></IonIcon>
              </div>
            </IonCol>
            <IonCol>
              <IonLabel>
                <h2><b>{rate.name}</b></h2>
                {RateCardType(rate)}
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default RateCardComponent;