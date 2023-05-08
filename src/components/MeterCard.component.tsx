import React, {FC, useContext, useEffect} from "react";
import {IonCard, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow} from "@ionic/react";
import {eegPlug, eegSolar} from "../eegIcons";
import {EegParticipant} from "../models/members.model";
import {Metering} from "../models/meteringpoint.model";
import cn from "classnames"

import "./Member.component.css";
import {useHistory} from "react-router";
import {useAppSelector} from "../store";
import {meteringReportSelector} from "../store/energy";
import {ConsumerReport, ProducerReport} from "../models/energy.model";
import {MemberViewContext} from "../store/hook/MemberViewProvider";
import {selectRateById} from "../store/rate";
import {amountInEuro} from "../util/TariffHelper";
import {selectBillByMeter} from "../store/billing";
import {formatMeteringPointString} from "../util/Helper.util";

interface MeterCardComponentProps {
  participant:EegParticipant;
  meter: Metering;
  hideMeter: boolean;
  onSelect?: (participantId: string, meter: Metering) => void;
  showCash?: boolean;
}

const MeterCardComponent: FC<MeterCardComponentProps> = ({participant, meter, hideMeter, onSelect, showCash}) => {

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const history = useHistory();
  const report = useAppSelector(meteringReportSelector(meter.meteringPoint, `MRP/${year}/${month}`))
  const tariff = useAppSelector(selectRateById(meter.tariffId))
  const bill = useAppSelector(selectBillByMeter(participant.id, meter.meteringPoint))

  // const {showAmount} = useContext(MemberViewContext)

  const ratio = (own: number, total: number) => {
    return 100 - Math.round((own / total) * 100);
  }

  const barRatio = (report?: ProducerReport | ConsumerReport) => {
    // console.log("report for ratio: ", report);
    if (report) {
      if ("consumed" in report) {
        return Math.round((report.allocated / report.consumed) * 100);
      } else {
        return Math.round((report.allocated / report.total_production) * 100);
      }
    }
    return 0
  }
  const isPending = () => participant.status === 'PENDING';
  const isGenerator = () => meter.direction === 'GENERATOR';
  const isMeterPending = () => isPending() || meter.status === 'NEW' || meter.status === 'PENDING';

  // useEffect(() => {
  //   console.log("Report: ", meter.meteringPoint, report)
  // }, [report])

  const meterValue = () => {
    if (report && report.allocated) {
      if (showCash && tariff) {
        return (<><span>{bill}</span><span style={{fontSize:"12px"}}> €</span></>);
      }
      return (<><span>{(Math.round(report?.allocated! * 10) / 10)}</span><span style={{fontSize:"10px"}}> kWh</span></>);
    }
    return (<></>);
  }

  // /*history.push(`/participant/${participant.id}/meter/${meter.meteringPoint}`*/
  return (
    <IonCard style={{marginTop: "0px", fontSize: "16px"}} onClick={() => onSelect && onSelect(participant.id, meter)}>
      <IonGrid fixed={true} style={{paddingTop: "12px"}}>
        <IonRow style={isMeterPending() ? {color: "#DC631E"} : {color: "#1E4640"}}>
          <IonCol size={"1"}>
            <IonIcon icon={isGenerator() ? eegSolar : eegPlug} size="small"></IonIcon>
          </IonCol>
          <IonCol size={isMeterPending() ? "11" : "7"}>
            {/*<IonLabel style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{participant.participant.meters[0].meteringPoint}</IonLabel>*/}
            <div style={{fontSize: "15px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{formatMeteringPointString(meter.meteringPoint)}</div>
          </IonCol>
          {isMeterPending() || (
            <IonCol size={"4"}>
              <div style={{display: "flex", flexFlow:"row-reverse"}}>
                { showCash ? (
                  <IonLabel className={cn("ion-text-end", {"producer-text": !isGenerator()}, {"consumer-text": isGenerator()})}>{meterValue()}</IonLabel>
                ) : (
                  <IonLabel className={cn("ion-text-end", {"producer-text": isGenerator()}, {"consumer-text": !isGenerator()})}>{meterValue()}</IonLabel>
                )}
              </div>
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
      {isMeterPending() || hideMeter || (
        <div style={{height: "6px", width: "100%", background: "rgba(0, 0, 0, 0.04)"}}>
          <div style={{position: "absolute", height: "6px", right: "0", width: "" + barRatio(report) + "%"}}
               className={cn({"producer":isGenerator()}, {"consumer":!isGenerator()})}></div>
        </div>
      )}
    </IonCard>
  )
}
export default MeterCardComponent;