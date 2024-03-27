import React, {useEffect} from "react";
import {Control, Controller, FieldError} from "react-hook-form";
import {IonSelect, IonSelectOption, SelectChangeEventDetail} from "@ionic/react";

import "./form-element.css"
import {SelectInterface} from "@ionic/core/dist/types/components/select/select-interface";
import {IonSelectCustomEvent} from "@ionic/core/dist/types/components";
import Select from "react-select/base";
import { InputActionMeta } from "react-select";

interface SelectFormProps {
  control: Control<any, any>,
  name: string,
  options: { key: any, value: string }[],
  rules?: object,
  error?: FieldError,
  selectInterface?: SelectInterface,
  disabled?: boolean,
  label: string,
  placeholder?: string,
  readonly?: boolean,
  onIonBlur?: (event: IonSelectCustomEvent<void>) => void,
  onIonDismiss?: (event: IonSelectCustomEvent<void>) => void,
  onIonChange?: (event: IonSelectCustomEvent<SelectChangeEventDetail>) => void,
  multiple?: boolean,
  onChangePartial?: (name: string, value: any, event?: any) => void,
  interfaceOptions?: any,
  disableEntire?: boolean,
}

interface SelectOptions {
  label: string,
  value: string
}

const SelectForm: React.FC<SelectFormProps> = (
  {
    control, name, options, rules,
    error, selectInterface, disabled,
    onChangePartial, disableEntire,  ...rest
  }) => {

  const onSelectionChanged = (onChange: (...event: any[]) => void) => (event: IonSelectCustomEvent<SelectChangeEventDetail>) => {
    onChange(event)
    if (onChangePartial) {
      onChangePartial(name, event.detail.value, event)
    }
  }

  const onSelection = (onChange: (...event: any[]) => void) => (event: any) => {
    // console.log(event)
  }

  const findOption = (v: any) => {
    const o = options.find((c) => c.value === v)
    return o ? {label: o.key, value: o.value} : null
  }

  return (
    <div className="form-element">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field}) => {
          const {onChange, value, ref} = field;
          return (<IonSelect
            fill="outline"
            labelPlacement={"floating"}
            value={value}
            interface={selectInterface}
            onSelect={onSelection(onChange)}
            onIonChange={onSelectionChanged(onChange)}
            disabled={disableEntire}
            {...rest}>
            {options.map((o, i) => (<IonSelectOption key={o.key} value={o.key} disabled={disabled}>{o.value}</IonSelectOption>))}
          </IonSelect>)
          // return (
          //   <Select
          //     onChange={onChange}
          //     options={options.map(o => {
          //       return {label: o.key, value: o.value};
          //     })}
          //     value={findOption(value)} ref={ref}/>
          //   )
          }}
        />
      {/*</IonItem>*/}
      {error && <span className={"error-line"}>{error.message}</span>}
    </div>
  );
};
export default SelectForm;
