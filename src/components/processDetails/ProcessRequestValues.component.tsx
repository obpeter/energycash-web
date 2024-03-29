import React, {FC, forwardRef, useEffect, useState} from "react";
import {IonButton, IonContent, IonInput, IonItem} from "@ionic/react";
import InputForm from "../form/InputForm.component";
import SelectForm from "../form/SelectForm.component";
import DatePicker from "react-datepicker";
import {useForm} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {EdaProcess, Eeg} from "../../models/eeg.model";
import {EegParticipant} from "../../models/members.model";
import CorePageTemplate from "../core/CorePage.template";
import ProcessHeaderComponent from "./ProcessHeader.component";
import ProcessContentComponent from "./ProcessContent.component";
import {Api} from "../../service";
import CheckboxComponent from "../form/Checkbox.component";
import {useLocale} from "../../store/hook/useLocale";
import {useAppDispatch} from "../../store";
import {ErrorState, setErrorState} from "../../store/eeg";

interface ProcessValues {
  communityId: string | undefined
  participantId: string | undefined
  meteringPoints: string[] | undefined
}
interface ProcessRequestValuesComponentProps {
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
  edaProcess: EdaProcess
}

const ProcessRequestValuesComponent: FC<ProcessRequestValuesComponentProps> = ({eeg, meters, participants, edaProcess}) => {
  const processValues = {
    communityId: eeg.communityId,
    participantId: undefined,
    meteringPoints: undefined,
  }

  const {t} = useLocale("common")
  const {handleSubmit, reset,
    control, watch,
    setValue, formState} = useForm<ProcessValues>({defaultValues: processValues})
  const [useableMeters, setUsableMeters] = useState<Metering[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectEntire, setSelectEntire] = useState(false)
  const [meteringPoints, participantId] = watch(['meteringPoints', 'participantId'])

  const dispatcher = useAppDispatch()
  // useEffect(() => {
  //   if (!participantId) {
  //     if (meteringPoint) {
  //       const p = participants.find(p => p.meters.find(m => m.meteringPoint === meteringPoint))
  //       if (p) {
  //         setValue('participantId', p.id)
  //       }
  //     }
  //   }
  // }, [meteringPoints])

  useEffect(() => {
    if (participantId) {
      const p = participants.find(p=> p.id === participantId)
      if (p) {
        setUsableMeters(p.meters)
      }
    }
  }, [participantId])

  const onRequest = (data: ProcessValues) => {
    if (data.meteringPoints && startDate && endDate) {

      const meter = meters.filter((m) => data.meteringPoints?.find((s:string) => s === m.meteringPoint))
      if (meter) {
        Api.eegService.syncMeteringPoint(
          eeg.rcNumber.toUpperCase(),
          meter.map(m => {return {meter: m.meteringPoint, direction: m.direction}}),
          startDate.getTime(), endDate.getTime())
          .catch(e => dispatcher(setErrorState({message: "Fehler beim Senden!"} as ErrorState)))
          .finally(() => {
            reset()
            setDateRange([null, null])
            setSelectEntire(false)
          })
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

  const meteringDisplayName = (m: Metering): string => {
    if (m.equipmentName && m.equipmentName.length > 0) {
      return `${m.equipmentName} - ${m.meteringPoint}`
    }
    return m.meteringPoint
  }

  const selectAllMeteringPoints = (s: boolean) => {
    if (s) {
      setValue("meteringPoints", meters.map(m => {
        return m.meteringPoint
      }), {shouldValidate: false, shouldDirty: true})
    } else {
      reset()
    }
    setSelectEntire(s)
  }

  return (
    <>
      <ProcessHeaderComponent name={edaProcess.name} />
      <ProcessContentComponent>
        <CorePageTemplate>
          <>
            <InputForm name="communityId" label={t("communityId")} control={control} readonly={true}/>
            <CheckboxComponent label={t("process.requestValue.selectEntire")} setChecked={(c) => selectAllMeteringPoints(c)}
                               checked={selectEntire!}/>
            <SelectForm control={control} name={"participantId"} options={participants.sort((a,b) => a.lastname.localeCompare(b.lastname)).map((p) => {
              return {key: p.id, value: p.firstname + " " + p.lastname}
            })} label={t("participant")} selectInterface={"popover"} disableEntire={selectEntire}/>
            <SelectForm control={control} name={"meteringPoints"} options={useableMeters.map((p) => {
              return {key: p.meteringPoint, value: meteringDisplayName(p)}
            })} label={t("metering")} selectInterface={"popover"} multiple={true} rules={{required: true}} disableEntire={selectEntire}/>
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
              <IonButton slot="end" onClick={handleSubmit(onRequest)} disabled={((!formState.isValid && !selectEntire) || !startDate || !endDate)}>
                Anfordern
              </IonButton>
            </IonItem>
          </>
      </CorePageTemplate>
      </ProcessContentComponent>
    </>
  )
}

export default ProcessRequestValuesComponent