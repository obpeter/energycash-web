import React, {FC, useEffect, useState} from 'react';

import Select, {ControlProps, components, Options, InputProps, ContainerProps} from 'react-select';
import {Control, Controller, FieldError, useWatch} from "react-hook-form";
import {SelectInterface} from "@ionic/core/dist/types/components/select/select-interface";
import {IonSelectCustomEvent} from "@ionic/core/dist/types/components";
import {IonContent, IonInput, IonItem, IonLabel, SelectChangeEventDetail} from "@ionic/react";

import "./BasicSelect.component.scss"

// interface ColourOption {
//   readonly value: string;
//   readonly label: string;
//   readonly color: string;
//   readonly isFixed?: boolean;
//   readonly isDisabled?: boolean;
// }
//
// export const colourOptions: readonly ColourOption[] = [
//   {value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true},
//   {value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true},
//   {value: 'purple', label: 'Purple', color: '#5243AA'},
//   {value: 'red', label: 'Red', color: '#FF5630', isFixed: true},
//   {value: 'orange', label: 'Orange', color: '#FF8B00'},
//   {value: 'yellow', label: 'Yellow', color: '#FFC400'},
//   {value: 'green', label: 'Green', color: '#36B37E'},
//   {value: 'forest', label: 'Forest', color: '#00875A'},
//   {value: 'slate', label: 'Slate', color: '#253858'},
//   {value: 'silver', label: 'Silver', color: '#666666'},
// ];


interface SelectOptions {
  label: string,
  value: string,
}

interface BasicSelectFormProps {
  control: Control<any, any>,
  name: string,
  options: SelectOptions[],
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
}

export const BasicSelectComponent: FC<BasicSelectFormProps> = ({control, name, label, options, error, rules}) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedValue, setSelectedValue] = useState<SelectOptions|null|undefined>(null)

  // const Control = ({children, ...props}: ContainerProps<SelectOptions, false>) => {
  //   console.log("Control Props: ", props, props.getValue())
  //
  //   const selectValue = (value: Options<SelectOptions>) => {
  //     if (value.length == 1) {
  //       return value[0].label
  //     }
  //     return ""
  //   }
  //
  //   return (
  //     <components.SelectContainer {...props} >
  //       <IonInput
  //         value={selectValue(props.getValue())}
  //         label={label}
  //         placeholder="Enter text"
  //         fill="outline"
  //         labelPlacement={"floating"}
  //       >
  //         {children}
  //       </IonInput>
  //     </components.SelectContainer>
  //
  //   );
  // };

  const controlValue = useWatch({control, name: name, defaultValue: undefined})

  useEffect(() => {
    console.log("SV:", controlValue)
    setSelectedValue(controlValue ? options.find((c) => c.value === controlValue) : null)
  }, [controlValue]);

  return (
    <>
      <div className="form-element">
        <div style={{paddingBottom: "5px", color: "gray", fontSize: "12px"}}>
          <IonLabel position={"floating"}>{label}</IonLabel>
        </div>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field}) => {
            const {onChange} = field;
            return (
              <>
                <Select
                  styles={{
                    // Fixes the overlapping problem of the component
                    menu: provided => ({...provided, zIndex: 9999}),
                    control: provided => ({...provided, minHeight: "42px", background: "transparent"})
                  }}
                  isClearable={isClearable}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary25: '#79DFB4',
                      primary: '#2B6860',
                    },
                  })}
                  // components={{ Control }}
                  isSearchable={isSearchable}
                  name={name}
                  options={options}
                  onChange={(e) => {
                    onChange(e?.value)
                  }}
                  value={selectedValue}
                />
              </>
            )
          }}
        />
        {/*</IonItem>*/}
        {error && <span className={"error-line"}>{error.message}</span>}
      </div>
    </>
  );
};