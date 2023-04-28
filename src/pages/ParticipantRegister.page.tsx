import React, {FC} from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";


import "./ParticipantRegister.page.scss"
import ParticipantRegisterCommonPaneComponent from "../components/ParticipantRegisterCommonPane.component";
import {createParticipant, selectParticipant} from "../store/participant";
import {EegParticipant} from "../models/members.model";
import {useAppDispatch, useAppSelector} from "../store";
import {selectedTenant} from "../store/eeg";
import ParticipantRegisterMeterPaneComponent from "../components/ParticipantRegisterMeterPane.component";
import {FormProvider, useForm} from "react-hook-form";
import {Metering} from "../models/meteringpoint.model";

const ParticipantRegisterPage: FC = () => {

  const dispatch = useAppDispatch();

  const tenant = useAppSelector(selectedTenant)
  const selectedParticipant: EegParticipant = {} as EegParticipant

  const fromMethods = useForm({defaultValues: selectedParticipant})

  const onRegisterParticipant = (participant: EegParticipant) => {
    dispatch(createParticipant({tenant, participant}))
  }

  const onAddMeter = (meter: Metering) => {
    console.log("Add Meter: ", [...selectedParticipant.meters, meter])
    fromMethods.setValue("meters", [...selectedParticipant.meters, meter])
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Registrieren</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="eeg">
        <FormProvider {...fromMethods}>
          <form>
            <div className={"register-participant-content"}>
              <div className="register-content-pane">
                <h4>Allgemeines</h4>
                <ParticipantRegisterCommonPaneComponent participant={selectedParticipant}
                                                        submitId="submit-register-participant"
                                                        onAdd={onRegisterParticipant}/>
              </div>
              <div className="register-content-pane">
                <h4>Zählpunkte</h4>
                <ParticipantRegisterMeterPaneComponent participant={selectedParticipant} onAddMeter={onAddMeter}/>
              </div>
            </div>
          </form>
        </FormProvider>
      </IonContent>
      <IonFooter>
        <IonToolbar className={"ion-padding-horizontal"}>
          <IonButton fill="clear" slot="start">Zurück</IonButton>
          <IonButton form="submit-register-participant" type="submit" slot="end">Registrieren</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )

}

export default ParticipantRegisterPage;