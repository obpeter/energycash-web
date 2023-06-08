import React, {FC, useState} from "react";
import {IonList, IonListHeader} from "@ionic/react";
import SelectForm from "../form/SelectForm.component";
import InputForm from "../form/InputForm.component";
import CheckboxComponent from "../form/Checkbox.component";
import {Metering} from "../../models/meteringpoint.model";
import {EegTariff} from "../../models/eeg.model";
import {Control, FieldErrors} from "react-hook-form";
import {useAccessGroups} from "../../store/hook/Eeg.provider";

interface MeterFormElementProps {
  control: Control<Metering, any>
  rates: EegTariff[]
  errors?: FieldErrors<Metering>
}

const MeterFormElement: FC<MeterFormElementProps> = ({control, rates, errors}) => {

  const [withWechselrichter, setWithWechselrichter] = useState(false);
  const {isAdmin} = useAccessGroups()

  const getRatesOption = () => {
    return rates.map((r) => {
      return {key: r.id, value: r.name}
    })
  }
  return (
    <>
      <IonList>
        <SelectForm name={"tariffId"} label="Tarif" control={control} options={getRatesOption()} disabled={false}/>
        <InputForm name={"meteringPoint"} label="Zählpunkt" control={control} type="text" readonly={true}/>
        <CheckboxComponent label="Wechselrichter anlegen" setChecked={setWithWechselrichter}
                           checked={withWechselrichter}></CheckboxComponent>
        {withWechselrichter && (
          <InputForm name={"inverterId"} label="Wechselrichternummer" control={control} rules={{required: false}} type="text"/>
        )}
        <InputForm name={"transformer"} label="Transformator" control={control} rules={{required: false}} type="text"/>
        <InputForm name={"equipmentName"} label="Anlagename" control={control} rules={{required: false}} type="text"/>
      </IonList>
      <IonList>
        <IonListHeader>Adresse</IonListHeader>
        <InputForm name={"street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text" error={errors?.street}/>
        <InputForm name={"streetNumber"} label="Hausnummer" control={control} rules={{required: "Hausnummer fehlt"}} type="text" error={errors?.streetNumber}/>
        <InputForm name={"zip"} label="Postleitzahl" control={control} rules={{required: "Postleitzahl fehlt"}} type="text" error={errors?.zip}/>
        <InputForm name={"city"} label="Ort" control={control} rules={{required: "Ortsangabe fehlt"}} type="text" error={errors?.city}/>
        {isAdmin() &&
          <SelectForm control={control} name={"status"} options={
            [{key: 'NEW', value: "Noch nicht registriert"},{key: 'ACTIVE', value: "Bereits registriert"}]
          } label={"Status"} />
        }
      </IonList>
    </>
  )
}

export default MeterFormElement;