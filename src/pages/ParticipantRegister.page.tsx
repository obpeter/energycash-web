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
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {Metering} from "../models/meteringpoint.model";
import {RouteComponentProps} from "react-router";

const ParticipantRegisterPage: FC<RouteComponentProps> = ({history}) => {

  const dispatch = useAppDispatch();

  const tenant = useAppSelector(selectedTenant)
  const selectedParticipant: EegParticipant = {
    id: '',
    firstname: '',
    lastname: '',
    status: 'NEW',
    titlePrefix: '',
    titleSufix: '',
    residentAddress: {street: '', type: 'RESIDENCE', city: '', streetNumber: 0, zip: ''},
    billingAddress:  {street: '', type: 'BILLING', city: '', streetNumber: 0, zip: ''},
    contact: {email: "", phone: ""},
    accountInfo: {iban: '', owner: '', sepa: false},
    businessRole: 'EEG_PRIVATE',
    role: 'EEG_USER',
    optionals: {website: ''},
    taxNumber: '',
    tariffId: '',
    meters: []} as EegParticipant

  const formMethods = useForm<EegParticipant>({defaultValues: selectedParticipant})
  const {control, handleSubmit} = formMethods
  // const {append} = useFieldArray<EegParticipant>({control, name: 'meters'})

  const onRegisterParticipant = (participant: EegParticipant) => {
    console.log("Append participant: ", participant);
    dispatch(createParticipant({tenant, participant}))
    history.replace("/page/participants")
  }

  const onAddMeter = (meter: Metering) => {
    // append(meter)
  }

  const onSubmit = (data: EegParticipant) => {
    onRegisterParticipant(data)
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
        <FormProvider {...formMethods}>
          <form id="submit-register-participant" onSubmit={handleSubmit(onSubmit)}>
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
          <IonButton fill="clear" slot="start" routerLink="/page/participants" routerDirection="root">Zurück</IonButton>
          <IonButton form="submit-register-participant" type="submit" slot="end">Registrieren</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )

}

export default ParticipantRegisterPage;