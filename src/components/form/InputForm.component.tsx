import React from "react";
import {IonInput, IonItem, IonLabel} from "@ionic/react";
import {Control, Controller, FieldError, FieldErrors} from "react-hook-form";
import "./form-element.css";

// export interface InputForm {
//   label: string
//   <TValue>(control): Control<TValue, any>
// }


const InputForm: (React.FC<{ label: string, control: Control<any, any>, name: string, rules?: object, type: "text" | "number" | "password", disabled?: boolean, readonly?: boolean,
  inputMode?: "text" | "search" | "numeric" | "none" | "tel" | "url" | "email" | "decimal" | undefined, error?:  FieldError}>) =
  ({ label, control, name,rules, type, disabled,...rest}) => {
  return (
    <div className={"form-element"}>
      <IonItem fill="outline" disabled={disabled} style={{"--min-height": "12px"}}>
        {label && (
          <IonLabel position="floating">{label}</IonLabel>
        )}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field}) => {
            const { onChange, value } = field;
            return (<IonInput onIonChange={(e) => onChange((type === 'number' ? Number(e.detail.value!) : e.detail.value!))}
                              placeholder="Enter text"
                              type={type} {...rest} {...field}></IonInput>)
          } }
        />
      </IonItem>
      {rest.error && <span className={"error-line"}>{rest.error.message}</span>}
    </div>
  );
};
export default InputForm;
