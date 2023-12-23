import React, {ClipboardEvent} from "react";
import {InputChangeEventDetail, IonInput} from "@ionic/react";
import {Control, Controller, FieldError} from "react-hook-form";
import {TextFieldTypes} from "@ionic/core";

import "./form-element.css";
import {IonInputCustomEvent} from "@ionic/core/dist/types/components";
import {InputInputEventDetail} from "@ionic/core/dist/types/components/input/input-interface";
import {ControllerFieldState} from "react-hook-form/dist/types/controller";

type partialFunction = (name: string, value: any, event?: any) => void

interface InputFormProps {
  control: Control<any, any>,
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
  maxlength?: number,
  onPaste?: (e: ClipboardEvent<HTMLIonInputElement>) => void,
  onTransform?: (e: IonInputCustomEvent<InputInputEventDetail>) => string | number,
  onChangePartial?: partialFunction
}

const InputForm: (React.FC<InputFormProps>) =
  ({ control, name,rules, error, placeholder, onTransform, onChangePartial,...rest}) => {

  const handleOnChange = (onChange: partialFunction | undefined, fieldState: ControllerFieldState) => (e:IonInputCustomEvent<InputChangeEventDetail>) => {
    if (onChange === undefined) return undefined
    if (!fieldState.invalid && fieldState.isDirty) onChange(name, e.target.value, e)
  }

  return (
    <div className={"form-element"}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field, fieldState, formState}) => {
            const { onChange, value, name, ref,onBlur } = field;
            return (<IonInput
                              onIonChange={handleOnChange(onChangePartial, fieldState)}
                              onIonInput={(e) => {
                                let value: string | number = e.detail.value || ""
                                if (onTransform) {
                                  value = onTransform(e)
                                }
                                onChange((rest.type === 'number' ? Number(value) : value))
                              }}
                              placeholder={placeholder ? placeholder : "Enter Text"}
                              fill="outline"
                              labelPlacement={"floating"}
                              value={value}
                              name={name}
                              // onChange={onChange}
                              ref={ref}
                              // errorText={rest.error?.message}
                              {...rest}></IonInput>)
          }}
        />
      {error && <div className={"error-line"}>{error.message}</div>}
    </div>
  );
};
export default InputForm;
