import React, {FC} from "react";
import {useMaskito} from "@maskito/react";
import InputForm, {PartialChangeFunction} from "./InputForm.component";
import {Control, FieldError} from "react-hook-form";
import {MaskitoOptions} from "@maskito/core";

interface IbanInputFormProps<T extends object> {
  name: string
  control: Control<T, any>
  error?: FieldError
  onChangePartial?: PartialChangeFunction
  readonly?: boolean,
}

export function IbanInputForm<T extends object>(props : IbanInputFormProps<T>) {
  const digitsOnlyMask: MaskitoOptions = {
    mask:  [
      ...Array(2).fill(/[A-Z]/),
      ...Array(2).fill(/\d/),
      ' ',
      ...Array(4).fill(/[A-Z0-9]/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
      ' ',
      ...Array(4).fill(/\d/),
    ]
  }

  const ibanMask = useMaskito({
    options: digitsOnlyMask,
  });

  return (
    <InputForm label="IBAN"
               rules={{required: "IBAN fehlt", minLength: {value: 24, message: "IBAN ist ungültig"}}}
               type="text"
               mask={ibanMask}
               {...props}
    />)
}