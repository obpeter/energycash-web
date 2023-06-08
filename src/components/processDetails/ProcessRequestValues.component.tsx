import React, {FC, forwardRef, useEffect, useState} from "react";
import {IonButton, IonContent, IonInput, IonItem} from "@ionic/react";
import InputForm from "../form/InputForm.component";
import SelectForm from "../form/SelectForm.component";
import DatePicker from "react-datepicker";
import {useForm} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {Eeg} from "../../models/eeg.model";
import {EegParticipant} from "../../models/members.model";
import CorePageTemplate from "../core/CorePage.template";
import {eegService} from "../../service/eeg.service";

interface ProcessValues {
  communityId: string | undefined
  participantId: string | undefined
  meteringPoint: string | undefined
}
interface ProcessRequestValuesComponentProps {
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
}

const ProcessRequestValuesComponent: FC<ProcessRequestValuesComponentProps> = ({eeg, meters, participants}) => {
  const processValues = {
    communityId: eeg.communityId,
    participantId: undefined,
    meteringPoint: undefined,
  }

  const {handleSubmit, control, watch, setValue} = useForm<ProcessValues>({defaultValues: processValues})
  const [useableMeters, setUsableMeters] = useState<Metering[]>(meters)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [meteringPoint, participantId] = watch(['meteringPoint', 'participantId'])

  useEffect(() => {
    if (!participantId) {
      if (meteringPoint) {
        const p = participants.find(p => p.meters.find(m => m.meteringPoint === meteringPoint))
        if (p) {
          setValue('participantId', p.id)
        }
      }
    }
  }, [meteringPoint])

  useEffect(() => {
    if (participantId) {
      const p = participants.find(p=> p.id === participantId)
      if (p) {
        setUsableMeters(p.meters)
      }
    }
  }, [participantId])

  const onRequest = (data: ProcessValues) => {
    console.log("ONREQUEST: ", data)
    if (data.participantId && data.meteringPoint && startDate && endDate) {

      const meter = meters.find((m) => m.meteringPoint === data.meteringPoint)
      if (meter) {
        console.log(data, meter.meteringPoint, meter.direction)
        eegService.syncMeteringPoint(eeg.rcNumber.toUpperCase(), data.participantId, meter.meteringPoint, meter.direction, startDate.getTime(), endDate.getTime())
      }
    }
  }

  const Component = forwardRef<HTMLIonInputElement, {}>(function CustomInput(p, ref) {
    return (
      <IonInput
        {...p}
        label={"Zeitraum"}
        placeholder="Enter text"
        fill="outline"
        labelPlacement={"floating"}
        ref={ref}
      >
      </IonInput>
    );
  });

  return (
    <CorePageTemplate>
      <>
        <InputForm name="communityId" label="Gemeinschafts-Id" control={control} readonly={true}/>
        <SelectForm control={control} name={"participantId"} options={participants.map((p) => {
          return {key: p.id, value: p.firstname + " " + p.lastname}
        })} label={"Mitglied"} selectInterface={"popover"}/>
        <SelectForm control={control} name={"meteringPoint"} options={useableMeters.map((p) => {
          return {key: p.meteringPoint, value: p.meteringPoint + " (" + p.equipmentName + ")"}
        })} label={"Zählpunkt"} selectInterface={"popover"}/>
        <div className="form-element">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            customInput={<Component/>}
          />
        </div>
        <IonItem lines="none" style={{zIndex: "0"}}>
          <IonButton slot="end" onClick={handleSubmit(onRequest)}>
            Anfordern
          </IonButton>
        </IonItem>
      </>
    </CorePageTemplate>
  )
}

export default ProcessRequestValuesComponent