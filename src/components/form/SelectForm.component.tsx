import React from "react";
import {Control, Controller, FieldError, FieldValues} from "react-hook-form";
import {IonItem, IonLabel, IonSelect, IonSelectOption} from "@ionic/react";

import "./form-element.css"

const SelectForm: React.FC<{ label: string, placeholder: string, control: Control<any, any>, name: string, options: { key: any, value: string }[], rules?: object, readonly?: boolean, disabled?: boolean, error?:  FieldError }> = (
  { label, placeholder, control, name, options, rules, readonly,disabled, ...rest}) => {
  return (
    <div className="form-element">
      <IonItem fill="outline" disabled={disabled}>
        {label && (
          <IonLabel position="floating">{label}</IonLabel>
        )}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field}) => {
            const {onChange} = field;
            return (<IonSelect interface="action-sheet" placeholder={placeholder} onIonChange={onChange} {...field} {...rest}>
              {options.map(({key, value}) => (<IonSelectOption key={key} value={key}>{value}</IonSelectOption>))}
            </IonSelect>)
          }
        }
        />
      </IonItem>
      {rest.error && <span className={"error-line"}>{rest.error.message}</span>}
    </div>
  );
};
export default SelectForm;
