import React, {FC, useContext, useEffect} from "react";
import CorePageTemplate from "../core/CorePage.template";
import {Metering} from "../../models/meteringpoint.model";
import EegWebContentPaneComponent from "../EegWebContentPane.component";
import {IonButton, IonFooter, IonToolbar} from "@ionic/react";
import {ParticipantContext} from "../../store/hook/ParticipantProvider";
import EegPaneTemplate from "../core/EegPane.template";
import MeterFormElement from "../core/MeterForm.element";
import {useForm} from "react-hook-form";
import {registerMeteringpoint, selectedParticipantSelector} from "../../store/participant";
import {useAppDispatch, useAppSelector} from "../../store";
import {ratesSelector} from "../../store/rate";
import {selectedTenant} from "../../store/eeg";
import MeterAddressFormElement from "../core/MeterAddressForm.element";


const AddMeterPaneComponent: FC = () => {

  const dispatcher = useAppDispatch()
  const rates = useAppSelector(ratesSelector);
  const tenant = useAppSelector(selectedTenant);
  const participant = useAppSelector(selectedParticipantSelector);

  const meter = {status: "NEW", participantId: "", meteringPoint: "", direction:"CONSUMPTION"} as Metering

  const {handleSubmit, control, watch, setValue, formState: {errors, isDirty}, reset} = useForm<Metering>({mode: 'onBlur', defaultValues: meter});

  const {
    setShowAddMeterPane,
  } = useContext(ParticipantContext);

  useEffect(() => {
    reset(meter)
    // setShowAddMeterPane(false);
  }, [participant])

  const onChancel = () => {
    reset(meter)
    setShowAddMeterPane(false);
  }

  const onSubmit = (meter: Metering) => {
    if (isDirty && participant) {
      let participantId = participant.id;
      meter.participantId = participantId

      dispatcher(registerMeteringpoint({tenant, participantId, meter}))
      reset(meter);
      setShowAddMeterPane(false);
    }
  }
  return (
    <EegWebContentPaneComponent>
      <CorePageTemplate>
        <form id="submit-register-meter" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <EegPaneTemplate>
            <MeterFormElement control={control} rates={rates} errors={errors} setValue={setValue} participant={participant} watch={watch}/>
            <MeterAddressFormElement control={control} errors={errors} setValue={setValue} participant={participant} showStatus={true}/>
          </EegPaneTemplate>
        </form>
      </CorePageTemplate>
      <IonFooter>
        <IonToolbar className={"ion-padding-horizontal"}>
          <IonButton fill="clear" slot="start" onClick={onChancel}>Zurück</IonButton>
          <IonButton form="submit-register-meter" type="submit" slot="end">Registrieren</IonButton>
        </IonToolbar>
      </IonFooter>
    </EegWebContentPaneComponent>
  )
}

export default AddMeterPaneComponent;