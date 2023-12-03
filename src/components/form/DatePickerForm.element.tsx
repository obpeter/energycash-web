import React, {FC, forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {Control, Controller, FieldError, Noop, UseFormClearErrors, useWatch} from "react-hook-form";
import {IonIcon, IonInput, IonItem, IonLabel} from "@ionic/react";

import "./DatePickerForm.element.scss"
import {calendar} from "ionicons/icons";
import {type} from "os";

interface DatePickerFormProps {
  control: Control<any, any>,
  clear?: UseFormClearErrors<any>
  name: string,
  label: string,
  placeholder?: string,
  rules?: object,
  error?: FieldError,
  disabled?: boolean,
}

const DatePickerFormElement: FC<DatePickerFormProps> = ({name, control, rules, label, placeholder, error}) => {

  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // const watchValue = useWatch({
  //   control,
  //   name: name,
  // });
  //
  // useEffect(() => {
  //   if (watchValue) {
  //     setCurrentDate(false ? new Date(watchValue) : watchValue instanceof Date ? watchValue : new Date(Date.now()))
  //   }
  // }, [watchValue]);

  // value: string, onIonInput1: (...event: any[]) => void
  const Component = forwardRef<HTMLIonInputElement, {onBlur: Noop}>(function CustomInput(p, ref) {
    return (
        <IonInput
          {...p}
          style={{flexDirection: "row-reverse"}}
          label={label}
          placeholder={placeholder}
          fill="outline"
          labelPlacement={"floating"}
        >
        </IonInput>

      // <IonItem
      //   fill="outline"
      //   lines="none"
      //   >
      //   <IonLabel inputMode="text" placeholder={placeholder}>{p.value}</IonLabel>
      //   {/*<IonInput {...p} ref={ref}></IonInput>*/}
      //   {/*<IonIcon icon={calendar} slot="end"/>*/}
      //   <input ref={ref}/>
      // </IonItem>
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
          console.log("Current DATE: ", dateValue, name)
          return (
            <DatePicker
              // selectsRange={false}
              selected={dateValue}
              name={name}
              onChange={(update) => {
                onChange(update)
                // if (update) {
                //   onChange(update);
                //   setCurrentDate(update)
                // }
              }}
              customInput={<Component onBlur={() => console.log("BLUR")}/>}
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