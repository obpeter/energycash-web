import React, {FC} from "react";
import {useMaskito} from "@maskito/react";
import InputForm, {InputPartialFunction} from "./InputForm.component";
import {Control, FieldError} from "react-hook-form";

interface IbanInputFormProps<T extends object> {
  name: string
  control: Control<T, any>
  error?: FieldError
  onChangePartial?: InputPartialFunction
  readonly?: boolean,
}

export function IbanInputForm<T extends object>(props : IbanInputFormProps<T>) {
  const ibanMask = useMaskito({
    options: {
      mask: [
        'A', 'T',
        ...Array(2).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
      ],
    },
  });

  return (
    <InputForm label="IBAN"
               rules={{required: "IBAN fehlt", minLength: {value: 24, message: "IBAN ist ungültig"}}}
               type="text"
               mask={ibanMask}
               {...props}
    />)
}