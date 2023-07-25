import React, {FC, useState} from "react";
import InputForm from "./form/InputForm.component";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import ToggleButtonComponent from "./ToggleButton.component";
import {people} from "ionicons/icons";
import {eegBusiness} from "../eegIcons";
import {EegParticipant} from "../models/members.model";
import {Control, useForm, useFormContext, useWatch} from "react-hook-form";

interface ParticipantRegisterCommonPaneComponentProps {
  participant: EegParticipant;
  submitId: string
  onAdd: (participant: EegParticipant) => void;
}

const ParticipantRegisterCommonPaneComponent: FC<ParticipantRegisterCommonPaneComponentProps> = ({
                                                                                                   participant,
                                                                                                   submitId,
                                                                                                   onAdd
                                                                                                 }) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)
  // const {handleSubmit, control, register, setValue, formState: {errors}} = useForm({defaultValues: participant});

  const {handleSubmit, control, setValue, formState: {errors}, clearErrors} = useFormContext<EegParticipant>();
  // const onSubmit = (data: EegParticipant) => {
  //   onAdd(data)
  // }

  const onChangeBusinessType = (s: number) => {
    setSelectedBusinessType(s)
    setValue("businessRole", s === 0 ? "EEG_PRIVATE" : "EEG_BUSINESS")
  }

  const editable = () => {
    return participant.status === "NEW"
  }

  return (
    <div style={{
      background: "var(--ion-color-eeglight, #fff)",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
      borderRadius: "4px"
    }}>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              value={selectedBusinessType}
              changeable={editable()}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {/*<form id={submitId} onSubmit={handleSubmit(onSubmit)}>*/}
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{flexGrow: "1", height: "100%", width: "50%"}}>
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
                             rules={{required: "Vorname fehlt"}} type="text" error={errors.firstname} clear={clearErrors}/>
                  <InputForm name={"lastname"} label="Nachname" control={control} rules={{required: "Vorname fehlt"}}
                             type="text" error={errors.lastname} clear={clearErrors}/>
                </>
              ) :
              (
                <InputForm name={"firstname"} label="Firmenname" control={control}
                           rules={{required: "Firmenname fehlt"}} type="text" error={errors.firstname} clear={clearErrors}/>
              )
            }
            <InputForm name={"residentAddress.street"} label="Straße" control={control}
                       rules={{required: "Straße fehlt"}} type="text" error={errors.residentAddress?.street} clear={clearErrors}/>
            <InputForm name={"residentAddress.streetNumber"} label="Hausnummer" control={control}
                       rules={{required: "Hausnummer fehlt"}}
                       type="text" error={errors.residentAddress?.streetNumber} clear={clearErrors}/>
            <InputForm name={"residentAddress.zip"} label="Postleitzahl" control={control}
                       rules={{required: "PLZ fehlt"}} type="text" error={errors.residentAddress?.zip} clear={clearErrors}/>
            <InputForm name={"residentAddress.city"} label="Ort" control={control} rules={{required: "Ort fehlt"}}
                       type="text" error={errors.residentAddress?.city} clear={clearErrors}/>
            <InputForm name={"contact.phone"} label="Telefon" control={control} type="text"/>
            <InputForm name={"contact.email"} label="E-Mail" control={control} type="text"
                       rules={{required: "Email Adresse fehlt"}} error={errors.contact?.email} clear={clearErrors}/>
          </IonList>

        </div>

        <div style={{flexGrow: "1", height: "100%", width: "50%"}}>
          <IonList>
            <IonListHeader>Bankdaten</IonListHeader>
            <InputForm name={"accountInfo.iban"} label="IBAN" control={control} rules={{required: "IBAN fehlt"}}
                       type="text" error={errors.accountInfo?.iban} clear={clearErrors}/>
            <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control}
                       rules={{required: "Kontoinhaber fehlt"}} type="text" error={errors.accountInfo?.owner} clear={clearErrors}/>
          </IonList>
          <IonList>
            <IonListHeader>Optional</IonListHeader>
            <InputForm name={"optionals.website"} label="Webseite" control={control} type="text"/>
          </IonList>

        </div>
      </div>

      {/*</form>*/}
    </div>
  )
}

export default ParticipantRegisterCommonPaneComponent;