import React, {BaseSyntheticEvent, FC, MouseEventHandler, useContext} from "react";
import {
  CheckboxCustomEvent, IonButton,
  IonCheckbox,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {eegExclamation} from "../../eegIcons";
import {EegParticipant} from "../../models/members.model";
import {useHistory} from "react-router";
import {amountInEuro} from "../../util/TariffHelper";
import {EegTariff} from "../../models/eeg.model";
import {useAppSelector} from "../../store";
import {selectBillByParticipant} from "../../store/billing";
import {add, addCircle} from "ionicons/icons";
import {ParticipantContext} from "../../store/hook/ParticipantProvider";


interface MemberNameComponentProps {
  participant: EegParticipant;
  isChecked: boolean;
  showAmount: boolean;
  tariff?: EegTariff | undefined;
  onCheck: (e: CheckboxCustomEvent) => void;
  onSelect?: (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => void
}

const MemberNameComponent: FC<MemberNameComponentProps> =
  ({participant, isChecked, showAmount, tariff, onCheck, onSelect}) => {

  const bill = useAppSelector(selectBillByParticipant(participant.id))
  const {
    setShowAddMeterPane,
  } = useContext(ParticipantContext);
  const isPending = () => participant.status === 'PENDING';

  const euroAmount = () => {
    if (bill) {
      return "" /*+ bill.toFixed(2) + " €"*/
    }
    return ""
  }

  const onAdd = (e?: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
    setShowAddMeterPane(true)
  }

  return (
    <>
      <IonCol size="2">
        <IonItem lines="none" style={{background: "transparent", "--min-height": "24px"}}>
          <IonCheckbox style={{"--size": "16px", margin: "0px"}} onIonChange={onCheck} checked={isChecked} disabled={true}></IonCheckbox>
        </IonItem>
      </IonCol>
      <IonCol>
        <IonItem detail={!showAmount} lines="none" onClick={onSelect} style={{"--min-height": "24px"}}>
          {isPending() ? (
            <IonLabel style={{margin: "0px", color: "#DC631E"}}>
              <div style={{display: "flex"}}>
                <span>{participant.firstname} {participant.lastname}</span>
                <span style={{marginLeft: "5px"}}><IonIcon size="small" icon={eegExclamation}></IonIcon></span>
              </div>
            </IonLabel>
          ) : (
            <>
            <IonLabel style={{margin: "0px"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>{participant.firstname} {participant.lastname}</span>
                {showAmount && <span>{euroAmount()}</span>}
              </div>
            </IonLabel>
            <IonButton slot="end" fill="clear" onClick={onAdd}>
              <IonIcon slot="icon-only" icon={add}/>
            </IonButton>
            </>
          )}
        </IonItem>
      </IonCol>
    </>
  )
}

export default MemberNameComponent;