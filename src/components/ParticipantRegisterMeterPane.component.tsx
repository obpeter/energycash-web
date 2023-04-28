import React, {FC, useState} from "react";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList, IonListHeader,
  IonRow,
  IonText
} from "@ionic/react";
import {add, star} from "ionicons/icons";
import {EegParticipant} from "../models/members.model";
import MeterCardComponent from "./MeterCard.component";
import ToggleButtonComponent from "./ToggleButton.component";
import {eegPlug} from "../eegIcons";
import SelectFormNative from "./form/SelectFormNative.component";
import SelectForm from "./form/SelectForm.component";
import InputForm from "./form/InputForm.component";
import CheckboxComponent from "./form/Checkbox.component";
import {Control, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import RegisterMeterPaneComponent from "./RegisterMeterPane.component";
import {Metering} from "../models/meteringpoint.model";
import {Address} from "../models/eeg.model";

interface ParticipantRegisterMeterPaneComponentProps {
  participant: EegParticipant;
  onAddMeter: (meter: Metering) => void
}

const ParticipantRegisterMeterPaneComponent: FC<ParticipantRegisterMeterPaneComponentProps> = ({participant, onAddMeter}) => {

  const [addMeterPaneActive, setAddMeterPaneActive] = useState(false)

  const { control, watch, formState: { errors }} = useFormContext<EegParticipant>();

  // const meters = watch("meters", [])
  // const address = watch("residentAddress", {} as Address)

  const {fields, append, remove} =
    useFieldArray({control, name: "meters", rules: {
      required: "Jedes Mitglied benötigt mindestens einen Zählpunkt."
    }})

  console.log("meters available: ", fields);
  const addMeter = (meter: Metering) => {
    // onAddMeter(meter);
    // participant && participant.meters && participant.meters.push(meter);
    // append(meter);
    setAddMeterPaneActive(true);
  }

  const appendMeter = (meter: Metering) => {
    append(meter);
    setAddMeterPaneActive(false)
  }

  const removeMeter = (index: number) => {
    remove(index)
    setAddMeterPaneActive(false);
  }

  const allMeteringPoints = () => {
    if (errors.meters || fields.length === 0) {
      return (
        <IonCard style={{boxShadow: "none", background: "rgba(43, 104, 96, 0.08)", color: "#005457"}}>
          <IonCardContent>
            <IonText>
              Jedes Mitglied benötigt mindestens einen Zählpunkt.
            </IonText>
          </IonCardContent>
        </IonCard>
      )
    }
    return fields.map((m, idx) => (
      <MeterCardComponent key={idx} participant={participant} meter={m} hideMeter={true}/>
    ))
  }

  return (
    <div style={{
      background: "var(--ion-item-background, #fff)",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
      borderRadius: "4px"
    }}>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{flexGrow: 1}}>
          <IonGrid>
            <IonRow>
              <IonCol>
                {allMeteringPoints()}
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-end">
              <IonCol size="auto">
                <IonItem button lines="none" onClick={() => addMeter({direction: "CONSUMPTION", status: "NEW", meteringPoint: ""} as Metering)}>
                  <IonIcon icon={add}></IonIcon>
                  <IonLabel>Zählpunkt hinzufügen</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <div style={{flexGrow: 1}}>
          {addMeterPaneActive && <RegisterMeterPaneComponent participant={participant} index={fields.length} onAdd={appendMeter} onChancel={removeMeter}/>}
        </div>
      </div>
    </div>
  )
}

export default ParticipantRegisterMeterPaneComponent;