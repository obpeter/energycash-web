import React from "react";
import {Control, Controller, FieldValues} from "react-hook-form";
import {IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail, SelectCustomEvent} from "@ionic/react";

interface SelectFormNativeProps {
  label?: string
  onChange: (e: SelectCustomEvent<SelectChangeEventDetail<string>>) => void
  placeholder: string
  name: string
  options: { key: any, value: string }[]
  disabled?: boolean
}


const SelectFormNative: React.FC<SelectFormNativeProps> = (
  { label, onChange, placeholder, name, options, ...rest}) => {
  return (
    <div className="form-element">
      <IonItem fill="outline">
        {/*{label && (*/}
        {/*  <IonLabel position="floating">{label}</IonLabel>*/}
        {/*)}*/}
        <IonSelect interface="action-sheet" placeholder={placeholder} onIonChange={onChange} label={label} {...rest}>
          {options.map(({key, value}) => (<IonSelectOption key={key} value={key}>{value}</IonSelectOption>))}
        </IonSelect>
      </IonItem>
    </div>
  );
};
export default SelectFormNative;
