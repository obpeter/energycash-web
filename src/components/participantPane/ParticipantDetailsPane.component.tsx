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
  IonToolbar, useIonToast
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
  confirmParticipant, removeMeteringPoint,
  selectedMeterIdSelector,
  selectedParticipantSelector,
  updateParticipant
} from "../../store/participant";
import {formatMeteringPointString} from "../../util/Helper.util";
import {selectedTenant} from "../../store/eeg";
import AllowParticipantDialog from "../dialogs/AllowParticipant.dialog";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import InvoiceDocumentComponent from "./InvoiceDocument.component";
import {MeterEnergySeries, SelectedPeriod} from "../../models/energy.model";
import {eegService} from "../../service/eeg.service";
import {MONTHNAME} from "../../models/eeg.model";
import MeterChartNavbarComponent from "../MeterChartNavbar.component";
import ContractDocumentComponent from "./ContractDocument.component";
import participants from "../../pages/Participants";
import {ratesSelector} from "../../store/rate";

type DynamicComponentKey = "memberForm" | "meterForm" | "documentForm" | "invoiceForm" | "participantDocumentForm"
interface ParticipantDetailsPaneProps {
  periods: { begin: string, end: string };
  activePeriod: SelectedPeriod | undefined;
}

const ParticipantDetailsPaneComponent: FC<ParticipantDetailsPaneProps> = ({periods, activePeriod}) => {

  const dispatcher = useAppDispatch();
  const selectedParticipant = useAppSelector(selectedParticipantSelector);
  const selectedMeterId = useAppSelector(selectedMeterIdSelector);
  const tenant = useAppSelector(selectedTenant)
  const rates = useAppSelector(ratesSelector);

  const [selectedMeter, setSelectedMeter] = useState<Metering | undefined>(undefined)

  const [activeMenu, setActiveMenu] = useState<DynamicComponentKey>("memberForm")
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod|undefined>(activePeriod)
  const [activeEnergySeries, setActiveEnergySeries] = useState<MeterEnergySeries>({} as MeterEnergySeries)

  const [toaster] = useIonToast();

  const isMeterNew = () => selectedMeter?.status === 'NEW';
  const isMeterActive = () => selectedMeter?.status === "ACTIVE"
  const isMeterPending = () => selectedMeter?.status === "PENDING"

  const isGenerator = () => selectedMeter?.direction === 'GENERATION';

  useEffect(() => {
    if (selectedMeterId) {
      const meter = selectedParticipant?.meters.find(m => m.meteringPoint === selectedMeterId)
      if (meter) {
        setSelectedMeter(meter)
      }
    } else {
      setSelectedMeter(undefined)
    }

  }, [selectedMeterId])

  useEffect(() => {
    // setActiveEnergySeries(energySeries)
    setSelectedPeriod(activePeriod)
  }, [activePeriod])

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
        return selectedParticipant ? <InvoiceDocumentComponent tenant={tenant} participant={selectedParticipant}/> : <></>
      case "documentForm":
        return selectedParticipant ? <ContractDocumentComponent tenant={tenant} participant={selectedParticipant}/> : <></>
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
    if (ev.detail.role === 'confirm' && ev.detail.data) {
      const data:FormData = ev.detail.data
      eegService.uploadContractDocuments(tenant, participant.id, data.getAll("docfiles")
        .map(e => e as File))
        .then(() => dispatcher(confirmParticipant({tenant, participantId: participant.id, data: data})))
      presentToast(`${participant.firstname} ist nun Mitglied deiner EEG. Ein Infomail wurde an ${participant.contact.email} gesendet.`)
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
      switch (period && period.type) {
        case 'YH': return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        case 'YQ': return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        case 'YM': return `${i}`
        case 'Y' : return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
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

  return (
    <div className={"details-body"} style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <div className={"details-header"}>
        <div><h4>{selectedParticipant.firstname} {selectedParticipant.lastname}</h4></div>
        <IonItem lines="none" style={{fontSize: "12px", marginRight: "60px"}} className={"participant-header"}>
          <IonIcon icon={trashBin} slot="start" style={{marginRight: "10px", fontSize: "16px"}}></IonIcon>
          <IonLabel>Benutzer archivieren</IonLabel>
        </IonItem>
      </div>
      <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
        <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
          <div className={"details-box"}>
            {(selectedParticipant.status === 'NEW' || selectedParticipant.status === 'PENDING') ? (
            <div style={{color: "black"}}>
              <AllowParticipantDialog trigger="open-participant-allow-dialog" participant={selectedParticipant} onDismiss={onWillDismiss}/>
              <IonCard color="warning-light">
                <IonItem lines="none" color="warning-light">
                  <IonIcon icon={eegStar} slot="start"/>
                  <IonLabel>Möchtest du {selectedParticipant.lastname} in deine EEG aufnehmen?</IonLabel>
                </IonItem>
                <IonItem lines="none" color="warning-light">
                  <IonButton id="open-participant-allow-dialog" slot="end" color="warning" size="default">Ja, Zulassen</IonButton>
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
            { selectedMeter ? (
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
                        <IonButton color="warning" slot="end" size="small" fill = "outline"
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
              {isMeterActive() && activePeriod && selectedMeterId && <div style={{marginLeft: "20px"}}>
                <h4>Energiedaten</h4>
                <MeterChartNavbarComponent
                  periods={periods}
                  activePeriod={activePeriod}
                  tenant={tenant}
                  selectedMeterId={selectedMeterId}
                  setEnergySeries={setActiveEnergySeries} />
              </div> }
              {isMeterActive() && activeEnergySeries && activeEnergySeries.series && activeEnergySeries.series.length > 0 && <div style={{height: "200px", width: "100%"}}>
                <ResponsiveContainer width="90%" height={200}>
                  <BarChart
                    width={500}
                    height={300}
                    data={activeEnergySeries.series.map((e, i) => {
                      return {name: calcXAxisName(e.segmentIdx, activeEnergySeries.period), distributed: e.allocated, consumed: e.consumed}
                    })}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barCategoryGap={0}
                    barGap={1}
                  >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis fontSize={10} unit={" kWh"}/>
                    <Tooltip formatter={(value) => Number(value).toFixed(3) + " kWh"}/>
                    <Legend/>
                    <Bar name="EEG" dataKey="distributed" fill="#8884d8"/>
                    <Bar name="EVU" dataKey="consumed" fill="#82ca9d"/>
                  </BarChart>

                </ResponsiveContainer>
              </div> }
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