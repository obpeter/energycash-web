import React from "react";
import {IonInput, IonItem, IonLabel} from "@ionic/react";
import {Control, Controller, FieldError, FieldErrors} from "react-hook-form";
import "./form-element.css";
import {TextFieldTypes} from "@ionic/core";

// export interface InputForm {
//   label: string
//   <TValue>(control): Control<TValue, any>
// }


interface InputFormProps {
  control: Control<any, any>,
  name: string,
  label: string,
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
  ({ control, name,rules, error,...rest}) => {
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
          render={({field, fieldState}) => {
            const { onChange, value, name,ref } = field;
            return (<IonInput
                              onIonChange={(e) => onChange((rest.type === 'number' ? Number(e.detail.value!) : e.detail.value!))}
                              onIonBlur={(e) => onChange((rest.type === 'number' ? Number(e.target.value) : e.target.value!))}
                              placeholder="Enter text"
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
