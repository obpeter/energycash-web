import React, {FC} from "react";
import {IonChip, IonCol, IonGrid, IonIcon, IonLabel, IonList, IonListHeader, IonRow} from "@ionic/react";
import {people} from "ionicons/icons";
import InputForm from "./form/InputForm.component";
import {FieldValues, useForm} from "react-hook-form";
import {EegParticipant} from "../models/members.model";

interface MemberFormComponentProps {
  participant: EegParticipant
  formId: string
  onSubmit: (data: any) => void
}

const MemberFormComponent: FC<MemberFormComponentProps> = ({participant, formId, onSubmit}) => {

  const { handleSubmit, control } = useForm({defaultValues: participant, values: participant});

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
              <IonIcon src="assets/business.svg"></IonIcon>
              <IonLabel>Firma</IonLabel>
            </IonChip>
          </IonCol>
        </IonRow>
      </IonGrid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <IonList>
          <IonListHeader>Kontakt</IonListHeader>
          <InputForm name={"firstname"} label="Vorname" control={control} rules={{}} type="text"/>
          <InputForm name={"lastname"} label="Nachname" control={control} rules={{}} type="text"/>
          <InputForm name={"address.street"} label="Straße" control={control} rules={{}} type="text"/>
          <InputForm name={"address.streetNumber"} label="Hausnummer" control={control} rules={{}} type="text"/>
          <InputForm name={"address.zip"} label="Postleitzahl" control={control} rules={{}} type="text"/>
          <InputForm name={"address.city"} label="Ort" control={control} rules={{}} type="text"/>
          <InputForm name={"contact.phone"} label="Telefon" control={control} rules={{}} type="text"/>
          <InputForm name={"contact.email"} label="E-Mail" control={control} rules={{}} type="text"/>
        </IonList>
        <IonList>
          <IonListHeader>Bankdaten</IonListHeader>
          <InputForm name={"accountInfo.iban"} label="IBAN" control={control} rules={{}} type="text"/>
          <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control} rules={{}} type="text"/>
        </IonList>
        <IonList>
          <IonListHeader>Optional</IonListHeader>
          <InputForm name={"optionals.website"} label="Webseite" control={control} rules={{}} type="text"/>
        </IonList>
      </form>
    </>
  )
}

export default MemberFormComponent;