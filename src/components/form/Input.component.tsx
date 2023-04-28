import React, {FC} from "react";
import {IonInput, IonItem, IonLabel} from "@ionic/react";
import {Control, Controller} from "react-hook-form";

export interface InputProps {
  name: string;
  control?: Control;
  label?: string;
  component?: JSX.Element;
}

const Input: FC<InputProps> = ({
  name,
  control,
  component,
  label}) => {
  return (
    <>
      <IonItem class="ion-padding">
        {label && (
          <IonLabel position="floating">{label}</IonLabel>
        )}
        <Controller
          name={name}
          control={control}
          render={({field}) => ((component) || <IonInput {...field}/>) }
        />
      </IonItem>
    </>
  );
};

export default Input;