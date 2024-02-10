import React, {FC, useEffect, useState, ClipboardEvent} from "react";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import {people} from "ionicons/icons";
import InputForm from "./form/InputForm.component";
import {useForm} from "react-hook-form";
import {EegParticipant} from "../models/members.model";
import {eegBusiness} from "../eegIcons";
import ToggleButtonComponent from "./ToggleButton.component";
import SelectForm from "./form/SelectForm.component";
import {EegTariff} from "../models/eeg.model";
import DatePickerCoreElement from "./core/elements/DatePickerCore.element";
import DatePickerFormElement from "./form/DatePickerForm.element";

interface MemberFormComponentProps {
  participant: EegParticipant
  rates: EegTariff[]
  formId: string
  onSubmit: (data: EegParticipant) => void
  onSubmitPartial: (participantId: string, value: Record<string, any>) => void
  changeable?: boolean
}

const MemberFormComponent: FC<MemberFormComponentProps> = ({participant, rates, onSubmitPartial, changeable}) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)

  const { setValue, control,  reset, formState: {errors} } = useForm({
    defaultValues: participant, mode: "all"});

  const isChangeable = () => {
    if (changeable === undefined) {
      return true
    }
    return changeable
  }

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

  const handlePhonePaste = (e: ClipboardEvent<HTMLIonInputElement>) => {
    e.persist()
    e.clipboardData.items[0].getAsString(text=>{
      setValue("contact.phone", text.replace(/\+/gi, "00").replace(/\s/gi,""))
    })
    e.stopPropagation()
  }

  const getRatesOption = () => {
    const r =  rates.filter(r => r.type === "EEG").map((r) => {
      return {key: r.id, value: r.name}
    })
    return [{key: null, value: "Kein Tarif"}, ...r]
  }

  const onUpdateBaseData = (name: string, value: any) => {
    const nameHirachy = name.split(".")
    onSubmitPartial(participant.id, {[name]: value})
  }

  if (!participant) {
    return <></>
  }

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              value={selectedBusinessType}
              changeable={isChangeable()}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {/*<form onBlur={handleSubmit(onSubmit)}>*/}
        <IonList>
          <IonListHeader>Kontakt</IonListHeader>
          <InputForm name={"participantNumber"} label="Mitglieds-Nr" control={control} type="text" onChangePartial={onUpdateBaseData}/>
          {selectedBusinessType === 0 ? (
              <>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <InputForm name={"titleBefore"} label="Titel (Vor)" control={control} type="text" onChangePartial={onUpdateBaseData}/>
                  <InputForm name={"titleAfter"} label="Titel (Nach)" control={control} type="text" onChangePartial={onUpdateBaseData}/>
                </div>
                <InputForm name={"firstname"} label="Vorname" control={control}
                           rules={{required: "Vorname fehlt"}} type="text" error={errors.firstname} onChangePartial={onUpdateBaseData}/>
                <InputForm name={"lastname"} label="Nachname" control={control} rules={{required: "Vorname fehlt"}}
                           type="text" error={errors.lastname} onChangePartial={onUpdateBaseData}/>
              </>
            ) :
            (
              <InputForm name={"firstname"} label="Firmenname" control={control}
                         rules={{required: "Firmenname fehlt"}} type="text" error={errors.firstname} onChangePartial={onUpdateBaseData}/>
            )
          }
          <SelectForm name={"tariffId"} label="Mitglieds-Tarif" control={control} options={getRatesOption()} onChangePartial={onUpdateBaseData}/>
          <InputForm name={"billingAddress.street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text" error={errors.residentAddress?.street} onChangePartial={onUpdateBaseData}/>
          <InputForm name={"billingAddress.streetNumber"} label="Hausnummer" control={control} type="text" onChangePartial={onUpdateBaseData}/>
          <InputForm name={"billingAddress.zip"} label="Postleitzahl" control={control} type="text" onChangePartial={onUpdateBaseData}/>
          <InputForm name={"billingAddress.city"} label="Ort" control={control} type="text" onChangePartial={onUpdateBaseData}/>
          <InputForm name={"contact.phone"} label="Telefon" control={control} onPaste={handlePhonePaste} type="text" onChangePartial={onUpdateBaseData}/>
          <InputForm name={"contact.email"} label="E-Mail" control={control} rules={{
            required: "Email Adresse fehlt",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Email Adresse ist nicht valide'}
          }} type="text" error={errors.contact?.email} onChangePartial={onUpdateBaseData}/>
          <InputForm name={"vatNumber"} label="UID" control={control} type="text" onChangePartial={onUpdateBaseData}/>
        </IonList>
      {/*</form>*/}
        <IonList>
          <IonListHeader>Bankdaten</IonListHeader>
          {/*<InputFieldCoreElement initialValue={participant.accountInfo.iban} onChange1={onUpdateBaseData} name="accountInfo.iban" label="IBAN" type="text"/>*/}
          {/*<InputFieldCoreElement initialValue={participant.accountInfo.owner} onChange1={onUpdateBaseData} name="accountInfo.owner" label="Kontoinhaber" type="text"/>*/}
          <InputForm name={"accountInfo.iban"} label="IBAN"
                     rules={{
                       required: 'IBAN ist obligatorisch',
                       pattern: {
                         value: /^[AT|DE]+[0-9.-]{18,20}$/i,
                         message: 'IBAN ist nicht valide',
                       },
                     }}
                     control={control} type="text" onChangePartial={onUpdateBaseData} error={errors.accountInfo?.iban}/>
          <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control} type="text" onChangePartial={onUpdateBaseData}/>
        </IonList>

        <IonList>
          <IonListHeader>Optionals</IonListHeader>
          <DatePickerCoreElement initialValue={participant.participantSince} name={"participantSince"} label="Mitglied seit"
                                 placeholder={"Datum"} onChange={onUpdateBaseData}/>
          {/*<InputForm name={"participantSince"} label="Mitglied seit" control={control} type="text"/>*/}
        </IonList>
    </>
  )
}

export default MemberFormComponent;