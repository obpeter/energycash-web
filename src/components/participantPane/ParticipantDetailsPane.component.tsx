import React, {FC, MouseEventHandler, useEffect, useRef, useState} from "react";
import {EegParticipant} from "../../models/members.model";
import cn from "classnames";

import "./ParticipantDetailsPane.compoenent.css"
import {
  AccordionGroupCustomEvent,
  IonAccordion,
  IonAccordionGroup,
  IonBadge, IonButton, IonButtons, IonCard,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel, IonThumbnail,
  IonTitle,
  IonToggle,
  IonToolbar, useIonToast
} from "@ionic/react";
import {
  add,
  caretForwardOutline,
  documentTextOutline,
  logoEuro,
  person,
  star, starHalf,
  syncOutline,
  trashBin
} from "ionicons/icons";
import {eegPlug, eegSandClass, eegShieldCrown, eegSolar, eegStar} from "../../eegIcons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useAppDispatch, useAppSelector} from "../../store";
import {energySeriesByMeter} from "../../store/energy";
import {Metering} from "../../models/meteringpoint.model";
import MemberFormComponent from "../MemberForm.component";
import MeterFormComponent from "../MeterForm.component";
import {
  confirmParticipant,
  selectedMeterIdSelector,
  selectedParticipantSelector,
  selectMetering,
  selectParticipant, updateParticipant
} from "../../store/participant";
import {createNewPeriod, formatMeteringPointString} from "../../util/Helper.util";
import participants from "../../pages/Participants";
import {selectedTenant} from "../../store/eeg";
import AllowParticipantDialog from "../dialogs/AllowParticipant.dialog";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import InvoiceDocumentComponent from "../InvoiceDocument.component";
import PeriodSelectorElement from "../core/PeriodSelector.element";
import {EegEnergyReport, MeterEnergySeries, SelectedPeriod} from "../../models/energy.model";
import {eegService} from "../../service/eeg.service";
import {MONTHNAME} from "../../models/eeg.model";
import MeterChartNavbarComponent from "../MeterChartNavbar.component";

type DynamicComponentKey = "memberForm" | "meterForm" | "documentForm" | "invoiceForm"
// interface DynamicComponentProps {
//   componentKey: DynamicComponentKey;
//   args: any
// }
// const DynamicComponent: React.FC<DynamicComponentProps> = ({componentKey, args}) => {
//   // const [Component, setComponent] = useState<any>();
//   const COMPONENTS: {[key: string]: React.FC<any>} = {
//     memberForm: MemberFormComponent,
//     meterForm: MeterFormComponent,
//   };
//   const Component = COMPONENTS[componentKey];
//   // useEffect(() => {
//   //   if (componentKey) setComponent(COMPONENTS[componentKey])
//   // }, [componentKey]);
//
//   console.log("Update Details", args);
//
//   return Component ? React.createElement(Component, args) : null;
// };


interface DynamicComponentProps {
  selectedParticipant: EegParticipant;
  componentKey: DynamicComponentKey
}

interface ParticipantDetailsPaneProps {
  periods: { begin: string, end: string };
  activePeriod: SelectedPeriod | undefined;
}

