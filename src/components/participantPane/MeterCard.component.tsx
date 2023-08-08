import React, {FC} from "react";
import {IonCard, IonCol, IonGrid, IonIcon, IonLabel, IonRow} from "@ionic/react";
import {eegExclamation, eegPlug, eegSolar} from "../../eegIcons";
import {EegParticipant} from "../../models/members.model";
import {Metering} from "../../models/meteringpoint.model";
import cn from "classnames"

import "./Member.component.css";
import {useAppSelector} from "../../store";
import {meteringReportSelector} from "../../store/energy";
import {ConsumerReport, ProducerReport} from "../../models/energy.model";
import {selectRateById} from "../../store/rate";
import {selectBillByMeter} from "../../store/billing";
import {formatMeteringPointString} from "../../util/Helper.util";

interface MeterCardComponentProps {
  participant:EegParticipant;
  meter: Metering;
  hideMeter: boolean;
  onSelect?: (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>, participantId: string, meter: Metering) => void;
  showCash?: boolean;
  isSelected?: boolean;
}

interface CARDSTYLE {
  [key: string]: any
};

const MeterCardComponent: FC<MeterCardComponentProps> = ({participant, meter, hideMeter, onSelect, showCash, isSelected}) => {

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const report = useAppSelector(meteringReportSelector(meter.meteringPoint, `MRP/${year}/${month}`))
  const tariff = useAppSelector(selectRateById(meter.tariffId))
  const bill = useAppSelector(selectBillByMeter(participant.id, meter.meteringPoint))

  const ratio = (own: number, total: number) => {
    return 100 - Math.round((own / total) * 100);
  }

  const barRatio = (report?: ProducerReport | ConsumerReport) => {
    // console.log("report for ratio: ", report);
    if (report) {
      if ("consumed" in report) {
        if (report.consumed === 0) return 0
        return Math.round((report.allocated / report.consumed) * 100);
      } else {
        if (report.total_production === 0) return 0
        return Math.round((report.allocated / report.total_production) * 100);
      }
    }
    return 0
  }
  const isPending = () => participant.status === 'PENDING';
  const isGenerator = () => meter.direction === 'GENERATION';
  const isMeterPending = () => isPending() || meter.status === 'NEW' || meter.status === 'PENDING';

  const isMeterInactive = () => meter.status === "REVOKED" || meter.status === "REJECTED"

  const isMeterActive = () => meter.status === "ACTIVE"

  const meterValue = () => {
    if (report && report.allocated) {
      if (showCash && tariff) {
        return (<><span>{bill.toFixed(2)}</span><span style={{fontSize:"12px"}}> €</span></>);
      }
      // return (<><span>{(Math.round(report?.allocated! * 10) / 10)}</span><span style={{fontSize:"10px"}}> kWh</span></>);

      let value = report.allocated.toFixed(2);
      if ('produced' in report) {
        value = (report.produced - report.allocated).toFixed(2)
      }
      // return (<><span>{report ? report?.allocated!.toFixed(2) : 0}</span><span style={{fontSize:"10px"}}> kWh</span></>);
      return (<><span>{value}</span><span style={{fontSize:"10px"}}> kWh</span></>);
    }
    return (<></>);
  }

  const renderMeterName = (m: Metering) => {
    if (m.equipmentName && m.equipmentName.length > 0) {
      return m.equipmentName;
    }
    return formatMeteringPointString(m.meteringPoint)
  }

  let cardStyle: CARDSTYLE = {marginTop: "0px", fontSize: "16px"}
  if (isSelected) {
    cardStyle = {...cardStyle, backgroundColor:"#e5ffdd"}
  }

  // /*history.push(`/participant/${participant.id}/meter/${meter.meteringPoint}`*/
  return (
    <IonCard style={cardStyle} onClick={(e) => onSelect && onSelect(e, participant.id, meter)}>
      <IonGrid fixed={true} style={{paddingTop: "12px"}}>
        <IonRow style={isMeterActive() ? {color: "#1E4640"} : isMeterPending() ? {color: "#DC631E"} : {color: "#dc1e1e"}}>
          <IonCol size={"1"}>
            <IonIcon icon={isMeterInactive() ? eegExclamation : isGenerator() ? eegSolar : eegPlug} size="small"></IonIcon>
          </IonCol>
          <IonCol size={isMeterPending() ? "11" : "7"}>
            {/*<IonLabel style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{participant.participant.meters[0].meteringPoint}</IonLabel>*/}
            {/*<div style={{fontSize: "15px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer"}}>{renderMeterName(meter)}</div>*/}
            <div style={{fontSize: "15px", overflow: "hidden", cursor: "pointer"}}>{renderMeterName(meter)}</div>
          </IonCol>
          {isMeterPending() || (
            <IonCol size={"4"}>
              <div style={{display: "flex", flexFlow:"row-reverse"}}>
                { showCash ? (
                  <IonLabel className={cn("ion-text-end", {"producer-text": !isGenerator()}, {"consumer-text": isGenerator()})}>{meterValue()}</IonLabel>
                ) : (
                  <IonLabel className={cn("ion-text-end", {"producer-text": !isGenerator()}, {"consumer-text": isGenerator()})}>{meterValue()}</IonLabel>
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