import React, {FC, SyntheticEvent, useEffect, useState} from "react";
import SelectForm from "./form/SelectForm.component";
import InputForm from "./form/InputForm.component";
import CheckboxComponent from "./form/Checkbox.component";
import {IonList, IonListHeader} from "@ionic/react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../store";
import {ratesSelector} from "../store/rate";
import {selectedTenant} from "../store/eeg";
import {selectedMeterSelector, selectedParticipantSelector, updateMeteringPoint} from "../store/participant";
import {Metering} from "../models/meteringpoint.model";

interface MeterFromComponentProps {
  meteringPoint: Metering
}

const MeterFormComponent: FC<MeterFromComponentProps> = ({meteringPoint}) => {

  const dispatcher = useAppDispatch()
  const participant = useAppSelector(selectedParticipantSelector);

  const rates = useAppSelector(ratesSelector);
  const tenant = useAppSelector(selectedTenant);
  const metering = useAppSelector(selectedMeterSelector);

  const [withWechselrichter, setWithWechselrichter] = useState(false);

  const {handleSubmit, control, formState: {errors, isDirty}, reset} = useForm<Metering>({mode: 'onBlur', defaultValues: {...meteringPoint}, values: metering});

  // useEffect(() => {
  //   watch((data) => console.log(data));
  // }, [watch]);

  const getRatesOption = () => {
    return rates.map((r) => {
      return {key: r.id, value: r.name}
    })
  }
  const onSubmit = (meter: Metering) => {

    if (isDirty) {
      let participantId = participant.id;
      dispatcher(updateMeteringPoint({tenant, participantId, meter}))
      reset(meter);
    }
  }

  return (
    <form onBlur={handleSubmit((data) => onSubmit(data))}>
      <IonList>
        <SelectForm name={"tariffId"} label="Tarif" control={control} options={getRatesOption()} placeholder="Tarif"
                    disabled={false}/>
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
        <InputForm name={"street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text" error={errors.street}/>
        <InputForm name={"streetNumber"} label="Hausnummer" control={control} rules={{required: "Hausnummer fehlt"}} type="text" error={errors.streetNumber}/>
        <InputForm name={"zip"} label="Postleitzahl" control={control} rules={{required: "Postleitzahl fehlt"}} type="text" error={errors.zip}/>
        <InputForm name={"city"} label="Ort" control={control} rules={{required: "Ortsangabe fehlt"}} type="text" error={errors.city}/>
      </IonList>

    </form>
  )
}

export default MeterFormComponent;