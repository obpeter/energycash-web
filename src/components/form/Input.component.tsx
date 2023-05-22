import React, {FC, HTMLAttributes} from "react";
import {IonInput, IonItem, IonLabel} from "@ionic/react";
import {Control, Controller, UseFormRegisterReturn} from "react-hook-form";
import {TextFieldTypes} from "@ionic/core";

// export interface InputProps {
//   name: string;
//   control?: Control;
//   label?: string;
//   component?: JSX.Element;
// }
//
// const Input: FC<InputProps> = ({
//   name,
//   control,
//   component,
//   label}) => {
//   return (
//     <>
//       <IonItem class="ion-padding">
//         {label && (
//           <IonLabel position="floating">{label}</IonLabel>
//         )}
//         <Controller
//           name={name}
//           control={control}
//           render={({field}) => (<IonInput {...field}/>)}
//         />
//       </IonItem>
//     </>
//   );
// };

const Input = (props: Partial<UseFormRegisterReturn> & {type?: TextFieldTypes, label?: string, labelPlacement?: 'start' | 'end' | 'floating' | 'stacked' | 'fixed'}) => (
  <div className={"form-element"}>
    <IonInput fill="outline" {...props} />
  </div>
);


export default Input;