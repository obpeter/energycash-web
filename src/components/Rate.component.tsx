import React, {FC} from "react";
import {IonCard, IonCardContent, IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import InputFormComponent from "./form/InputForm.component";
import {FieldValues, useForm} from "react-hook-form";
import {EegTariff} from "../models/eeg.model";
import CheckboxComponent from "./form/Checkbox.component";
import ToggleButtonComponent from "./ToggleButton.component";

const RateComponent: FC<{ rate: EegTariff, onSubmit: (data: FieldValues) => void, submitId: string, mode: string }> =
  ({rate, onSubmit, submitId, mode}) => {

    // const [state, setState] = useState<EegTariff>(rate)
    const {
      handleSubmit,
      control,
      setValue
    } = useForm({defaultValues: rate, values: rate});

    const setShowVat = (s: boolean) => {
      // setState((oldState) => {
      //   return {...oldState, useVat: s}
      // })
      setValue("useVat", s)
    }

    const handleRateType = (type: number) => {
      switch (type) {
        case 0:
          setValue("type", "EEG");
          break;
        case 1:
          setValue("type", "EZP");
          break;
        case 2:
          setValue("type", "VZP");
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
      switch (rate.type) {
        case "EEG":
          return (
            <div>
              <InputFormComponent label="Vorauszahlung" control={control} name={"participantFee"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
              <InputFormComponent label="Rabatt" control={control} name={"discount"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
            </div>
          )
        case "EZP":
          return (
            <div>
              <InputFormComponent label="Pauschalbetrag" control={control} name={"baseFee"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
              <InputFormComponent label="Cent pro kWh" control={control} name={"centPerKWh"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
            </div>
          )
        case "VZP":
          return (
            <div>
              <InputFormComponent label="Cent pro kWh" control={control} name={"centPerKWh"}
                                  rules={{pattern: /[0-9\.]/}} type="text" inputMode={"numeric"}/>
              <InputFormComponent label="Inklusive kWh" control={control} name={"freeKWH"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
              <InputFormComponent label="Rabatt" control={control} name={"discount"}
                                  rules={{pattern: /[0-9\.]/}} type="text"/>
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
                initalType={transformType(rate.type)}
                changeable={editable}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <form id={submitId} onSubmit={handleSubmit(onSubmit)}>
          <IonCardContent color="eeglight">
            <IonList color="eeglight">
              <InputFormComponent label="Tarifbezeichnung" control={control} name="name"
                                  rules={{pattern: /[A-Za-z0-9\-\.]/}} type="text"/>
              <CheckboxComponent label="Umsatzsteuer anführen" setChecked={(c) => setShowVat(c)}
                                 checked={rate.useVat!}/>
              {rate.useVat &&
                  <InputFormComponent label="Umsatzsteuer in %" control={control} name="vatInPercent" rules={{}}
                                      type="number"/>}
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