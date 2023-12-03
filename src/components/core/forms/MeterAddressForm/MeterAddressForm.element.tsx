import React, {FC, forwardRef, useEffect, useState} from "react";
import {Control, FieldErrors, UseFormClearErrors, useFormContext, UseFormSetValue, UseFormWatch} from "react-hook-form";
import {Metering} from "../../../../models/meteringpoint.model";
import {EegTariff} from "../../../../models/eeg.model";
import {EegParticipant} from "../../../../models/members.model";
import {IonInput, IonList, IonListHeader} from "@ionic/react";
import CheckboxComponent from "../../../form/Checkbox.component";
import InputForm from "../../../form/InputForm.component";
import SelectForm from "../../../form/SelectForm.component";
import {useAccessGroups, useOnlineState} from "../../../../store/hook/Eeg.provider";
import DatePicker from "react-datepicker";

import DatePickerFormElement from "../../../form/DatePickerForm.element";

interface MeterAddressFormElementProps {
  participant?: EegParticipant
  isEditable?: boolean
  // showStatus?: boolean
  isOnline?: boolean
}

const MeterAddressFormElement: FC<MeterAddressFormElementProps> = ({
                                                                     participant,
                                                                     // showStatus,
                                                                     isOnline,
                                                                     isEditable,
                                                                   }) => {
  const {control, watch, setValue, clearErrors, formState: {errors}} = useFormContext<Metering>()
  const [withOwner, setWithOwner] = useState(false);
  const {isAdmin} = useAccessGroups()

  // const isEditable = setValue !== undefined
  const currentMeterState = watch ? watch("status") : "NEW"

  const isTakeOverAddressEnabled = () => participant !== undefined && isEditable
  const disableAddressFields = isTakeOverAddressEnabled() && withOwner

  useEffect(() => {
    setWithOwner(false)
    console.log("Participant changed: ", participant)
  }, [participant])

  console.log("isAdmin", isAdmin())
  console.log("isOnline", isOnline)
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
      <IonListHeader style={{minHeight: "60px"}}>Adresse</IonListHeader>
      {isTakeOverAddressEnabled() &&
          <CheckboxComponent label="Adresse vom Besitzer übernehmen" setChecked={takeOverAddress}
                             checked={withOwner}></CheckboxComponent>}
      <InputForm name={"street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text"
                 error={errors?.street} disabled={disableAddressFields}/>
      <InputForm name={"streetNumber"} label="Hausnummer" control={control} rules={{required: "Hausnummer fehlt"}}
                 type="text" error={errors?.streetNumber} disabled={disableAddressFields}/>
      <InputForm name={"zip"} label="Postleitzahl" control={control} rules={{required: "Postleitzahl fehlt"}}
                 type="text" error={errors?.zip} disabled={disableAddressFields}/>
      <InputForm name={"city"} label="Ort" control={control} rules={{required: "Ortsangabe fehlt"}} type="text"
                 error={errors?.city} disabled={disableAddressFields}/>
      {isAdmin() && !isOnline &&
          <>
              <SelectForm control={control}
                          name={"status"}
                          options={
                            [
                              {key: 'NEW', value: "Noch nicht registriert"},
                              {key: 'ACTIVE', value: "Bereits registriert"}
                            ]}
                          label={"Status"}
              />
            {currentMeterState === "ACTIVE" &&
                <DatePickerFormElement control={control} name={"registeredSince"} label="Registriert seit"
                                       placeholder={"Datum"} error={errors?.registeredSince}/>
            }
          </>
      }
    </IonList>
  )
}

export default MeterAddressFormElement;