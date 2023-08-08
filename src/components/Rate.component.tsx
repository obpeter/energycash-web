import React, {FC} from "react";
import {IonCard, IonCardContent, IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import InputFormComponent from "./form/InputForm.component";
import {FieldValues, useForm} from "react-hook-form";
import {EegTariff} from "../models/eeg.model";
import CheckboxComponent from "./form/Checkbox.component";
import ToggleButtonComponent from "./ToggleButton.component";
import {useRateType} from "../store/hook/Rate.provider";
import Input from "./form/Input.component";

const RateComponent: FC<{ rate: EegTariff, onSubmit: (data: EegTariff) => void, submitId: string, mode?: 'NEW' }> =
  ({rate, onSubmit, submitId, mode}) => {

    const {currentRateType, setRateType} = useRateType()

    // const [state, setState] = useState<EegTariff>(rate)
    const {
      // register,
      handleSubmit,
      control,
      setValue,
      watch,
      reset,
      formState: {errors}
    } = useForm({defaultValues: rate, values: rate, mode: 'all'});

    const setShowVat = (s: boolean) => {
      // setState((oldState) => {
      //   return {...oldState, useVat: s}
      // })

      if (!s) {
        setValue("vatInPercent", "0")
      }
      setValue("useVat", s)
    }

    const useVat = watch("useVat");

    const handleRateType = (type: number) => {
      switch (type) {
        case 0:
          reset()
          setValue("type", "EEG");
          setRateType('EEG')
          break;
        case 1:
          reset()
          setValue("type", "EZP");
          setRateType('EZP')
          break;
        case 2:
          reset()
          setValue("type", "VZP");
          setRateType('VZP')
          break;
      }
    }

    const transformType = (type: string): number => {
      switch (type) {
        case 'EEG':
          return 0;
        case 'EZP':
          return 1;
        case 'VZP':
          return 2;
      }
      return 0
    }

    const editable = mode === 'NEW';

    const RateFormType = (rate: EegTariff) => {
      switch (currentRateType) {
        case "EEG":
          return (
            <div>
              <InputFormComponent label="Vorauszahlung in €" control={control} name={"participantFee"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.participantFee}/>
              <InputFormComponent label="Rabatt in %" control={control} name={"discount"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.discount}/>
              {/*<Input label={"Vorauszahlung"} labelPlacement={"floating"} {...register('participantFee',*/}
              {/*  {pattern: {value: /[0-9\.]/, message: "Nur Zahlen erlaubt"}})} />*/}
              {/*<Input label={"Rabatt"} labelPlacement={"floating"} {...register('discount')} />*/}
            </div>
          )
        case "EZP":
          return (
            <div>
              <InputFormComponent label="Pauschalbetrag in €" control={control} name={"baseFee"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.baseFee}/>
              <InputFormComponent label="Cent pro kWh" control={control} name={"centPerKWh"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.centPerKWh}/>
              {/*<Input label={"Pauschalbetrag"} labelPlacement={"floating"} {...register('baseFee',*/}
              {/*  {pattern: {value: /[0-9\.]/, message: "Nur Zahlen erlaubt"}})} />*/}
              {/*<Input label={"Cent pro kWh"} labelPlacement={"floating"} {...register('centPerKWh')} />*/}
            </div>
          )
        case "VZP":
          return (
            <div>
              <InputFormComponent label="Cent pro kWh" control={control} name={"centPerKWh"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" inputmode={"numeric"} error={errors.centPerKWh}/>
              <InputFormComponent label="Inklusive kWh" control={control} name={"freeKWH"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.freeKWH}/>
              <InputFormComponent label="Rabatt in %" control={control} name={"discount"}
                                  rules={{pattern: {value: /^[0-9]*$/, message: "Nur Zahlen erlaubt"}}} type="text" error={errors.discount}/>
              {/*<Input label={"Cent pro kWh"} labelPlacement={"floating"} {...register('centPerKWh',*/}
              {/*  {pattern: {value: /[0-9\.]/, message: "Nur Zahlen erlaubt"}})} />*/}
              {/*<Input label={"Inklusive kWh"} labelPlacement={"floating"} {...register('freeKWH')} />*/}
              {/*<Input label={"Rabatt"} labelPlacement={"floating"} {...register('discount')} />*/}
            </div>
          )
      }
    }

    return (
      <IonCard color={"eeglight"}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <ToggleButtonComponent
                buttons={[{label: 'Mitglied'}, {label: 'Erzeuger'}, {label: 'Verbraucher'}]}
                onChange={handleRateType}
                value={transformType(currentRateType)}
                changeable={editable}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <form id={submitId} onSubmit={handleSubmit(onSubmit)}>
          <IonCardContent color="eeglight">
            <IonList color="eeglight">
              <InputFormComponent label="Tarifbezeichnung" control={control} name="name"
                                  rules={{pattern: {value: /^[A-Za-z0-9\s-_]*$/, message: "Bitte nur Buchstaben, Ziffern und '-_ ' eingeben"}}} type="text" error={errors.name}/>
              {/*<Input label={"Tarifbezeichnung"} labelPlacement={"floating"} {...register('name')} />*/}
              <CheckboxComponent label="Umsatzsteuer anführen" setChecked={(c) => setShowVat(c)}
                                 checked={useVat!}/>
              {useVat &&
                  <InputFormComponent label="Umsatzsteuer in %" control={control} name="vatInPercent"/>}
              {/*<Input label={"Umsatzsteuer in %"} labelPlacement={"floating"} {...register('vatInPercent')} />}*/}
            </IonList>
            <IonList color="eeglight">
              <IonListHeader>Bestandteile</IonListHeader>
              {RateFormType(rate)}
            </IonList>
          </IonCardContent>
        </form>
      </IonCard>
    )
  }

export default RateComponent;