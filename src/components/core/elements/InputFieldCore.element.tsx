import React, {FC, useEffect, useState} from "react";
import {IonInput} from "@ionic/react";
import {IonInputCustomEvent} from "@ionic/core/dist/types/components";
import {InputInputEventDetail} from "@ionic/core/dist/types/components/input/input-interface";
import {TextFieldTypes} from "@ionic/core";

interface InputFieldCoreProps {
  initialValue: string | number
  onChange1: (name: string, value: any) => void
  name: string,
  label: string,
  placeholder?: string,
  rules?: object,
  disabled?: boolean,
  onTransform?: (e: IonInputCustomEvent<InputInputEventDetail>) => string | number,
  type?: TextFieldTypes,
}

const InputFieldCoreElement: FC<InputFieldCoreProps> = ({
                                                          initialValue,
                                                          name,
                                                          label,
                                                          placeholder,
                                                          rules,
                                                          disabled,
                                                          onTransform,
                                                          onChange1,
                                                          ...rest
                                                        }) => {

  const [currentValue, setCurrentValue] = useState<string | number>(initialValue ? initialValue : "")

  useEffect(() => {
    setCurrentValue(initialValue ? initialValue : "")
  }, [initialValue]);

  return (
    <div className={"form-element"}>
      <IonInput
        placeholder={placeholder ? placeholder : "Enter Text"}
        fill="outline"
        labelPlacement={"floating"}
        value={currentValue}
        name={name}
        {...rest}>
      </IonInput>
    </div>
  )
}

export default InputFieldCoreElement