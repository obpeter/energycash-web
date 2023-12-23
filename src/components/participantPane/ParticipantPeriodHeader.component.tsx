import React, {FC} from "react";
import {
  IonCheckbox,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
} from "@ionic/react";
import {SelectedPeriod} from "../../models/energy.model";
import {IonCheckboxCustomEvent} from "@ionic/core/dist/types/components";
import {CheckboxChangeEventDetail} from "@ionic/core";

// import "./ParticipantPeriodHeader.component.css"
import PeriodSelectorElement from "../core/PeriodSelector.element";
import {useAppSelector} from "../../store";
import {periodsSelector} from "../../store/energy";

interface ParticipantPeriodHeaderComponentProps {
  activePeriod: SelectedPeriod | undefined;
  selectAll: (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => void;
  onUpdatePeriod: (selectedPeriod: SelectedPeriod) => void;
}

const ParticipantPeriodHeaderComponent: FC<ParticipantPeriodHeaderComponentProps> = ({activePeriod, selectAll, onUpdatePeriod}) => {
  const periods = useAppSelector(periodsSelector);

  return (
    <div style={{marginLeft: "5px", margin: "0 5px 10px 5px", borderBottom: "2px solid gray"}}>
    <IonGrid>
      <IonRow>
        <IonCol size={"2"}>
          <IonItem lines="none">
            <IonCheckbox style={{"--size": "16px", margin: "0px"}} onIonChange={selectAll} aria-label=""></IonCheckbox>
          </IonItem>
        </IonCol>
        <IonCol>
          <IonItem lines="none">
          <PeriodSelectorElement activePeriod={activePeriod} periods={periods} onUpdatePeriod={onUpdatePeriod} />
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
    </div>
  )
}
export default ParticipantPeriodHeaderComponent;
