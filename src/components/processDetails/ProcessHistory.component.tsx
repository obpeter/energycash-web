import React, {FC, useEffect, useState} from "react";
import CorePageTemplate from "../core/CorePage.template";
import {EdaHistories, EdaHistory, Eeg} from "../../models/eeg.model";
import {Metering} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import {IonAccordion, IonAccordionGroup, IonContent, IonIcon, IonItem, IonLabel} from "@ionic/react";
import {eegService} from "../../service/eeg.service";
import {arrowDownOutline, chevronForwardOutline} from "ionicons/icons";

interface ProcessHistoryComponentProps {
  eeg: Eeg
}

const ProcessHistoryComponent: FC<ProcessHistoryComponentProps> = ({eeg}) => {

  const [entries, setEntries] = useState<EdaHistories>({})

  const [selectedItem, setSelectedItem] = useState(0)

  useEffect(() => {
    eegService.getHistories(eeg.rcNumber)
      .then(h => setEntries(h))
      .catch(console.log)
  }, []);

  const getEntriesForProcess = (process: string): [string, EdaHistory[]][] => {
    const processEntries = entries[process]

    // Object.entries(processEntries).map(([k,v],i) => )

    return Object.entries(processEntries).map(([k, v]) => {
      return [...extractMessage(process, v)]
    })
  }

  const sortHistories = (h: EdaHistory[]) => {
    return h.sort((a,b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
  }

  const getLabelName = (p: string) => {
    switch (p) {
      case "CM_REV_IMP": return "Datenfreigabe-Aufhebung"
      case "CR_MSG": return "Versenden der Energiedaten"
      case "EC_REQ_ONL": return "Anfordern von Energiedaten"
    }
  }
  const getProtocolLine = (protocol: string, h: EdaHistory) => {
    switch (protocol) {
      case "CM_REV_IMP": return (
        <div style={{fontSize:"14px", display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr"}}>
          <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
          {/*<span>{": "}</span>*/}
          <span style={{gridColumnStart: "2"}}>{h.processType}</span>
        </div>
      )
      case "CR_MSG": return (
        <div style={{fontSize:"14px", display: "grid", gridTemplateColumns: "0.5fr auto 0.1fr auto auto"}}>
          <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
          <span style={{gridColumnStart: "2"}}>{(h.meteringFrom ? h.meteringFrom.toDateString() : "-")}</span>
          <span style={{gridColumnStart: "3"}}><IonIcon icon={chevronForwardOutline} size="small"/> </span>
          <span style={{gridColumnStart: "4"}}>{(h.meteringTo ? h.meteringTo.toDateString() : "-")}</span>
        </div>
      )
      case "EC_REQ_ONL": return (
        <div style={{fontSize:"14px", display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr"}}>
          <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
          <span style={{gridColumnStart: "2"}}>{h.processType}</span>
        </div>
      )
    }
  }

  const extractMessage = (process: string, msg: Record<string, any>[]): [string, EdaHistory[]] => {

    switch(process) {
      case "CM_REV_IMP": {
        const history_cm = msg.map((e) => {
          return {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            processType: e["processType"],
            meteringPoint: e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.meteringPoint ? r.meteringPoint : z, "-")
          } as EdaHistory
        })
        return [history_cm.reduce((z, h) => h.meteringPoint ? h.meteringPoint : z, "-"), sortHistories(history_cm)]
      }
      case "CR_MSG": {
        const history = msg.map((e) => {
          return {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            meteringPoint: e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-",
            meteringFrom: new Date(e["message"].from),
            processType: e["processType"],
            meteringTo: new Date(e["message"].to),
          } as EdaHistory
        })

        return [history.reduce((z, h) => h.meteringPoint ? h.meteringPoint : z, "-"), sortHistories(history)]
      }
      case "CR_REQ_PT": {
        const history_cr_req_pt = msg.map((e) => {
          return {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            processType: e["processType"],
            meteringPoint: e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-",
          } as EdaHistory
        })
        return [history_cr_req_pt.reduce((z, h) => h.meteringPoint ? h.meteringPoint : z, "-"), sortHistories(history_cr_req_pt)]
      }
      case "EC_REQ_ONL": {
        const history_cr_req_pt = msg.map((e) => {
          return {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            processType: e["processType"],
            meteringPoint: e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-",
          } as EdaHistory
        })
        return [history_cr_req_pt.reduce((z, h) => h.meteringPoint ? h.meteringPoint : z, "-"), sortHistories(history_cr_req_pt)]
      }
    }
    return ["-", [] as EdaHistory[]]
  }

  return (
    <CorePageTemplate>
      <div style={{position: "absolute", top: "0", bottom: "0", left: "0", right: "0"}}>

        {["CM_REV_IMP", "EC_REQ_ONL", "CR_MSG"].map((p, i) => (
      <div key={p + i}>
        <IonItem button onClick={() => selectedItem !== i + 1 ? setSelectedItem(i+1) : setSelectedItem(0)}>
          <IonLabel>{getLabelName(p)}</IonLabel>
        </IonItem>
        {selectedItem === (i+1) &&
            <div>
                <IonAccordionGroup>
              {getEntriesForProcess(p).map(([k, v], i) => (
          <IonAccordion key={i} value={"cm_rev_imp_"+i}>
            <IonItem slot="header" color="light">
              <IonLabel>{k}</IonLabel>
            </IonItem>
            <div style={{boxShadow: "2px 1px 1px lightgray", margin:"10px"}} className="ion-padding" slot="content">
              {v.map((e, i) => (
              <div key={"line" + p + i} className="ion-padding">
                {getProtocolLine(p, e)}
              </div>
                ))}
            </div>
          </IonAccordion>
              ))}
                </IonAccordionGroup>
            </div>
        }
      </div>
          ))}
        {/*<div>*/}
        {/*  <IonItem button onClick={() => selectedItem !== 2 ? setSelectedItem(2) : setSelectedItem(0)}>*/}
        {/*    <IonLabel>Versenden der Energiedaten</IonLabel>*/}
        {/*  </IonItem>*/}
        {/*  {selectedItem === 2 &&*/}
        {/*      <div>*/}
        {/*          <IonAccordionGroup>*/}
        {/*            {getEntriesForProcess("CR_MSG").map(([k, v], i) => (*/}
        {/*              <IonAccordion key={i} value={"cr_msg_"+i}>*/}
        {/*                <IonItem slot="header" color="light">*/}
        {/*                  <IonLabel>{k}</IonLabel>*/}
        {/*                </IonItem>*/}
        {/*                <div className="ion-padding" slot="content">*/}
        {/*                  {v.map((e, i) => (*/}
        {/*                    <div key={i} className="ion-padding">*/}
        {/*                      <div style={{fontSize:"14px"}}>*/}
        {/*                      <span>{e.date.toDateString()}</span><span>{": "}</span>*/}
        {/*                      <span>{(e.meteringFrom ? e.meteringFrom.toDateString() : "-") + " <-> "}</span>*/}
        {/*                      <span>{(e.meteringTo ? e.meteringTo.toDateString() : "-")}</span>*/}
        {/*                      </div>*/}
        {/*                    </div>*/}
        {/*                  ))}*/}
        {/*                </div>*/}
        {/*              </IonAccordion>*/}
        {/*            ))}*/}
        {/*          </IonAccordionGroup>*/}
        {/*      </div>*/}
        {/*  }*/}
        {/*</div>*/}
      {/*<div>*/}
      {/*  <IonItem button onClick={() => setSelectedItem(2)}>*/}
      {/*    <IonLabel>Entry 2</IonLabel>*/}
      {/*  </IonItem>*/}
      {/*  { selectedItem === 2 &&*/}
      {/*      <div>*/}
      {/*  <IonAccordionGroup>*/}
      {/*    <IonAccordion value="first">*/}
      {/*      <IonItem slot="header" color="light">*/}
      {/*        <IonLabel>First Accordion</IonLabel>*/}
      {/*      </IonItem>*/}
      {/*      <div className="ion-padding" slot="content">*/}
      {/*        <div className="ion-padding">*/}
      {/*          First Content*/}
      {/*        </div>*/}
      {/*        <div className="ion-padding">*/}
      {/*          First Content*/}
      {/*        </div>*/}
      {/*        <div className="ion-padding">*/}
      {/*          First Content*/}
      {/*        </div>*/}
      {/*        <div className="ion-padding">*/}
      {/*          First Content*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </IonAccordion>*/}
      {/*    <IonAccordion value="second">*/}
      {/*      <IonItem slot="header" color="light">*/}
      {/*        <IonLabel>Second Accordion</IonLabel>*/}
      {/*      </IonItem>*/}
      {/*      <div className="ion-padding" slot="content">*/}
      {/*        Second Content*/}
      {/*      </div>*/}
      {/*    </IonAccordion>*/}
      {/*    <IonAccordion value="third">*/}
      {/*      <IonItem slot="header" color="light">*/}
      {/*        <IonLabel>Third Accordion</IonLabel>*/}
      {/*      </IonItem>*/}
      {/*      <div className="ion-padding" slot="content">*/}
      {/*        Third Content*/}
      {/*      </div>*/}
      {/*    </IonAccordion>*/}
      {/*  </IonAccordionGroup>*/}
      {/*      </div>*/}
      {/*  }*/}
      {/*</div>*/}
      </div>
    </CorePageTemplate>
  )
}

export default ProcessHistoryComponent