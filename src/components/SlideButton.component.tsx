import React, {FC, useState} from "react";
import {IonIcon} from "@ionic/react";

import "./SlideButton.scss"
import {eegEuro} from "../eegIcons";

interface SlideButtonComponentProps {
  checked: boolean
  disabled: boolean
  setChecked: (s: boolean) => void
}

const SlideButtonComponent: FC<SlideButtonComponentProps> = ({checked,disabled, setChecked}) => {

  // const [isChecked, setIsChecked] = useState(checked);

  const changeCheckbox = (e: any) => {
    //    e.preventDefault();
    //    e.stopPropagation();
    setChecked(e.target.checked);
  };

  return (
    <label className={disabled ? "eeg-sliding-box disabled" : "eeg-sliding-box"} aria-disabled={disabled}>
      <input type="checkbox" checked={checked && !disabled} onChange={(e) => changeCheckbox(e)} disabled={disabled}/>
      <div className="eeg-sliding-box-inner">
        <div>
          <span className="eeg-on">
            <IonIcon icon={eegEuro}/>
          </span>
          <span className="eeg-off">
            <IonIcon icon={eegEuro}/>
          </span>
        </div>
      </div>
      <i className="eeg-sliding-box-button"></i>
    </label>
  )
}

export default SlideButtonComponent;