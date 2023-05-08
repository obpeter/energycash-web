import React, {FC, useContext} from "react";
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
import {MemberViewContext} from "../store/hook/MemberViewProvider";
import ParticipantInvoiceDetailsComponent from "../components/ParticipantInvoiceDetails.component";
import {ParticipantContext} from "../store/hook/ParticipantProvider";
import {selectBillById} from "../store/billing";

const Participants: FC = () => {
  const dispatcher = useAppDispatch();
  const periods = useAppSelector(periodsSelector);
  const tenant = useAppSelector(selectedTenant);
  const activePeriod = useAppSelector(selectedPeriodSelector);
  const participants = useAppSelector(participantsSelector);

  const selectedParticipant = useAppSelector(selectedParticipantSelector);

  const {
    enableBilling
  } = useContext(ParticipantContext);

  function showParticipantDetails() {
    if (selectedParticipant) {
      if (enableBilling) {
        return (
          <ParticipantInvoiceDetailsComponent />
        )
      } else {
        return (
          <ParticipantDetailsPaneComponent />
        )
      }
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