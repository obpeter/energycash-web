import React, {FC, SyntheticEvent, useEffect, useState} from "react";
import SelectForm from "./form/SelectForm.component";
import InputForm from "./form/InputForm.component";
import CheckboxComponent from "./form/Checkbox.component";
import {IonList, IonListHeader} from "@ionic/react";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../store";
import {ratesSelector} from "../store/rate";
import {selectedTenant} from "../store/eeg";
import {selectedMeterSelector, selectedParticipantSelector, updateMeteringPoint} from "../store/participant";
import {Metering} from "../models/meteringpoint.model";
import MeterFormElement from "./core/MeterForm.element";
import EegPaneTemplate from "./core/EegPane.template";
import MeterAddressFormElement from "./core/MeterAddressForm.element";

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

  const {handleSubmit, control, watch, formState: {errors, isDirty}, reset} = useForm<Metering>({mode: 'onBlur', defaultValues: {...meteringPoint}, values: metering});

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
      <EegPaneTemplate>
        <MeterFormElement control={control} rates={rates} errors={errors} meterReadOnly={true} watch={watch}/>
        <MeterAddressFormElement control={control} errors={errors} />
      </EegPaneTemplate>
    </form>
  )
}

export default MeterFormComponent;