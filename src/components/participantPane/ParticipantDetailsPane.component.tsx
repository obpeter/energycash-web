import React, {FC, useEffect, useState} from "react";
import {EegParticipant} from "../../models/members.model";
import cn from "classnames";

import "./ParticipantDetailsPane.compoenent.css"
import {
  IonButton, IonButtons, IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToggle,
  IonToolbar, useIonAlert, useIonToast
} from "@ionic/react";
import {
  caretForwardOutline,
  documentTextOutline,
  logoEuro,
  person,
  trashBin
} from "ionicons/icons";
import {eegPlug, eegSandClass, eegShieldCrown, eegSolar, eegStar} from "../../eegIcons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useAppDispatch, useAppSelector} from "../../store";
import {Metering} from "../../models/meteringpoint.model";
import MemberFormComponent from "../MemberForm.component";
import MeterFormComponent from "../MeterForm.component";
import {
  archiveParticipant,
  confirmParticipant, removeMeteringPoint,
  selectedMeterIdSelector,
  selectedParticipantSelector,
  updateParticipant
} from "../../store/participant";
import {formatMeteringPointString, GetWeek} from "../../util/Helper.util";
import {selectedTenant} from "../../store/eeg";
import AllowParticipantDialog from "../dialogs/AllowParticipant.dialog";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import InvoiceDocumentComponent from "./InvoiceDocument.component";
import {
  createPeriodIdentifier,
  EnergySeries,
  MeterEnergySeries,
  MeterReport, ParticipantReport,
  SelectedPeriod
} from "../../models/energy.model";
import {eegService} from "../../service/eeg.service";
import {MONTHNAME} from "../../models/eeg.model";
import MeterChartNavbarComponent from "../MeterChartNavbar.component";
import ContractDocumentComponent from "./ContractDocument.component";
import participants from "../../pages/Participants";
import {ratesSelector} from "../../store/rate";
import {fetchBillingRun} from "../../store/billingRun";
import {fileService} from "../../service/file.service";
import {meteringInterReportSelectorV2, meteringReportSelectorV2, selectedPeriodSelector} from "../../store/energy";
import {useSelector} from "react-redux";
import MeterChartComponent from "./MeterChart.component";

type DynamicComponentKey = "memberForm" | "meterForm" | "documentForm" | "invoiceForm" | "participantDocumentForm"

// interface ParticipantDetailsPaneProps {
//   activePeriod: SelectedPeriod | undefined;
// }
//
// type NonNullable<T> = Exclude<T, null | undefined>;

