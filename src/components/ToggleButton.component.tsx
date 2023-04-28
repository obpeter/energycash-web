import React, {FC, ReactNode, useState} from "react";
import {IonChip, IonIcon, IonLabel} from "@ionic/react";

import "./ToggleButton.css"

export type ToggleButtonItems = {
  label: string
  icon?: string
}

interface ToggleButtonComponentProps {
  buttons: ToggleButtonItems[]
  onChange: (selectedIdx: number) => void
  initalType: number
  changeable: boolean
}

const ToggleButtonComponent: FC<ToggleButtonComponentProps>
  = ({buttons, onChange, initalType, changeable}) => {
  const [selected, setSelected] = useState(initalType);

  const handleSelected = (idx: number) => {
    if(changeable) {
      setSelected(idx);
      onChange(idx);
    }
  }

  return (
    <>
      {buttons.map((b, idx) => (
        <IonChip key={idx} className="ToggleButtonComponent" outline={!(selected === idx)} onClick={() => handleSelected(idx)}>
          {b.icon && <IonIcon icon={b.icon}/>}
          <IonLabel>{b.label}</IonLabel>
        </IonChip>
      ))}
    </>
  )
}

export default ToggleButtonComponent;