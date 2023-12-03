import React, {FC, forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {Control, Controller, FieldError, Noop, UseFormClearErrors, useWatch} from "react-hook-form";
import {IonIcon, IonInput, IonItem, IonLabel} from "@ionic/react";

import "./DatePickerCore.element.scss"
import {calendar} from "ionicons/icons";
import {type} from "os";

interface DatePickerCoreProps {
  initialValue: Date
  onChange: (name: string, value: any) => void
  name: string,
  label: string,
  placeholder?: string,
  rules?: object,
  disabled?: boolean,

}

const DatePickerCoreElement: FC<DatePickerCoreProps> = ({name, initialValue, onChange, rules, label, placeholder}) => {

  const [currentDate, setCurrentDate] = useState<Date>(initialValue ? new Date(initialValue) : new Date())

  useEffect(() => {
    setCurrentDate(initialValue ? new Date(initialValue) : new Date())
  }, [initialValue]);

  const onUpdate = (value: Date | null) => {
    if (value) {
      setCurrentDate(value)
      onChange(name, value)
    }
  }

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
          ref={ref}
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
      <DatePicker
        // selectsRange={false}
        selected={currentDate}
        name={name}
        onChange={(update) => {
          onUpdate(update)
        }}
        customInput={<Component onBlur={() => console.log("BLUR")}/>}
        dateFormat="MMMM d, yyyy"
        portalId="root-portal"
      />
      {/*{error && <div className={"error-line"}>{error.message}</div>}*/}
    </div>
  )
}

export default DatePickerCoreElement;