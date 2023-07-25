import React, {FC, useEffect, useState} from "react";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import SelectForm from "../form/SelectForm.component";
import InputForm from "../form/InputForm.component";
import CheckboxComponent from "../form/Checkbox.component";
import {Metering} from "../../models/meteringpoint.model";
import {Address, EegTariff} from "../../models/eeg.model";
import {Control, FieldErrors, UseFormSetValue, UseFormWatch} from "react-hook-form";
import ToggleButtonComponent from "../ToggleButton.component";
import {eegPlug, eegSolar} from "../../eegIcons";
import {EegParticipant} from "../../models/members.model";

interface MeterFormElementProps {
  control: Control<Metering, any>
  watch: UseFormWatch<Metering>
  rates: EegTariff[]
  setValue?: UseFormSetValue<Metering>
  participant?: EegParticipant
  errors?: FieldErrors<Metering>
  meterReadOnly?: boolean
}

const MeterFormElement: FC<MeterFormElementProps> = ({control, rates, setValue, participant, errors, meterReadOnly, watch}) => {

  const [selectedDirection, setSelectedDirection] = useState(0);
  const [withWechselrichter, setWithWechselrichter] = useState(false);

  const direction = watch('direction')

  useEffect(() => {
    // setSelectedDirection(0)
    setWithWechselrichter(false)
  }, [participant])

  useEffect(() => {
    setSelectedDirection(direction === "GENERATION" ? 1 : 0)
  }, [direction])

  const getRatesOption = () => {
    const expectedRateType = selectedDirection === 0 ? 'VZP' : 'EZP'
    return rates.filter(r => r.type === expectedRateType).map((r) => {
      return {key: r.id, value: r.name}
    })
  }

  const isEditable = setValue !== undefined

  const onChangeDirection = (s: number) => {
    if (isEditable) {
      // setSelectedDirection(s)
      setValue(`direction`, s === 0 ? "CONSUMPTION" : "GENERATION");
    }
  }

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Verbraucher', icon: eegPlug}, {label: 'Erzeuger', icon: eegSolar}]}
              onChange={onChangeDirection}
              value={selectedDirection}
              changeable={isEditable}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonList>
        <SelectForm name={"tariffId"} label="Tarif" control={control} options={getRatesOption()}/>
        <InputForm name={"meteringPoint"} label="Zählpunkt" control={control} type="text" readonly={meterReadOnly}
                   counter={true} maxlength={33}
                   rules={{required: "Zählpunktnummer fehlt",
                     minLength: {value: 33, message: "MIN-Zählpunktnummer beginnt mit AT gefolgt von 31 Nummern" },
                     maxLength: {value: 33, message: "MAX-Zählpunktnummer beginnt mit AT gefolgt von 31 Nummern" },
                     pattern: {value: /^AT[0-9A-Z]*$/, message: "Zählpunktnummer beginnt mit AT gefolgt von 31 Nummern od. Großbuchstaben"}}}
                   error={errors?.meteringPoint}
        />
        <CheckboxComponent label="Wechselrichter anlegen" setChecked={setWithWechselrichter}
                           checked={withWechselrichter} style={{paddingTop: "0px"}}></CheckboxComponent>
        {withWechselrichter && (
          <InputForm name={"inverterId"} label="Wechselrichternummer" control={control} rules={{required: false}}
                     type="text"/>
        )}
        <InputForm name={"transformer"} label="Transformator" control={control} rules={{required: false}} type="text"/>
        <InputForm name={"equipmentNumber"} label="Anlagen-Nr." control={control} rules={{required: false}} type="text"/>
        <InputForm name={"equipmentName"} label="Anlagename" control={control} rules={{required: false}} type="text"/>
      </IonList>
    </>
  )
}

export default MeterFormElement;