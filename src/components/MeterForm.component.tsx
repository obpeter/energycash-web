import React, {FC, useEffect, useState} from "react";
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

  const {handleSubmit, control, watch, formState: {errors, isDirty, dirtyFields}, reset} = useForm<Metering>({mode: 'onBlur', defaultValues: {...meteringPoint}, values: metering});

  useEffect(() => {
    reset(metering)
  }, [metering])

  const onSubmit = (meter: Metering) => {
    console.log("MeterForm - Handle onSubmit: ", meter, isDirty, participant, dirtyFields)
    if (Object.keys(dirtyFields).length > 0) {
      let participantId = participant?.id;
      if (participantId) {
        dispatcher(updateMeteringPoint({tenant, participantId, meter}))
        reset(meter);
      }
    }
  }

  const blurHandler = (e?: React.BaseSyntheticEvent) => {
    console.log("MeterForm - Handle on Blur: ", e)
    handleSubmit((data) => onSubmit(data), (invalid) => console.log("MeterForm - Form us Invalid", invalid))(e)
  }

  return (
    // <form onBlur={handleSubmit((data) => onSubmit(data))}>
    <form onBlur={blurHandler}>
      <EegPaneTemplate>
        <MeterFormElement control={control} rates={rates} errors={errors} meterReadOnly={true} watch={watch}/>
        <MeterAddressFormElement control={control} errors={errors} />
      </EegPaneTemplate>
    </form>
  )
}

export default MeterFormComponent;