import {CSSProperties, FC} from "react";
import {IonCheckbox, IonItem, IonLabel} from "@ionic/react";

const CheckboxComponent: FC<{style?: CSSProperties, label: string, setChecked: (state: boolean) => void, checked:boolean, disabled?:boolean}> = ({style, label, setChecked, checked, ...rest})  => {
  return (
    <div className={"form-element"} style={style}>
      <IonItem lines="none">
        <IonCheckbox slot="start" checked={checked} onIonChange={(e) => setChecked(e.detail.checked)} labelPlacement="end" {...rest}>{label}</IonCheckbox>
        {/*<IonLabel>{label}</IonLabel>*/}
      </IonItem>
    </div>
  )
}

export default CheckboxComponent;