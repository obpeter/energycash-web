import React, {FC, useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Metering} from "../../../../models/meteringpoint.model";
import {EegParticipant} from "../../../../models/members.model";
import {IonInput, IonList, IonListHeader} from "@ionic/react";
import CheckboxComponent from "../../../form/Checkbox.component";
import InputForm from "../../../form/InputForm.component";
import SelectForm from "../../../form/SelectForm.component";
import {useAccessGroups} from "../../../../store/hook/Eeg.provider";

import DatePickerFormElement from "../../../form/DatePickerForm.element";

interface MeterAddressFormElementProps {
  participant?: EegParticipant
  isEditable?: boolean
  // showStatus?: boolean
  isOnline?: boolean
}

const MeterAddressFormElement: FC<MeterAddressFormElementProps> = ({
                                                                     participant,
                                                                     isOnline,
                                                                     isEditable,
                                                                   }) => {
  const {control, watch, setValue, formState: {errors}} = useFormContext<Metering>()
  const [withOwner, setWithOwner] = useState(false);
  const {isAdmin} = useAccessGroups()

  // const isEditable = setValue !== undefined
  const currentMeterState = watch ? watch("status") : "NEW"

  const isTakeOverAddressEnabled = () => participant !== undefined && isEditable
  const disableAddressFields = isTakeOverAddressEnabled() && withOwner

  useEffect(() => {
    setWithOwner(false)
  }, [participant])

  const takeOverAddress = (ok: boolean) => {
    if (isTakeOverAddressEnabled() && participant!.billingAddress) {
      if (ok && setValue) {
        setValue(`street`, participant!.billingAddress.street);
        setValue(`streetNumber`, participant!.billingAddress.streetNumber);
        setValue(`city`, participant!.billingAddress.city);
        setValue(`zip`, participant!.billingAddress.zip);
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