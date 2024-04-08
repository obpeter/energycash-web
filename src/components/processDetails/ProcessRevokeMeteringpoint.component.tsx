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
import {BasicSelectComponent} from "../form/BasicSelect.component";
import {Api} from "../../service";
import {meteringDisplayName} from "../../util/FilterHelper";
import {useLocale} from "../../store/hook/useLocale";
import {JoinStrings} from "../../util/Helper.util";

interface ProcessValues {
  communityId: string | undefined
  participantId: string | undefined
  meteringPoints: string[] | undefined
  reason: string | undefined
}
interface ProcessRevokeMeteringpointComponentProps {
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
  edaProcess: EdaProcess
}

const ProcessRevokeMeteringpointComponent: FC<ProcessRevokeMeteringpointComponentProps> = ({eeg, meters, participants, edaProcess}) => {
  const processValues = {
    communityId: eeg.communityId,
    participantId: undefined,
    meteringPoints: undefined,
    reason: undefined,
  }

  const {t} = useLocale("common")
  const {handleSubmit, reset,
    control, watch,
    setValue, formState} = useForm<ProcessValues>({defaultValues: processValues})
  const [useableMeters, setUsableMeters] = useState<Metering[]>([])
  const [consentEndDate, setConsentEndDate] = useState<Date|null>(null);
  const [reason, setReason] = useState<string|undefined>()
  const [meteringPoints, participantId] = watch(['meteringPoints', 'participantId'])

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
    } else {
      setUsableMeters([])
    }
  }, [participantId])

  const onRequest = (data: ProcessValues) => {
    if (data.participantId && data.meteringPoints && consentEndDate) {

      const meter = meters.filter((m) => data.meteringPoints?.find((s:string) => s === m.meteringPoint))
      if (meter) {
        Api.eegService.revokeMeteringPoint(
          eeg.id.toUpperCase(), data.participantId,
          meter.map(m => {return {meter: m.meteringPoint, direction: m.direction}}),
          consentEndDate.getTime(), reason)
          .finally(() => {
            reset()
            setConsentEndDate(null)
          })
      }
    }
  }

  const Component = forwardRef<HTMLIonInputElement, {}>(function CustomInput(p, ref) {
    return (
      <IonInput
        {...p}
        label={t("calendar_label")}
        placeholder="Enter text"
        fill="outline"
        labelPlacement={"floating"}
        ref={ref}
      >
      </IonInput>
    );
  });

  return (
    <>
      <ProcessHeaderComponent name={edaProcess.name} />
      <ProcessContentComponent>
        <CorePageTemplate>
          <>
            <InputForm name="communityId" label={t("communityId")} control={control} protectedControl={true}/>
            <BasicSelectComponent control={control} name={"participantId"}
                                  options={participants.sort((a,b) => a.lastname.localeCompare(b.lastname)).map((p) => {
              return {value: p.id, label: JoinStrings(" ", " - ", p.participantNumber, p.lastname, p.firstname)}
            })} label={t("participant")} rules={{required: true}}/>
            <SelectForm control={control} name={"meteringPoints"} options={useableMeters.map((p) => {
              return {key: p.meteringPoint, value: meteringDisplayName(p)}
            })} label={t("metering")} selectInterface={"popover"} multiple={true} rules={{required: true}}/>
            <InputForm name="reason" label={t("process.revokeMeter.reason")} control={control}/>
            <div className="form-element">
              <DatePicker
                selectsRange={false}
                selected={consentEndDate}
                onChange={(update) => {
                  setConsentEndDate(update);
                }}
                customInput={<Component/>}
              />
            </div>
            <IonItem lines="none" style={{zIndex: "0"}}>
              <IonButton slot="end" onClick={handleSubmit(onRequest)} disabled={(!formState.isValid || !consentEndDate)}>
                {t("process.submit")}
              </IonButton>
            </IonItem>
          </>
      </CorePageTemplate>
      </ProcessContentComponent>
    </>
  )
}

export default ProcessRevokeMeteringpointComponent