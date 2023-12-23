import React from "react";
import {Control, Controller, FieldError} from "react-hook-form";
import {IonSelect, IonSelectOption, SelectChangeEventDetail} from "@ionic/react";

import "./form-element.css"
import {SelectInterface} from "@ionic/core/dist/types/components/select/select-interface";
import {IonSelectCustomEvent} from "@ionic/core/dist/types/components";

interface SelectFormProps {
  control: Control<any, any>,
  name: string,
  options: { key: any, value: string }[],
  rules?: object,
  error?:  FieldError,
  selectInterface?: SelectInterface,
  disabled?: boolean,
  label: string,
  placeholder?: string,
  readonly?: boolean,
  onIonBlur?: (event: IonSelectCustomEvent<void>) => void,
  onIonDismiss?: (event: IonSelectCustomEvent<void>) => void,
  onIonChange?: (event: IonSelectCustomEvent<SelectChangeEventDetail>) => void,
  multiple?: boolean,
  onChangePartial?: (name: string, value: any, event?: any) => void
}

const SelectForm: React.FC<SelectFormProps> = (
  { control, name, options, rules,
    error, selectInterface, disabled,
    onChangePartial, ...rest}) => {

  const onSelectionChanged = (onChange: (...event: any[]) => void) => (event: IonSelectCustomEvent<SelectChangeEventDetail>) => {
    onChange(event)
    if (onChangePartial) {
      onChangePartial(name, event.detail.value, event)
    }
  }

  return (
    <div className="form-element">
      {/*<IonItem fill="outline" disabled={disabled}>*/}
        {/*{label && (*/}
        {/*  <IonLabel position="floating">{label}</IonLabel>*/}
        {/*)}*/}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field}) => {
            const {onChange, value} = field;
            return (<IonSelect
              fill="outline"
              labelPlacement={"floating"}
              value={value}
              interface={selectInterface}
              onIonChange={onSelectionChanged(onChange)}
              {...rest}>
              {options.map((o, i) => (<IonSelectOption key={o.key} value={o.key} disabled={disabled}>{o.value}</IonSelectOption>))}
            </IonSelect>)
          }
        }
        />
      {/*</IonItem>*/}
      {error && <span className={"error-line"}>{error.message}</span>}
    </div>
  );
};
export default SelectForm;
