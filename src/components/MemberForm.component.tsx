import React, {FC} from "react";
import {IonChip, IonCol, IonGrid, IonIcon, IonLabel, IonList, IonListHeader, IonRow} from "@ionic/react";
import {people} from "ionicons/icons";
import InputForm from "./form/InputForm.component";
import {useForm} from "react-hook-form";
import {EegParticipant} from "../models/members.model";
import {eegBusiness} from "../eegIcons";

interface MemberFormComponentProps {
  participant: EegParticipant
  formId: string
  onSubmit: (data: EegParticipant) => void
}

const MemberFormComponent: FC<MemberFormComponentProps> = ({participant, formId, onSubmit}) => {

  const { handleSubmit, control, formState: {errors} } = useForm({
    defaultValues: participant, values: participant, mode: "all"});

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <IonChip>
              <IonIcon icon={people}></IonIcon>
              <IonLabel>Privat</IonLabel>
            </IonChip>
          </IonCol>
          <IonCol size="auto">
            <IonChip color="secondary">
              <IonIcon icon={eegBusiness}></IonIcon>
              <IonLabel>Firma</IonLabel>
            </IonChip>
          </IonCol>
        </IonRow>
      </IonGrid>
      <form onBlur={handleSubmit(onSubmit)}>
        <IonList>
          <IonListHeader>Kontakt</IonListHeader>
          <InputForm name={"firstname"} label="Vorname" control={control} type="text"/>
          <InputForm name={"lastname"} label="Nachname" control={control} type="text"/>
          <InputForm name={"residentAddress.street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text" error={errors.residentAddress?.street}/>
          <InputForm name={"residentAddress.streetNumber"} label="Hausnummer" control={control} type="text"/>
          <InputForm name={"residentAddress.zip"} label="Postleitzahl" control={control} type="text"/>
          <InputForm name={"residentAddress.city"} label="Ort" control={control} type="text"/>
          <InputForm name={"contact.phone"} label="Telefon" control={control} rules={{pattern: {value: /^[0-9]*$/, message: ""}}} type="text" error={errors.contact?.phone}/>
          <InputForm name={"contact.email"} label="E-Mail" control={control} rules={{required: "Email Adresse fehlt"}} type="text" error={errors.contact?.email}/>
        </IonList>
        <IonList>
          <IonListHeader>Bankdaten</IonListHeader>
          <InputForm name={"accountInfo.iban"} label="IBAN" control={control} type="text"/>
          <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control} type="text"/>
        </IonList>
        <IonList>
          <IonListHeader>Optional</IonListHeader>
          <InputForm name={"optionals.website"} label="Webseite" control={control} type="text"/>
        </IonList>
      </form>
    </>
  )
}

export default MemberFormComponent;