import React from "react";
import {Control, Controller, FieldValues} from "react-hook-form";
import {IonItem, IonLabel, IonSelect, IonSelectOption} from "@ionic/react";

const SelectForm: React.FC<{ label: string, placeholder: string, control: Control<any, any>, name: string, options: { key: any, value: string }[], readonly?: boolean, disabled?: boolean }> = (
  { label, placeholder, control, name, options, readonly,disabled, ...rest}) => {
  return (
    <div className="form-element">
      <IonItem fill="outline" disabled={disabled}>
        {label && (
          <IonLabel position="floating">{label}</IonLabel>
        )}
        <Controller
          name={name}
          control={control}
          render={({field}) => {
            const {onChange} = field;
            return (<IonSelect interface="action-sheet" placeholder={placeholder} onIonChange={onChange} {...field} {...rest}>
              {options.map(({key, value}) => (<IonSelectOption key={key} value={key}>{value}</IonSelectOption>))}
            </IonSelect>)
          }
        }
        />
      </IonItem>
    </div>
  );
};
export default SelectForm;
