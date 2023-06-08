import React from "react";
import {Control, Controller, FieldError, FieldValues} from "react-hook-form";
import {IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail} from "@ionic/react";

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
  onIonChange?: (event: IonSelectCustomEvent<SelectChangeEventDetail>) => void
}

const SelectForm: React.FC<SelectFormProps> = (
  { control, name, options, rules,
    error, selectInterface, disabled,
    ...rest}) => {
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
            const {onChange} = field;
            return (<IonSelect
              fill="outline"
              labelPlacement={"floating"}
              // label={label}
              // disabled={disabled}
              interface={selectInterface}
              // placeholder={placeholder}
              onIonChange={onChange} {...field} {...rest}>
              {options.map(({key, value}, i) => (<IonSelectOption key={i} value={key} disabled={disabled}>{value}</IonSelectOption>))}
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