const ParticipantDetailsPaneComponent: FC = () => {

  const dispatcher = useAppDispatch();
  const selectedParticipant = useAppSelector(selectedParticipantSelector);
  const selectedMeterId = useAppSelector(selectedMeterIdSelector);
  const tenant = useAppSelector(selectedTenant)
  const rates = useAppSelector(ratesSelector);
  const activePeriod = useAppSelector(selectedPeriodSelector);
  const report = useAppSelector(meteringInterReportSelectorV2(selectedParticipant?.id, selectedMeterId))

  const [selectedMeter, setSelectedMeter] = useState<Metering | undefined>(undefined)

  const [activeMenu, setActiveMenu] = useState<DynamicComponentKey>("memberForm")
  // const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod | undefined>(activePeriod)
  // const [activeEnergySeries, setActiveEnergySeries] = useState<MeterEnergySeries|undefined>(report)

  const [toaster] = useIonToast();
  const [participantAlert] = useIonAlert();

  const isMeterNew = () => selectedMeter?.status === 'NEW';
  const isMeterActive = () => selectedMeter?.status === "ACTIVE"
  const isMeterPending = () => selectedMeter?.status === "PENDING"

  const isGenerator = () => selectedMeter?.direction === 'GENERATION';

  useEffect(() => {
    if (selectedMeterId && selectedParticipant) {
      const meter = selectedParticipant.meters.find(m => m.meteringPoint === selectedMeterId)
      if (meter) {
        setSelectedMeter(meter)
      }
    } else {
      setSelectedMeter(undefined)
    }
    // setActiveEnergySeries(report)
  }, [selectedMeterId])

  // useEffect(() => {
  //   if (activePeriod) {
  //     setActiveEnergySeries(report)
  //   }
  // }, [activePeriod])

  console.log("ParticipantDetailsPane: ", activePeriod)

  // const updateSeries = async (selectedPeriod: SelectedPeriod) => {
  //   if (selectedParticipant && selectedMeter) {
  //     return eegService.fetchReportV2(tenant, selectedPeriod.year, selectedPeriod.segment, selectedPeriod.type,
  //       [{
  //         participantId: selectedParticipant.id,
  //         meters: [
  //           {
  //             meterId: selectedMeterId,
  //             meterDir: selectedMeter.direction,
  //             from: new Date(selectedMeter.registeredSince).getTime(),
  //             until: selectedMeter.inactiveSince ? selectedMeter.inactiveSince : new Date().getTime(),
  //           } as MeterReport]
  //       } as ParticipantReport])
  //       .then(res => {
  //         if (res.participantReports.length !== 1) {
  //           throw new Error("Keine Daten gefunden")
  //         }
  //         return res.participantReports[0]
  //       })
  //       .then(rep => {
  //         if (rep.meters[0].meterDir === "CONSUMPTION") {
  //           return rep.meters[0].report.intermediate.consumption.map((c, i) => {
  //             return {
  //               segmentIdx: i,
  //               consumed: c,
  //               allocated: rep.meters[0].report.intermediate.utilization[i]
  //             } as EnergySeries
  //           })
  //         } else {
  //           return rep.meters[0].report.intermediate.production.map((c, i) => {
  //             return {
  //               segmentIdx: i,
  //               consumed: c,
  //               allocated: rep.meters[0].report.intermediate.allocation[i]
  //             } as EnergySeries
  //           })
  //         }
  //       })
  //       .then(s => {
  //         return {
  //           series: s,
  //           period: selectedPeriod
  //         } as MeterEnergySeries
  //       })
  //   }
  //   return activeEnergySeries
  // }
  //
  //
  // const onMeterPeriodSelectionChanged = (selectedPeriod: SelectedPeriod) => {
  //   updateSeries(selectedPeriod).then(r => setActiveEnergySeries(r))
  // }

  const onUpdateParticipant = (participant: EegParticipant) => {
    dispatcher(updateParticipant({tenant, participant})).then(() => console.log("Participant Updated"))
  }

  const dynamicComponent = (componentKey: DynamicComponentKey) => {

    switch (componentKey) {
      case "memberForm":
        return selectedParticipant ? <MemberFormComponent participant={selectedParticipant} rates={rates} formId={""}
                                                          onSubmit={onUpdateParticipant}/> : <></>
      case "meterForm":
        return selectedMeter ? <MeterFormComponent meteringPoint={selectedMeter}/> : <></>
      case "invoiceForm":
        return selectedParticipant ?
          <InvoiceDocumentComponent tenant={tenant} participant={selectedParticipant}/> : <></>
      case "documentForm":
        return selectedParticipant ?
          <ContractDocumentComponent tenant={tenant} participant={selectedParticipant}/> : <></>
      default:
        return <></>
    }
  }

  const presentToast = (message: string) => {
    toaster({
      message: message,
      duration: 3500,
      position: 'bottom'
    });
  };

  function onWillDismiss(participant: EegParticipant, ev: CustomEvent<OverlayEventDetail<FormData>>) {

    const uploadFiles = async (tenant: string, participantId: string, data?: FormData) => {
      if (data) {
        const files = data.getAll("docfiles").map(e => e as File)
        if (files.length > 0) {
          return fileService.uploadContractDocuments(tenant, participantId, files)
        }
      }
      return new Promise<any>((resolve) => resolve(true))
    }

    // if (ev.detail.role === 'confirm' && ev.detail.data) {
    //   const data:FormData = ev.detail.data
    //   fileService.uploadContractDocuments(tenant, participant.id,
    //     data.getAll("docfiles").map(e => e as File)
    //   )
    //     .then(() => dispatcher(confirmParticipant({tenant, participantId: participant.id})).unwrap())
    //     .then((value) => presentToast(`${value.firstname} ist nun Mitglied deiner EEG. Ein Infomail wurde an ${value.contact.email} gesendet.`))
    //     .catch(() => presentToast('Mitglied konnte nicht aktiviert werden.'))
    // }

    if (ev.detail.role === 'confirm') {
      uploadFiles(tenant, participant.id, ev.detail.data)
        .then(() => dispatcher(confirmParticipant({tenant, participantId: participant.id})).unwrap())
        .then((value) => presentToast(`${value.firstname} ist nun Mitglied deiner EEG. Ein Infomail wurde an ${value.contact.email} gesendet.`))
        .catch(() => presentToast('Mitglied konnte nicht aktiviert werden.'))
    }

    // clearAll();
    // setIsActivationActive(undefined);
  }

  const meterStatusText = (meter: Metering) => {
    switch (meter.status) {
      case 'NEW':
        return "Antwort des Netzbetreibers noch ausstehend"
      case 'PENDING':
        return "Zustimmung des Mitglieds noch ausstehend"
      case 'APPROVED':
        return "Abschluss Meldung von Netzbetreiber noch ausstehend"
      case 'REJECTED':
        return "Zählpunkt wurde vom Netzbetreiber abgewiesen"
      case 'REVOKED':
        return "Zählpunkt wurde vom Netzbetreiber aufgehoben"
      case 'INVALID':
        return "Zählpunkt wurde vom Netzbetreiber nicht angenommen"
      default:
        return ""
    }
  }

  const calcXAxisName = (i: number, period: SelectedPeriod) => {
    let offset = 0
    switch (period && period.type) {
      case 'YH':
        if (period.segment === 1 && i === 0) offset = 52
        else if (period.segment === 2) offset = GetWeek(new Date(period.year, 6,1,0,0,1))
        // return i > 0 && i <= 12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        return `${i+offset} KWo`
      case 'YQ':
        // return i > 0 && i <= 12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        if (period.segment === 1 && i === 0) {
          offset = 52
        } else if (period.segment === 2) {
          offset = GetWeek(new Date(period.year, 3,1,0,0,1))
        } else if (period.segment === 3) {
          offset = GetWeek(new Date(period.year, 6,1,0,0,1))
        } else if (period.segment === 4) {
          offset = GetWeek(new Date(period.year, 9,1,0,0,1))
        }
        return `${i+offset} KWo`
      case 'YM':
        return `${i+1}`
      case 'Y' :
        return i >= 0 && i < 12 ? `${MONTHNAME[i+1].substring(0, 3)}` : `${i}`
    }
  }
