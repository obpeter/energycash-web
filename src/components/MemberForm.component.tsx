import React, {FC, useEffect, useState} from "react";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import {people} from "ionicons/icons";
import InputForm from "./form/InputForm.component";
import {useForm} from "react-hook-form";
import {EegParticipant} from "../models/members.model";
import {eegBusiness} from "../eegIcons";
import ToggleButtonComponent from "./ToggleButton.component";

interface MemberFormComponentProps {
  participant: EegParticipant
  formId: string
  onSubmit: (data: EegParticipant) => void
}

const MemberFormComponent: FC<MemberFormComponentProps> = ({participant, formId, onSubmit}) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)

  const { handleSubmit, setValue, control, reset, formState: {errors} } = useForm({
    defaultValues: participant, mode: "all"});

  const onChangeBusinessType = (s: number) => {
    setSelectedBusinessType(s)
    setValue("businessRole", s === 0 ? "EEG_PRIVATE" : "EEG_BUSINESS")
  }

  useEffect(() => {
    if (participant) {
      participant.businessRole === 'EEG_PRIVATE' ? setSelectedBusinessType(0) : setSelectedBusinessType(1)
      reset(participant)
    }
  }, [participant])

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              value={selectedBusinessType}
              changeable={true}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <form onBlur={handleSubmit(onSubmit)}>
        <IonList>
          <IonListHeader>Kontakt</IonListHeader>
          <InputForm name={"participantNumber"} label="Mitglieds-Nr" control={control} type="text"/>
          {selectedBusinessType === 0 ? (
              <>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <InputForm name={"titleBefore"} label="Titel (Vor)" control={control} type="text"/>
                  <InputForm name={"titleAfter"} label="Titel (Nach)" control={control} type="text"/>
                </div>
                <InputForm name={"firstname"} label="Vorname" control={control}
                           rules={{required: "Vorname fehlt"}} type="text" error={errors.firstname}/>
                <InputForm name={"lastname"} label="Nachname" control={control} rules={{required: "Vorname fehlt"}}
                           type="text" error={errors.lastname}/>
              </>
            ) :
            (
              <InputForm name={"firstname"} label="Firmenname" control={control}
                         rules={{required: "Firmenname fehlt"}} type="text" error={errors.firstname}/>
            )
          }
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
        {/*<IonList>*/}
        {/*  <IonListHeader>Optional</IonListHeader>*/}
        {/*  <InputForm name={"optionals.website"} label="Webseite" control={control} type="text"/>*/}
        {/*</IonList>*/}
      </form>
    </>
  )
}

export default MemberFormComponent;