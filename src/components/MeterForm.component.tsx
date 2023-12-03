import React, {FC, useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../store";
import {ratesSelector} from "../store/rate";
import {selectedTenant} from "../store/eeg";
import {selectedMeterSelector, selectedParticipantSelector, updateMeteringPoint} from "../store/participant";
import {Metering} from "../models/meteringpoint.model";
import MeterFormElement from "./core/MeterForm.element";
import EegPaneTemplate from "./core/EegPane.template";
import MeterAddressFormElement from "./core/forms/MeterAddressForm/MeterAddressForm.element";

interface MeterFromComponentProps {
  meteringPoint: Metering
}

const MeterFormComponent: FC<MeterFromComponentProps> = ({meteringPoint}) => {

  const dispatcher = useAppDispatch()
  const participant = useAppSelector(selectedParticipantSelector);

  const rates = useAppSelector(ratesSelector);
  const tenant = useAppSelector(selectedTenant);
  const metering = useAppSelector(selectedMeterSelector);

  // const [withWechselrichter, setWithWechselrichter] = useState(false);

  // const {handleSubmit, control, watch, formState: {errors, isDirty, dirtyFields}, reset, clearErrors} = useForm<Metering>({mode: 'onBlur', defaultValues: {...meteringPoint}, values: metering});

  const formMethods = useForm<Metering>({mode: 'onBlur', defaultValues: {...meteringPoint}, values: metering});
  const {handleSubmit, formState: { dirtyFields}, reset} = formMethods

  useEffect(() => {
    reset(metering)
  }, [metering])

  const onSubmit = (meter: Metering) => {
    if (Object.keys(dirtyFields).length > 0) {
      let participantId = participant?.id;
      if (participantId) {
        dispatcher(updateMeteringPoint({tenant, participantId, meter}))
        reset(meter);
      }
    }
  }

  return (
    <form onBlur={handleSubmit((data) => onSubmit(data))}>
      <EegPaneTemplate>
        <FormProvider {...formMethods} >
          <MeterFormElement rates={rates} meterReadOnly={true}/>
          <MeterAddressFormElement />
        </FormProvider>
      </EegPaneTemplate>
    </form>
  )
}

export default MeterFormComponent;