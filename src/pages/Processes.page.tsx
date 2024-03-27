import React, {FC, useContext, useEffect, useState} from "react";
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol,
  IonContent, IonGrid, IonIcon, IonItem, IonLabel,
  IonList,
  IonPage, IonRow, IonThumbnail,
} from "@ionic/react";

import {syncCircle} from "ionicons/icons";
import cn from "classnames";

import './Processe.page.scss'
import RateDetailPaneComponent from "../components/RateDetailPane.component";
import ProcessDetailPaneComponent from "../components/processDetails/ProcessDetailPane.component";
import {EdaProcess} from "../models/eeg.model";
import * as process from "process";
import {useAppSelector} from "../store";
import {EegContext} from "../store/hook/Eeg.provider";
import {activeParticipantsSelector1, meterSelector} from "../store/participant";
import {selectedPeriodSelector} from "../store/energy";
import {useLocale} from "../store/hook/useLocale";

const ProcessesPage: FC = () => {

  const activePeriod = useAppSelector(selectedPeriodSelector);
  const participants = useAppSelector(activeParticipantsSelector1)
  const meters = useAppSelector(meterSelector)
  const {eeg} = useContext(EegContext)
  const {t} = useLocale("common")

  const processes: EdaProcess[] = [
    {
      name: "Zählpunktdaten nachfordern",
      description: "Dieser Prozess dient der Anforderung von Energiedaten eines Zählpunktes in einem vom Anforderer zu definierenden Zeitbereich",
      type: "CR_REQ_PT"
    },
    {
      name: "Zählpunkt aktivieren",
      description: "Dieser Prozess dient zur Aktivierung eines Zählpunktes. ",
      type: "EC_REQ_ONL"
    },
    {
      name: "Zählpunkt abmelden",
      description: "Der Marktteilnehmer wird über die Aufhebung einer erteilten Datenfreigabe in Kenntnis gesetzt.",
      type: "CM_REV_CUS"
    },
    {
      name: t("process.partFact.title"),
      description: t("process.partFact.desc"),
      type: "EC_PRTFACT_CHANGE"
    },
    {
      name: t("process.podList.title"),
      description: t("process.podList.desc"),
      type: "EC_PODLIST"
    },
    {
      name: "Prozess History",
      description: "Übersicht der Prozesskommunikation mit den Marktpartner",
      type: "HISTORY"
    },
  ]

  const [selectedProcess, setSelectedProcess] = useState<EdaProcess | undefined>()

  useEffect(() => {
    setSelectedProcess(processes[0])
  }, [])

  const onSelect = (processId: number) => {
    setSelectedProcess(processes[processId])
  }

  return (
    <IonPage>
      <IonContent fullscreen color="eeg">
        <div style={{display: "flex", flexDirection: "row", height: "100vh"}}>
          <div className={"ratePane"}>
            <div className={"pane-content"}>
              <IonList color="eeg">
                {processes.map((p, i) =>
                  <div key={p.type} className={cn("eeg-cards", {"selected": processes[i].type === selectedProcess?.type})}>
                    <IonCard color="eeg" onClick={() => onSelect(i)}>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="auto">
                            <div style={{paddingTop: "5px", display: "flex", fontSize: "20px"}}>
                              <IonIcon icon={syncCircle} size="large"></IonIcon>
                            </div>
                          </IonCol>
                          <IonCol>
                            <IonLabel>
                              <h2><b>{p.name}</b></h2>
                              <p>{p.description}</p>
                            </IonLabel>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCard>
                  </div>
                )}
              </IonList>
            </div>
          </div>
          <div style={{flexGrow: "1", background: "#EAE7D9"}}>
            {eeg ? <ProcessDetailPaneComponent selectedProcess={selectedProcess} eeg={eeg} participants={participants} meters={meters}/> : <></>}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ProcessesPage;