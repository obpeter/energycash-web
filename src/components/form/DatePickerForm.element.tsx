import React, {FC, forwardRef} from "react";
import DatePicker from "react-datepicker";
import {Control, Controller, FieldError, UseFormClearErrors} from "react-hook-form";
import {InputChangeEventDetail, IonInput} from "@ionic/react";

import "./DatePickerForm.element.scss"
import {IonInputCustomEvent} from "@ionic/core/dist/types/components";

interface DatePickerFormProps {
  control: Control<any, any>,
  clear?: UseFormClearErrors<any>
  name: string,
  label: string,
  placeholder?: string,
  rules?: object,
  error?: FieldError,
  disabled?: boolean,
  onChangeDate?: (name: string, value: any, event?: any) => void
}

const DatePickerFormElement: FC<DatePickerFormProps> = ({name, control, rules, label, placeholder, error, onChangeDate}) => {

  const onDateChanged = (onChange: (...event: any[]) => void) => (value: Date) => {
    onChange(value)
    if (onChangeDate) {
      onChangeDate(name, value)
    }
  }

  const Component = forwardRef<HTMLIonInputElement, {onIonChange: (event: IonInputCustomEvent<InputChangeEventDetail>) => void}>(function CustomInput(p, ref) {
    return (
        <IonInput
          {...p}
          style={{flexDirection: "row-reverse"}}
          label={label}
          placeholder={placeholder}
          fill="outline"
          labelPlacement={"floating"}/>
    );
  });

  return (
    <div className="form-element">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field, fieldState, formState}) => {
          const {onChange, onBlur, value, name, ref} = field;
          const dateValue = typeof value === 'string' ? new Date(value) : value instanceof Date ? value : new Date(Date.now())
          return (
            <DatePicker
              // selectsRange={false}
              selected={dateValue}
              name={name}
              onChange={(update) => {
                if (update) onDateChanged(onChange)(update)
              }}
              customInput={<Component onIonChange={() => console.log("IonChange")}/>}
              dateFormat="MMMM d, yyyy"
              ref={ref}
              portalId="root-portal"
            />
          )
        }}/>
      {error && <div className={"error-line"}>{error.message}</div>}
    </div>
  )
}
export default DatePickerFormElement;