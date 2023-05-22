import React, {FC, useEffect, useState} from "react";
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
  const [meteringPoint, setMeteringPoint] = useState<Metering | undefined>()

  const { control, setValue, getValues, watch, formState: { errors }} = useFormContext<EegParticipant>();
  const {fields, append, update, remove} = useFieldArray<EegParticipant>({control, name: 'meters'})

  useEffect(() => {
    remove(0)
  }, [remove])

 const meters = watch("meters")

  const showMeter = (meter: Metering) => {
    setMeteringPoint(meter);
    setAddMeterPaneActive(true);
  }

  const appendMeter = (meter: Metering) => {
    setAddMeterPaneActive(false)
    const currentFieldIdx = fields.findIndex((m) => m.meteringPoint === meter.meteringPoint)
    if (currentFieldIdx >= 0) {
      update(currentFieldIdx, meter)
    } else {
      append(meter)
    }
    setMeteringPoint(undefined);
  }

  const removeMeter = () => {
    setAddMeterPaneActive(false);
    setMeteringPoint(undefined);
  }

  const allMeteringPoints = () => {
    if (meters === undefined || meters.length === 0) {
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
      <MeterCardComponent key={m.id} participant={participant} meter={m} hideMeter={true} onSelect={() => showMeter(m)}/>
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
                <IonItem button lines="none" onClick={() => showMeter({direction: "CONSUMPTION", status: "NEW", meteringPoint: ""} as Metering)}>
                  <IonIcon icon={add}></IonIcon>
                  <IonLabel>Zählpunkt hinzufügen</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <div style={{flexGrow: 1}}>
          {addMeterPaneActive && meteringPoint && <RegisterMeterPaneComponent meteringPoint={meteringPoint} onAdd={appendMeter} onChancel={removeMeter}/>}
        </div>
      </div>
    </div>
  )
}

export default ParticipantRegisterMeterPaneComponent;