import React, {FC} from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  SelectCustomEvent
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import ParticipantPaneComponent from "../components/ParticipantPane.component";

import "./Participants.css"
import {useAppDispatch, useAppSelector} from "../store";
import {participantsSelector, selectedParticipantSelector, selectParticipant} from "../store/participant";
import {periodsSelector, selectedPeriodSelector} from "../store/energy";
import {selectedTenant} from "../store/eeg";
import ParticipantDetailsPaneComponent from "../components/ParticipantDetailsPane.component";

const Participants: FC = () => {
  const dispatcher = useAppDispatch();
  const periods = useAppSelector(periodsSelector);
  const tenant = useAppSelector(selectedTenant);
  const activePeriod = useAppSelector(selectedPeriodSelector);
  const participants = useAppSelector(participantsSelector);

  const selectedParticipant = useAppSelector(selectedParticipantSelector);

  function showParticipantDetails() {
    if (selectedParticipant) {
      return (
        <ParticipantDetailsPaneComponent selectedParticipant={selectedParticipant}/>
      )
    } else {
      return (
        <></>
      )
    }
  }


  return (
    <IonPage>
      <IonContent fullscreen color="eeg">
        <div style={{display:"flex", flexDirection:"row"}}>
          <div>
            <ParticipantPaneComponent
              participants={participants}
              activePeriod={activePeriod}
              onUpdatePeriod={(e: SelectCustomEvent<number>) => console.log("Update Period", e)}
              periods={periods}
            />
          </div>
          <div style={{flexGrow:"1", background: "#EAE7D9"}}>
            {showParticipantDetails()}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Participants;