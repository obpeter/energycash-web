import {FC} from "react";
import {IonCheckbox, IonItem, IonLabel} from "@ionic/react";

const CheckboxComponent: FC<{label: string, setChecked: (state: boolean) => void, checked:boolean}> = ({label, setChecked, checked})  => {
  return (
    <div className={"form-element"}>
      <IonItem lines="none">
        <IonCheckbox slot="start" checked={checked} onIonChange={(e) => setChecked(e.detail.checked)} labelPlacement="end">{label}</IonCheckbox>
        {/*<IonLabel>{label}</IonLabel>*/}
      </IonItem>
    </div>
  )
}

export default CheckboxComponent;