const ParticipantDetailsPaneComponent: FC<ParticipantDetailsPaneProps> = ({periods, activePeriod}) => {

  // const {selectedParticipant} = props;
  const dispatcher = useAppDispatch();
  const selectedParticipant = useAppSelector(selectedParticipantSelector);
  const selectedMeterId = useAppSelector(selectedMeterIdSelector);
  const tenant = useAppSelector(selectedTenant)

  // const selectedMeter: Metering | undefined = {} as Metering
  const [selectedMeter, setSelectedMeter] = useState<Metering | undefined>(undefined)

  // const energySeries = useAppSelector(energySeriesByMeter(selectedMeter?.meteringPoint!))

  const [activeMenu, setActiveMenu] = useState<DynamicComponentKey>("memberForm")
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod|undefined>(activePeriod)
  const [activeEnergySeries, setActiveEnergySeries] = useState<MeterEnergySeries>({} as MeterEnergySeries)

  const [toaster] = useIonToast();


  // const [dynamicComponent, setDynamicComponent] =
  //   useState<DynamicComponentProps>({componentKey: "memberForm", args: {participant: selectedParticipant, formId:"", onSubmit: (e:any) => console.log("update", e)}})

  const isMeterNew = () => selectedMeter?.status === 'NEW';
  const isMeterActive = () => selectedMeter?.status === "ACTIVE"
  const isMeterPending = () => selectedMeter?.status === "PENDING"

  const isGenerator = () => selectedMeter?.direction === 'GENERATION';

  // useEffect(() => {
  //   console.log("select Details", selectedParticipant);
  //   switch (activeMenu) {
  //     case 1:
  //       setDynamicComponent((oldState) => {
  //         return {componentKey: "memberForm", args: {participant: selectedParticipant, formId:"", onSubmit: (e:any) => console.log("update", e)}}
  //       });
  //       break;
  //     case 2:
  //       setDynamicComponent({componentKey: "meterForm", args: {meteringPoint: selectedMeter}});
  //       break;
  //   }
  //
  // }, [activeMenu, selectedParticipant])

  // useEffect(() => {
  //   if (selectedParticipant && selectedParticipant.meters && selectedParticipant.meters.length > 0) {
  //     // setSelectedMeter(selectedParticipant.meters[0])
  //
  //     if (selectedMeter) {
  //       let m = selectedParticipant.meters.find(m => m.meteringPoint === selectedMeter.meteringPoint)
  //       if (!m) {
  //         m = selectedParticipant.meters[0]
  //       }
  //       setSelectedMeter(m)
  //
  //       if (accordionGroup && accordionGroup.current) {
  //         accordionGroup.current.value = selectedMeter.meteringPoint
  //       }
  //     } else {
  //       setSelectedMeter(selectedParticipant.meters[0])
  //     }
  //   }
  // }, [selectedParticipant])

  useEffect(() => {
    if (selectedMeterId) {
      const meter = selectedParticipant.meters.find(m => m.meteringPoint === selectedMeterId)
      if (meter) {
        console.log("Set updated Meter: ", meter)
        setSelectedMeter(meter)
      }
    }

  }, [selectedMeterId])

  useEffect(() => {
    // setActiveEnergySeries(energySeries)
    setSelectedPeriod(activePeriod)
  }, [activePeriod])

  type detailsComponentKey = "COMPONENT_A" | "COMPONENT_B"
  const COMPONENTS: { [key: string]: React.FC<any> } = {
    COMPONENT_A: MemberFormComponent,
    COMPONENT_B: MeterFormComponent,
  };

  // type detailsComponentTypes = "memberForm" | "meterForm"
  // const detailsComponents = {
  //   memberForm: MemberFormComponent,
  //   meterForm: MeterFormComponent
  // };

  const detailC = (name: detailsComponentKey, props: any) => {
    if (typeof COMPONENTS[name] !== "undefined") {
      return React.createElement(COMPONENTS[name], props)
    }
  }

  const switchMeter = (ev: AccordionGroupCustomEvent) => {
    // setActiveMenu("meterForm")

    if (selectedParticipant && selectedParticipant.meters) {
      const m = selectedParticipant.meters.find(m => m.meteringPoint === ev.detail.value)
      setSelectedMeter(m)
    } else {
      setSelectedMeter(undefined)
    }
  }

  // const calcSelectedEnergySeries = (report: EegEnergyReport) => {
  //   const meta = selectedMeterId ? report.eeg.meta.find(m => m.name === selectedMeterId) : undefined
  //   return report.eeg.intermediateReportResults.map(r =>
  //     (meta && r.allocated.length > meta.sourceIdx) ?
  //       { allocated: meta.dir === "CONSUMPTION" ? r.allocated[meta.sourceIdx] : r.distributed[meta.sourceIdx],
  //         consumed: meta.dir === "CONSUMPTION" ? r.consumed[meta.sourceIdx] : r.produced[meta.sourceIdx] } as {allocated: number, consumed: number} :
  //       { allocated: 0, consumed: 0 } as {allocated: number, consumed: number})
  // }

  const onUpdateParticipant = (participant: EegParticipant) => {
    dispatcher(updateParticipant({tenant, participant}))
  }

  const dynamicComponent = (componentKey: DynamicComponentKey) => {

    switch (componentKey) {
      case "memberForm":
        return <MemberFormComponent participant={selectedParticipant} formId={""}
                                    onSubmit={onUpdateParticipant}/>
      case "meterForm":
        if (selectedMeter) {
          return <MeterFormComponent meteringPoint={selectedMeter}/>
        } else {
          return <></>
        }
      case "invoiceForm":
        return <InvoiceDocumentComponent tenant={tenant} participant={selectedParticipant}/>
      case "documentForm":
        return <></>
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
      dispatcher(confirmParticipant({tenant, participantId: participant.id, data: ev.detail.data}))
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
      default:
        return ""
    }
  }

  // const onChangePeriod = (selectedPeriod: SelectedPeriod | undefined)  =>{
  //   if (selectedPeriod) {
  //     eegService.fetchReport(tenant, selectedPeriod.year, selectedPeriod.segment, selectedPeriod.type)
  //       .then((r) => calcSelectedEnergySeries(r))
  //       .then((r) => setActiveEnergySeries(r))
  //       .then(() => setSelectedPeriod(selectedPeriod))
  //   }
  // }

  // const changePeriod = (selectedPeriod: SelectedPeriod | undefined) => (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
  //   setSelectedPeriod(selectedPeriod)
  // }

  const calcXAxisName = (i: number, period: SelectedPeriod) => {
      switch (period && period.type) {
        // case 'YH': return i > 0 && i<=6 ? `${MONTHNAME[(period.segment*6)-(6-i)].substring(0, 3)}` : `${i}`
        // case 'YQ': return i > 0 && i<=3 ? `${MONTHNAME[(period.segment*3)-(3-i)].substring(0, 3)}` : `${i}`
        case 'YH': return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        case 'YQ': return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
        case 'YM': return `${i}`
        case 'Y' : return i > 0 && i<=12 ? `${MONTHNAME[i].substring(0, 3)}` : `${i}`
      }
  }
  // const isPeriodSelected = (periodType: string) => selectedPeriod?.type === periodType

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
            <div>
              <IonItem lines="full" className={"eeg-item-box"}>
                <IonIcon icon={caretForwardOutline} slot="start"></IonIcon>
                <div>
                  <div className={"detail-header"}>Mitglied aktiv</div>
                </div>
                <IonToggle slot="end" checked={selectedParticipant?.status === 'ACTIVE'} disabled={true}></IonToggle>
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
                  </IonCard>
              }

              <IonItem lines="full" className={"eeg-item-box"} disabled={isMeterNew()}>
                <IonIcon icon={caretForwardOutline} slot="start"></IonIcon>
                <div>
                  <div
                    className={"detail-header"}>{`Zählpunkt ${selectedMeter.status === "ACTIVE" ? "aktiv" : "inaktiv"}`}</div>
                </div>
                <IonToggle slot="end" checked={selectedMeter.status === "ACTIVE"} disabled={true}></IonToggle>
              </IonItem>
              <IonItem button lines="full"
                       className={cn("eeg-item-box", {"selected": activeMenu === "meterForm"})}
                       onClick={() => setActiveMenu("meterForm")}>
                <IonIcon icon={isGenerator() ? eegSolar : eegPlug} slot="start"></IonIcon>
                <div>
                  <div className={"detail-header"}>Details und Adresse</div>
                </div>
              </IonItem>
              <IonItem lines="full" className={"eeg-item-box"}>
                <IonIcon icon={documentTextOutline} slot="start"></IonIcon>
                <div>
                  <div className={"detail-header"}>Dokumente</div>
                  <div className={"detail-subheader"}>z.B. Verträge</div>
                </div>
              </IonItem>
              {isMeterActive() && activePeriod && selectedMeterId && <div style={{marginLeft: "20px"}}>
                <h4>Energiedaten</h4>
                <MeterChartNavbarComponent
                  periods={periods}
                  activePeriod={activePeriod}
                  tenant={tenant}
                  selectedMeterId={selectedMeterId}
                  setEnergySeries={setActiveEnergySeries} />
                {/*<div style={{display: "flex", alignItems: "center", justifyContent: "space-around"}}>*/}
                {/*  <div>*/}
                {/*    <IonButtons>*/}
                {/*      {(["Y", "YH", "YQ", "YM"] as ('YH' | "YQ" | 'YM' | 'Y')[]).map((p, i) => (*/}
                {/*        <IonButton*/}
                {/*          key={i}*/}
                {/*          onClick={() => onChangePeriod(createNewPeriod(selectedPeriod, p))}*/}
                {/*          shape="round"*/}
                {/*          size="small"*/}
                {/*          className="stateButton"*/}
                {/*          fill={isPeriodSelected(p) ? "solid" : undefined}*/}
                {/*          color={isPeriodSelected(p) ? 'success' : undefined}>*/}
                {/*          {p}*/}
                {/*        </IonButton>*/}
                {/*      ))}*/}
                {/*    </IonButtons>*/}
                {/*  </div>*/}
                {/*  <div>*/}
                {/*    <PeriodSelectorElement periods={periods} activePeriod={selectedPeriod} onUpdatePeriod={onChangePeriod} />*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div> }
              {/*<div style={{display: "flex", height: "300px", width: "100%"}}>*/}
              {isMeterActive() && activeEnergySeries && activeEnergySeries.series && activeEnergySeries.series.length > 0 && <div style={{height: "200px", width: "100%"}}>
                <ResponsiveContainer width="90%" height={200}>
                  {/*<LineChart width={600} height={300} data={energySeries.map((e, i) => {*/}
                  {/*  return {name: "" + (i + 1), distributed: e.allocated, consumed: e.consumed}*/}
                  {/*})} margin={{top: 15, right: 15, bottom: 35, left: 0}}>*/}
                  {/*  <YAxis fontSize={10} unit={" kW"}/>*/}
                  {/*  <CartesianGrid strokeDasharray="3 3"/>*/}
                  {/*  <XAxis dataKey="name" angle={315} tickMargin={5} fontSize={10}/>*/}
                  {/*  <Tooltip/>*/}
                  {/*  <Legend align={'center'} verticalAlign={'bottom'} height={40} fontSize={"4px"}/>*/}
                  {/*  <Line name="EEG" type="monotone" dataKey="distributed" stroke="#20c997" strokeWidth={1} fontSize={6} activeDot={false} dot={false}/>*/}
                  {/*  <Line name="Netz" type="monotone" dataKey="consumed" stroke="#000000" strokeWidth={1} fontSize={6} activeDot={false} dot={false}/>*/}
                  {/*</LineChart>*/}
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