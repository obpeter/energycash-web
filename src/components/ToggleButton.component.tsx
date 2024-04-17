import React, {FC, ReactNode, useState} from "react";
import {IonButton, IonChip, IonIcon, IonLabel} from "@ionic/react";

import "./ToggleButton.css"

export type ToggleButtonItems = {
  label: string
  icon?: string
}

interface ToggleButtonComponentProps {
  buttons: ToggleButtonItems[]
  onChange: (selectedIdx: number) => void
  value: number
  changeable: boolean
}

const ToggleButtonComponent: FC<ToggleButtonComponentProps>
  = ({buttons, onChange, value, changeable}) => {

  const handleSelected = (idx: number) => {
    if(changeable) {
      onChange(idx);
    }
  }

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <div>
      {buttons.map((b, idx) => (
        <IonChip key={idx} className="ToggleButtonComponent" outline={!(value === idx)} onClick={() => handleSelected(idx)}>
          {b.icon && <IonIcon icon={b.icon}/>}
          <IonLabel>{b.label}</IonLabel>
        </IonChip>
      ))}
      </div>
    </div>
  )
}

export default ToggleButtonComponent;