// const isPeriodSelected = (periodType: string) => selectedPeriod?.type === periodType

  if (!selectedParticipant) {
    return <></>
  }

  const onRemoveMeteringPoint = () => {
    if (selectedMeter && selectedParticipant) {
      dispatcher(removeMeteringPoint(
        {tenant: tenant, participantId: selectedParticipant.id, meter: selectedMeter}))
    }
  }

  const archive = () => {
    participantAlert({
      subHeader: "Mitglied archivieren",
      message: "Das Mitglied ist nach dem ARCHIVIERUNG'S Prozess in deiner Übersicht nicht mehr verhanden.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
      onDidDismiss: (e: CustomEvent) => {
        if (e.detail.role === 'confirm') {
          dispatcher(archiveParticipant({participant: selectedParticipant, tenant: tenant}))
            .unwrap()
            .catch(() => {
              toaster({
                message: 'Mitglied konnte nicht gelöscht werden. Bitte kontaktieren Sie ihren Administrator.',
                duration: 4500,
                color: "danger"
              })
            })
        }
      },
    })
  }

  return (
    <div className={"details-body"} style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <div className={"details-header"}>
        <div><h4>{selectedParticipant.firstname} {selectedParticipant.lastname}</h4></div>
        <IonItem button lines="none" style={{fontSize: "12px", marginRight: "60px"}} className={"participant-header"}
                 onClick={() => archive()}>
          <IonIcon icon={trashBin} slot="start" style={{marginRight: "10px", fontSize: "16px"}}></IonIcon>
          <IonLabel>Benutzer archivieren</IonLabel>
        </IonItem>
      </div>
      <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
        <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
          <div className={"details-box"}>
            {(selectedParticipant.status === 'NEW' || selectedParticipant.status === 'PENDING') ? (
              <div style={{color: "black"}}>
                <AllowParticipantDialog trigger="open-participant-allow-dialog" participant={selectedParticipant}
                                        onDismiss={onWillDismiss}/>
                <IonCard color="warning-light">
                  <IonItem lines="none" color="warning-light">
                    <IonIcon icon={eegStar} slot="start"/>
                    <IonLabel>Möchtest du {selectedParticipant.lastname} in deine EEG aufnehmen?</IonLabel>
                  </IonItem>
                  <IonItem lines="none" color="warning-light">
                    <IonButton id="open-participant-allow-dialog" slot="end" color="warning" size="default">Ja,
                      Zulassen</IonButton>
                  </IonItem>
                </IonCard>
              </div>) : (<></>)}
            <div>
              <IonItem button lines="full" className={cn("eeg-item-box", {"selected": activeMenu === "memberForm"})}
                       onClick={() => setActiveMenu("memberForm")}>
                <IonIcon icon={person} slot="start"></IonIcon>
                <IonLabel>
                  <div className={"detail-header"}>Details</div>
                  <div className={"detail-subheader"}>Kontakt, Adresse, Bankdaten, ...</div>
                </IonLabel>
              </IonItem>
            </div>
            <div>
              <IonItem button lines="full" className={cn("eeg-item-box", {"selected": activeMenu === "documentForm"})}
                       onClick={() => setActiveMenu("documentForm")}>
                <IonIcon icon={documentTextOutline} slot="start"></IonIcon>
                <div>
                  <div className={"detail-header"}>Dokumente</div>
                  <div className={"detail-subheader"}>z.B. Verträge</div>
                </div>
              </IonItem>
            </div>
            <div>
              <IonItem button lines="full" className={cn("eeg-item-box", {"selected": activeMenu === "invoiceForm"})}
                       onClick={() => setActiveMenu("invoiceForm")}>
                <IonIcon icon={logoEuro} slot="start"></IonIcon>
                <IonLabel>
                  <div className={"detail-header"}>Meine Rechnungen</div>
                </IonLabel>
              </IonItem>
            </div>
            <div>
              <IonItem lines="full" className={"eeg-item-box"}>
                <IonIcon icon={eegShieldCrown} slot="start"></IonIcon>
                <div>
                  <div
                    className={"detail-header"}>{`Mitglied ist ${selectedParticipant?.role === 'EEG_USER' ? 'kein' : ''} Administrator`}</div>
                </div>
                <IonToggle slot="end" checked={selectedParticipant?.role !== 'EEG_USER'} disabled={true}></IonToggle>
              </IonItem>
            </div>
          </div>
          <div className={"details-box"}>
            {selectedMeter ? (
                <div className="ion-padding" slot="content">
                  <IonToolbar
                    color="primary"><IonTitle>{formatMeteringPointString(selectedMeter.meteringPoint)}</IonTitle></IonToolbar>

                  {!isMeterActive() &&
                      <IonCard color="warning-light">
                          <IonItem lines="none" color="warning-light">
                              <IonIcon icon={eegSandClass} slot="start"/>
                              <IonLabel>{meterStatusText(selectedMeter)}</IonLabel>
                          </IonItem>
                        {selectedMeter.status === "INVALID" &&
                            <IonItem>
                                <IonButton color="warning" slot="end" size="small" fill="outline"
                                           onClick={() => onRemoveMeteringPoint()}>Löschen</IonButton>
                            </IonItem>
                        }
                      </IonCard>
                  }

                  <IonItem button lines="full"
                           className={cn("eeg-item-box", {"selected": activeMenu === "meterForm"})}
                           onClick={() => setActiveMenu("meterForm")}>
                    <IonIcon icon={isGenerator() ? eegSolar : eegPlug} slot="start"></IonIcon>
                    <div>
                      <div className={"detail-header"}>Details und Adresse</div>
                    </div>
                  </IonItem>
                  <IonItem lines="full" className={"eeg-item-box"} disabled={isMeterNew()}>
                    <IonIcon icon={caretForwardOutline} slot="start"></IonIcon>
                    <div>
                      <div
                        className={"detail-header"}>{`Zählpunkt ${selectedMeter.status === "ACTIVE" ? "aktiv" : "inaktiv"}`}</div>
                    </div>
                    <IonToggle slot="end" checked={selectedMeter.status === "ACTIVE"} disabled={true}></IonToggle>
                  </IonItem>
                  {isMeterActive() && <MeterChartComponent report={report} tenant={tenant} activePeriod={activePeriod} selectedMeter={selectedMeter} selectedParticipant={selectedParticipant}/>}
                  {/*{isMeterActive() && activePeriod && selectedMeterId && <div style={{marginLeft: "20px"}}>*/}
                  {/*    <h4>Energiedaten</h4>*/}
                  {/*    <MeterChartNavbarComponent*/}
                  {/*        activePeriod={activePeriod}*/}
                  {/*        selectedMeterId={selectedMeterId}*/}
                  {/*        onSelectionChanged={onMeterPeriodSelectionChanged}/>*/}
                  {/*</div>}*/}
                  {/*{isMeterActive() && activeEnergySeries && activeEnergySeries.series && activeEnergySeries.series.length > 0 &&*/}
                  {/*    <div style={{height: "200px", width: "100%"}}>*/}
                  {/*        <ResponsiveContainer width="90%" height={200}>*/}
                  {/*            <BarChart*/}
                  {/*                width={500}*/}
                  {/*                height={300}*/}
                  {/*                data={activeEnergySeries.series.map((e, i) => {*/}
                  {/*                  return {*/}
                  {/*                    name: calcXAxisName(e.segmentIdx, activeEnergySeries.period),*/}
                  {/*                    distributed: e.allocated,*/}
                  {/*                    consumed: e.consumed*/}
                  {/*                  }*/}
                  {/*                })}*/}
                  {/*                margin={{*/}
                  {/*                  top: 5,*/}
                  {/*                  right: 30,*/}
                  {/*                  left: 20,*/}
                  {/*                  bottom: 5,*/}
                  {/*                }}*/}
                  {/*                barCategoryGap={0}*/}
                  {/*                barGap={1}*/}
                  {/*            >*/}
                  {/*                <CartesianGrid strokeDasharray="3 3"/>*/}
                  {/*                <XAxis dataKey="name"/>*/}
                  {/*                <YAxis fontSize={10} unit={" kWh"}/>*/}
                  {/*                <Tooltip formatter={(value) => Number(value).toFixed(3) + " kWh"}/>*/}
                  {/*                <Legend/>*/}
                  {/*                <Bar name="EEG" dataKey="distributed" fill="#8884d8"/>*/}
                  {/*                <Bar name="EVU" dataKey="consumed" fill="#82ca9d"/>*/}
                  {/*            </BarChart>*/}

                  {/*        </ResponsiveContainer>*/}
                  {/*    </div>}*/}
                </div>) :
              <></>
            }
          </div>
        </div>
        <div className="pane-content-details">
          <div className="pane-content-details-content">
            {dynamicComponent(activeMenu)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantDetailsPaneComponent;