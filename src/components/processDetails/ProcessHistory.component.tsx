import React, {FC, useCallback, useEffect, useState} from "react";
import CorePageTemplate from "../core/CorePage.template";
import {EdaHistories, EdaProcess, Eeg} from "../../models/eeg.model";
import {Metering} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import {IonAccordion, IonAccordionGroup, IonContent, IonIcon, IonItem, IonLabel, IonSearchbar} from "@ionic/react";
import {eegService} from "../../service/eeg.service";
import {arrowDownOutline, chevronForwardOutline} from "ionicons/icons";
import ProcessHeaderComponent from "./ProcessHeader.component";
import ProcessContentComponent from "./ProcessContent.component";
import DateComponent from "../dialogs/date.component";
import {useAppSelector} from "../../store";
import {selectedTenant} from "../../store/eeg";
import {EdaHistory, EdaResponseCode} from "../../models/process.model";

interface ProcessHistoryComponentProps {
  eeg: Eeg
  edaProcess: EdaProcess
}

const ProcessHistoryComponent: FC<ProcessHistoryComponentProps> = ({eeg, edaProcess}) => {

  const [entries, setEntries] = useState<EdaHistories>({})
  const [processFilter, setProcessFilter] = useState<Record<string, string | undefined>>({})
  const [selectedItem, setSelectedItem] = useState(0)
  const today = new Date()
  const [historyDate, setHistoryDate] = useState<[Date | null, Date | null]>([new Date(today.getTime() - (86400000 * 14)), today])

  useEffect(() => {
    const [beginDate, endDate] = historyDate
    if (beginDate && endDate) {
      eegService.getHistories(eeg.rcNumber, beginDate.getTime(), endDate.getTime()+(60*60*24*1000))
        .then(h => setEntries(h))
        .catch(console.log)
    }
  }, [historyDate]);

  const getEntriesForProcessId = (process: string):Record<string, EdaHistory[]> => {
    switch (process) {
      case "CM_REV_IMP":
        return {...entries[process], ...entries["CM_REV_SP"]}
      default:
        return entries[process]
    }
  }

  const getEntriesForProcess = useCallback((process: string): Record<string, EdaHistory[]> => {
    if (entries) {
      const processEntries = getEntriesForProcessId(process)
      if (processEntries) {
        return Object.entries(processEntries).reduce((g: Record<string, EdaHistory[]>, [k, v]) => {
          extractMessage(process, v).forEach(h => {
            (h.meteringPoints && h.meteringPoints.length > 0) ? h.meteringPoints.forEach(m => {
              g[m] = [...(g[m] || []), h]
              g[m].sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
            }) : (g['-'] = [...(g['-'] || []), h] || g['-'].sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
          })
          return g
        }, {})
      }
    }
    return {}
  }, [entries])

  const sortHistories = (h: EdaHistory[]) => {
    return h.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
  }

  const historyItems = ["EC_REQ_ONL", "CM_REV_IMP", "CR_REQ_PT", "CR_MSG"]

  const getLabelName = (p: string) => {
    switch (p) {
      case "CM_REV_IMP":
        return "Datenfreigabe-Aufhebung"
      case "CR_REQ_PT":
        return "Anfordern von Energiedaten"
      case "CR_MSG":
        return "Versenden der Energiedaten"
      case "EC_REQ_ONL":
        return "Anmeldung Teilnahme Online"
    }
  }

  const renderAccordionBody = (p: string, v: EdaHistory[]) => {
    switch (p) {
      case "CM_REV_IMP":
        return (
          <div style={{boxShadow: "2px 1px 1px lightgray", margin: "10px", border: "1px solid #d3d3d34f"}}
               className="ion-padding" slot="content">
            <div className="ion-padding"
                 style={{display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", rowGap: "10px"}}>
              <span style={{
                gridColumnStart: "1",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Abgewickelt am:"}</strong></span>
              <span
                style={{gridColumnStart: "2", borderBottom: "1px solid #dfdfdf"}}><strong>{"Protokoll"}</strong></span>
              <span style={{
                gridColumnStart: "3",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Zustimmung endet am:"}</strong></span>
              {v.map((h, i) => (
                <React.Fragment key={"line" + p + i}>
                  <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
                  <span style={{gridColumnStart: "2"}}>{h.processType}</span>
                  <span style={{gridColumnStart: "3"}}>{h.responseCode}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      case "CR_MSG":
        return (
          <div style={{boxShadow: "2px 1px 1px lightgray", margin: "10px", border: "1px solid #d3d3d34f"}}
               className="ion-padding" slot="content">
            <div className="ion-padding"
                 style={{display: "grid", gridTemplateColumns: "0.5fr auto 0.1fr auto auto", rowGap: "10px"}}>
              <span style={{
                gridColumnStart: "1",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Abgewickelt am:"}</strong></span>
              <span style={{
                gridColumnStart: "2",
                gridColumnEnd: "span 2",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Energiedaten von:"}</strong></span>
              <span
                style={{gridColumnStart: "4", borderBottom: "1px solid #dfdfdf"}}><strong>{"Energiedaten bis:"}</strong></span>
              {v.map((h, i) => (
                <React.Fragment key={"line" + p + i}>
                  <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
                  <span style={{gridColumnStart: "2"}}>{(h.meteringFrom ? h.meteringFrom.toDateString() : "-")}</span>
                  <span style={{gridColumnStart: "3"}}><IonIcon icon={chevronForwardOutline} size="small"/> </span>
                  <span style={{gridColumnStart: "4"}}>{(h.meteringTo ? h.meteringTo.toDateString() : "-")}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      case "EC_REQ_ONL":
        return (
          <div style={{boxShadow: "2px 1px 1px lightgray", margin: "10px", border: "1px solid #d3d3d34f"}}
               className="ion-padding" slot="content">
            <div className="ion-padding"
                 style={{display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", rowGap: "10px"}}>
              <span style={{
                gridColumnStart: "1",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Abgewickelt am:"}</strong></span>
              <span
                style={{gridColumnStart: "2", borderBottom: "1px solid #dfdfdf"}}><strong>{"Protokoll"}</strong></span>
              <span style={{gridColumnStart: "3", borderBottom: "1px solid #dfdfdf"}}><strong>{"Status"}</strong></span>
              {v.map((h, i) => (
                <React.Fragment key={"line" + p + i}>
                  <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
                  <span style={{gridColumnStart: "2"}}>{h.processType}</span>
                  <span style={{gridColumnStart: "3"}}>{h.responseCode}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      case "CR_REQ_PT":
        return (
          <div style={{boxShadow: "2px 1px 1px lightgray", margin: "10px", border: "1px solid #d3d3d34f"}}
               className="ion-padding" slot="content">
            <div className="ion-padding"
                 style={{display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", rowGap: "10px"}}>
              <span style={{
                gridColumnStart: "1",
                borderBottom: "1px solid #dfdfdf"
              }}><strong>{"Abgewickelt am:"}</strong></span>
              <span
                style={{gridColumnStart: "2", borderBottom: "1px solid #dfdfdf"}}><strong>{"Protokoll"}</strong></span>
              <span style={{gridColumnStart: "3", borderBottom: "1px solid #dfdfdf"}}><strong>{"Info"}</strong></span>
              {v.map((h, i) => (
                <React.Fragment key={"line" + p + i}>
                  <span style={{gridColumnStart: "1"}}>{h.date.toDateString()}</span>
                  <span style={{gridColumnStart: "2"}}>{h.processType}</span>
                  <span style={{gridColumnStart: "3"}}>{h.responseCode}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )

    }
    return (<></>)
  }

  const extractMessage = (process: string, msg: Record<string, any>[]): EdaHistory[] => {

    switch (process) {
      case "CM_REV_IMP": {
        const history_cm = msg.map((e) => {
          const m=  {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            processType: e["processType"],
            responseCode: e["message"].consentEnd ? new Date(e["message"].consentEnd).toLocaleDateString() : "-",
          } as EdaHistory

          switch (e.processType) {
            case "ANTWORT_CCMS":
              m.meteringPoint  = e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.meteringPoint ? r.meteringPoint : z, "-")
              m.meteringPoints = e["message"]["responseData"].map((m: Record<string, any>) => m.meteringPoint)
              break;
            case "ABLEHNUNG_CCMS":
              m.meteringPoint  = e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.meteringPoint ? r.meteringPoint : z, "-")
              m.meteringPoints = e["message"]["responseData"].map((m: Record<string, any>) => m.meteringPoint)
              m.responseCode   = e["message"].responseCode ? EdaResponseCode.getMessage(e["message"].responseCode[0]) : "-"
              break;
            case "AUFHEBUNG_CCMS":
              m.meteringPoint = e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-"
              m.meteringPoints = e["message"]["meter"].meteringPoint ? [e["message"]["meter"].meteringPoint] : []
              break;
            default:
              m.responseCode = "-"
          }
          return m
        })
        return sortHistories(history_cm)
      }
      case "CR_MSG": {
        const filter = processFilter[process] || ''
        const history = sortHistories(msg.map((e) => {
          return {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            meteringPoint: e["message"].meter ? e["message"].meter : "-",
            meteringPoints: e["message"].meter ? [e["message"].meter] : [],
            meteringFrom: new Date(e["message"].from),
            processType: e["processType"],
            meteringTo: new Date(e["message"].to),
          } as EdaHistory
        }))

        // const _history = filter.length > 0 ? history.filter(h => h.meteringPoint?.toLowerCase().indexOf(filter) !== -1) : history
        return history
      }
      case "CR_REQ_PT": {
        const history_cr_req_pt = msg.map((e) => {
          const m = {
            protocol: e["protocol"],
            date: new Date(e["date"]),
            message: e["message"],
            processType: e["processType"],
            meteringPoint: e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-",
            meteringPoints: e["message"]["meter"].meteringPoint ? [e["message"]["meter"].meteringPoint] : [],
          } as EdaHistory

          switch (e.processType) {
            case "ABLEHNUNG_PT":
            case "ANTWORT_PT":
              m.responseCode = e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.responseCode ? EdaResponseCode.getMessage(r.responseCode[0]) : z, "-")
              break
            case "ANFORDERUNG_PT":
              m.responseCode = e["message"].timeline ? new Date(e["message"].timeline.from).toLocaleDateString() + " - " + new Date(e["message"].timeline.to).toLocaleDateString() : ""
          }
          return m
        })
        return sortHistories(history_cr_req_pt)
      }
      case "EC_REQ_ONL": {
        const history_cr_req_pt = msg.map((e) => {
          switch (e.processType) {
            case "ABSCHLUSS_ECON":
              return {
                protocol: e["protocol"],
                date: new Date(e["date"]),
                message: e["message"],
                processType: e["processType"],
                meteringPoint: e["message"]["meterList"] ? e["message"]["meterList"].length > 0 ?
                  e["message"]["meterList"][0].meteringPoint ? "-" : "-" : "-" : "-",
                meteringPoints: e["message"]["meterList"] ? e["message"]["meterList"].map((m: any) => m.meteringPoint) : [],
              } as EdaHistory
            case "ANFORDERUNG_ECON":
              return {
                protocol: e["protocol"],
                date: new Date(e["date"]),
                message: e["message"],
                processType: e["processType"],
                meteringPoint: e["message"]["meter"].meteringPoint ? e["message"]["meter"].meteringPoint : "-",
                meteringPoints: e["message"]["meter"].meteringPoint ? [e["message"]["meter"].meteringPoint] : [],
              } as EdaHistory
            default:
              return {
                protocol: e["protocol"],
                date: new Date(e["date"]),
                message: e["message"],
                processType: e["processType"],
                meteringPoint: e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.meteringPoint ? r.meteringPoint : z, "-"),
                meteringPoints: e["message"]["responseData"].map((r: Record<string, any>) => r.meteringPoint),
                responseCode: e["message"]["responseData"].reduce((z: string, r: Record<string, any>) => r.responseCode ? EdaResponseCode.getMessage(r.responseCode[0]) : z, "-")
              } as EdaHistory
          }
        })
        return sortHistories(history_cr_req_pt)
      }
    }
    return [] as EdaHistory[]
  }

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    if (selectedItem > 0) {
      setProcessFilter((p) => {
        return {...p, [historyItems[selectedItem - 1]]: query}
      })
    }
  };

  return (
    <>
      <ProcessHeaderComponent name={edaProcess.name}>
        <DateComponent range={setHistoryDate} initialDate={historyDate}/>
      </ProcessHeaderComponent>
      <ProcessContentComponent>
        <CorePageTemplate>
          {/*style={{position: "absolute", top: "0", bottom: "0", left: "0", right: "0"}}*/}
          <div style={{margin: "16px"}}>

            {historyItems.map((p, i) => (
              <div key={p + i}>
                <IonItem button onClick={() => selectedItem !== i + 1 ? setSelectedItem(i + 1) : setSelectedItem(0)}>
                  <IonLabel>{getLabelName(p)}</IonLabel>
                </IonItem>
                {selectedItem === (i + 1) &&
                    <div style={{margin: "10px 24px"}}>
                        <div>
                            <IonSearchbar debounce={500} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                        </div>
                        <IonAccordionGroup>
                          {Object.entries(getEntriesForProcess(p))
                            .filter(([k, v]) => (processFilter[p] || '').length > 0 ? k.toLowerCase().indexOf(processFilter[p]!) !== -1 : true)
                            .map(([k, v], i) => (
                              <IonAccordion key={i} value={"cm_rev_imp_" + i}>
                                <IonItem slot="header" color="light">
                                  <IonLabel>{k}</IonLabel>
                                </IonItem>
                                {renderAccordionBody(p, v)}
                              </IonAccordion>
                            ))}
                        </IonAccordionGroup>
                    </div>
                }
              </div>
            ))}
          </div>
        </CorePageTemplate>
      </ProcessContentComponent>
    </>
  )
}

export default ProcessHistoryComponent