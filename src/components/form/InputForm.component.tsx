import React from "react";
import {IonInput, IonItem, IonLabel} from "@ionic/react";
import {Control, Controller, FieldError, FieldErrors, UseFormClearErrors} from "react-hook-form";
import "./form-element.css";
import {TextFieldTypes} from "@ionic/core";

// export interface InputForm {
//   label: string
//   <TValue>(control): Control<TValue, any>
// }


interface InputFormProps {
  control: Control<any, any>,
  clear?: UseFormClearErrors<any>
  name: string,
  label: string,
  placeholder?: string,
  rules?: object,
  error?:  FieldError,
  type?: TextFieldTypes,
  disabled?: boolean,
  readonly?: boolean,
  inputmode?: "text" | "search" | "numeric" | "none" | "tel" | "url" | "email" | "decimal" | undefined,
  counter?: boolean,
  maxlength?: number
}

const InputForm: (React.FC<InputFormProps>) =
  ({ control, clear, name,rules, error, placeholder,...rest}) => {
  return (
    <div className={"form-element"}>
      {/*<IonItem disabled={disabled} style={{"--min-height": "12px"}}>*/}
        {/*{label && (*/}
        {/*  <IonLabel position="floating">{label}</IonLabel>*/}
        {/*)}*/}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field, fieldState, formState}) => {
            const { onChange, value, name,ref } = field;
            return (<IonInput
                              onIonChange={(e) => {
                                if (fieldState.invalid) {
                                  if (clear) clear(name)
                                }
                                onChange((rest.type === 'number' ? Number(e.detail.value!) : e.detail.value!))
                              }}
                              // onIonBlur={(e) => {
                              //   console.log("Input OnBlure");
                              //   onChange((rest.type === 'number' ? Number(e.target.value) : e.target.value!))
                              // }}
                              placeholder={placeholder ? placeholder : "Enter Text"}
                              fill="outline"
                              labelPlacement={"floating"}
                              value={value}
                              name={name}
                              ref={ref}
                              // errorText={rest.error?.message}
                              {...rest}></IonInput>)
          }}
        />
      {/*</IonItem>*/}
      {error && <div className={"error-line"}>{error.message}</div>}
    </div>
  );
};
export default InputForm;
