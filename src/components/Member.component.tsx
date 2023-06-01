import React, {FC, ReactNode} from "react";
import {EegParticipant} from "../models/members.model";
import {
  CheckboxCustomEvent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow
} from "@ionic/react";

import "./Member.component.css";
import {eegSumSign} from "../eegIcons";
import MemberNameComponent from "./MemberName.component";
import {ParticipantBillType} from "../models/meteringpoint.model";
import {useAppSelector} from "../store";
import {selectBillById} from "../store/billing";

interface MemberProps {
  participant: EegParticipant;
  children: ReactNode;
  isChecked: boolean;
  hideMember: boolean;
  hideMeter: boolean;
  showAmount: boolean;
  onCheck: (e: CheckboxCustomEvent) => void;
  showDetailsPage: (participant: EegParticipant) => void;
}

const MemberComponent: FC<MemberProps> = ( {participant,
                                             children,
                                             isChecked,
                                             hideMember,
                                             hideMeter,
                                             showAmount,
                                             onCheck,
                                             showDetailsPage}) => {

  const memberBill = useAppSelector(selectBillById(participant.id))

  const ratio = (own: number, total: number) => {
    return 100 - Math.round((own / total) * 100);
  }

  const isPending = () => participant.status === 'PENDING';

  const memberSum = () => {
    if (memberBill) {
      const sum =  /*memberBill.amount +*/ memberBill.meteringPoints.reduce((i,s) => i + s.amount, 0);
      return Math.round(sum * 100) / 100;
    }
    return 0;
  }

  return (
    <div>
    <IonGrid fixed={true} style={{paddingBottom: "0px", paddingTop: "0px"}}>
      { hideMember || (
        <IonRow class="ion-align-items-center" style={{"--ion-background-color": "transparent", "--ion-item-background": "transparent"}}>
          <MemberNameComponent participant={participant} isChecked={isChecked} onCheck={onCheck} showAmount={showAmount}/>
        </IonRow>
      )}
      <IonRow>
        <IonCol size="12">
          {children}
        </IonCol>
      </IonRow>
      { showAmount && !isPending() && !hideMeter &&
      <IonRow style={{flexDirection: "row-reverse"}}>
        <div style={{paddingRight: "10px", marginBottom:"10px"}}>
          <IonItem lines="none" fill="outline" style={{"--min-height": "32px", fontSize: "14px"}} onClick={(e) => {
            showDetailsPage(participant);
            e.preventDefault();
          }}><IonIcon style={{marginTop: "5px", marginBottom: "5px"}} icon={eegSumSign} slot="start"></IonIcon>
            {memberSum()} €
          </IonItem>
        </div>
      </IonRow>
      }
    </IonGrid>
    </div>
  )
}

export default MemberComponent;
