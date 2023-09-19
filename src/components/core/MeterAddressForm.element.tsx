import React, {FC, useEffect, useState} from "react";
import {Control, FieldErrors, UseFormClearErrors, UseFormSetValue} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {EegTariff} from "../../models/eeg.model";
import {EegParticipant} from "../../models/members.model";
import {IonList, IonListHeader} from "@ionic/react";
import CheckboxComponent from "../form/Checkbox.component";
import InputForm from "../form/InputForm.component";
import SelectForm from "../form/SelectForm.component";
import {useAccessGroups} from "../../store/hook/Eeg.provider";

interface MeterAddressFormElementProps {
  control: Control<Metering, any>
  setValue?: UseFormSetValue<Metering>
  participant?: EegParticipant
  errors?: FieldErrors<Metering>
  showStatus?: boolean
  clear?: UseFormClearErrors<any>
}

const MeterAddressFormElement: FC<MeterAddressFormElementProps> = ({control, setValue, participant, errors, showStatus, clear}) => {
  const [withOwner, setWithOwner] = useState(false);
  const {isAdmin} = useAccessGroups()

  const isEditable = setValue !== undefined

  const isTakeOverAddressEnabled = () => participant !== undefined && isEditable
  const disableAddressFields = isTakeOverAddressEnabled() && withOwner

  useEffect(() => {
    setWithOwner(false)
  }, [participant])

  const takeOverAddress = (ok: boolean) => {
    if (isTakeOverAddressEnabled() && participant!.residentAddress) {
      if (ok && setValue) {
        setValue(`street`, participant!.residentAddress.street);
        setValue(`streetNumber`, "" + participant!.residentAddress.streetNumber);
        setValue(`city`, participant!.residentAddress.city);
        setValue(`zip`, participant!.residentAddress.zip);
      }

      setWithOwner(ok);
    }
  }
  return (
    <IonList>
      <IonListHeader style={{minHeight:"60px"}}>Adresse</IonListHeader>
      {isTakeOverAddressEnabled() && <CheckboxComponent label="Adresse vom Besitzer übernehmen" setChecked={takeOverAddress}
                                                        checked={withOwner}></CheckboxComponent>}
      <InputForm name={"street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text"
                 error={errors?.street} disabled={disableAddressFields} clear={clear}/>
      <InputForm name={"streetNumber"} label="Hausnummer" control={control} rules={{required: "Hausnummer fehlt"}}
                 type="text" error={errors?.streetNumber} disabled={disableAddressFields} clear={clear}/>
      <InputForm name={"zip"} label="Postleitzahl" control={control} rules={{required: "Postleitzahl fehlt"}}
                 type="text" error={errors?.zip} disabled={disableAddressFields} clear={clear}/>
      <InputForm name={"city"} label="Ort" control={control} rules={{required: "Ortsangabe fehlt"}} type="text"
                 error={errors?.city} disabled={disableAddressFields} clear={clear}/>
      {isAdmin() && showStatus &&
          <SelectForm control={control}
                      name={"status"}
                      options={
                        [
                          {key: 'NEW', value: "Noch nicht registriert"},
                          {key: 'ACTIVE', value: "Bereits registriert"}
                        ]}
                      label={"Status"}/>
      }
    </IonList>
  )
}

export default MeterAddressFormElement;