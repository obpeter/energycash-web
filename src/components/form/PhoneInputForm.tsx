import {Control, FieldError, FieldValues, UseFormSetValue} from "react-hook-form";
import InputForm, {InputPartialFunction} from "./InputForm.component";
import {useMaskito} from "@maskito/react";
import React, {ClipboardEvent} from "react";


interface PhoneInputFormProps<T extends object> {
  name:string
  control: Control<T, any>
  setValue: UseFormSetValue<any>,
  error?: FieldError
  onChangePartial?: InputPartialFunction
  readonly?: boolean,
}

export function PhoneInputForm<T extends object>({setValue, ...props} : PhoneInputFormProps<T>) {
  const phoneMask = useMaskito({
    options: {
      mask: /^\d{0,4}\s\d*$/,
    },
  });

  const handlePhonePaste = (e: ClipboardEvent<HTMLIonInputElement>) => {
    e.persist()
    e.clipboardData.items[0].getAsString(text=>{
      setValue(props.name, text.replace(/\+/gi, "00").replace(/\s/gi,""))
    })
    e.stopPropagation()
  }

  return (
    <InputForm label="Telefon"
               rules={{required: "IBAN fehlt", minLength: {value: 24, message: "IBAN ist ungültig"}}}
               type="text"
               mask={phoneMask}
               onPaste={handlePhonePaste}
               {...props}
    />)
}