import React, {FC, useEffect, useRef, useState} from "react";
import {EegParticipant} from "../models/members.model";
import cn from "classnames";

import "./ParticipantDetailsPane.compoenent.css"
import {
  AccordionGroupCustomEvent,
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToggle,
  IonToolbar
} from "@ionic/react";
import {add, caretForwardOutline, documentTextOutline, person, syncOutline, trashBin} from "ionicons/icons";
import {eegPlug, eegShieldCrown, eegSolar} from "../eegIcons";
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
import {useAppSelector} from "../store";
import {energySeriesByMeter} from "../store/energy";
import {Metering} from "../models/meteringpoint.model";
import MemberFormComponent from "./MemberForm.component";
import MeterFormComponent from "./MeterForm.component";
import {
  selectedMeterIdSelector,
  selectedParticipantSelector,
  selectMetering,
  selectParticipant
} from "../store/participant";
import {formatMeteringPointString} from "../util/Helper.util";
import participants from "../pages/Participants";

type DynamicComponentKey = "memberForm" | "meterForm"
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
  selectedParticipant: EegParticipant
}

const ParticipantDetailsPaneComponent: FC = () => {

  // const {selectedParticipant} = props;
  const selectedParticipant = useAppSelector(selectedParticipantSelector);

  const selectedMeterId = useAppSelector(selectedMeterIdSelector)

  // const selectedMeter: Metering | undefined = {} as Metering
  const [selectedMeter, setSelectedMeter] = useState<Metering | undefined>(undefined)

  const energySeries = useAppSelector(energySeriesByMeter(selectedMeter?.meteringPoint!))

  const [activeMenu, setActiveMenu] = useState<DynamicComponentKey>("memberForm")

  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

  // const [dynamicComponent, setDynamicComponent] =
  //   useState<DynamicComponentProps>({componentKey: "memberForm", args: {participant: selectedParticipant, formId:"", onSubmit: (e:any) => console.log("update", e)}})

  const isMeterPending = () => selectedMeter?.status === 'NEW';
  const isGenerator = () => selectedMeter?.direction === 'GENERATOR';

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

  useEffect(() => {
    if (selectedParticipant && selectedParticipant.meters && selectedParticipant.meters.length > 0) {
      // setSelectedMeter(selectedParticipant.meters[0])

      if (selectedMeter) {
        let m = selectedParticipant.meters.find(m => m.meteringPoint === selectedMeter.meteringPoint)
        if (!m) {
          m = selectedParticipant.meters[0]
        }
        setSelectedMeter(m)

        if (accordionGroup && accordionGroup.current) {
          accordionGroup.current.value = selectedMeter.meteringPoint
        }
      } else {
        setSelectedMeter(selectedParticipant.meters[0])
      }
    }
  }, [selectedParticipant])

  useEffect(() => {
    if (selectedMeterId) {
      const meter = selectedParticipant.meters.find(m => m.meteringPoint === selectedMeterId)
      if (meter) {
        setSelectedMeter(meter)
      }
    }

  }, [selectedMeterId])

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

  const accordionGroupChange = (ev: AccordionGroupCustomEvent) => {

  }
  const dynamicComponent = (componentKey: DynamicComponentKey) => {

    switch (componentKey) {
      case "memberForm":
        return <MemberFormComponent participant={selectedParticipant} formId={""}
                                    onSubmit={(e) => console.log("update", e)}/>
      case "meterForm":
        if (selectedMeter) {
          return <MeterFormComponent meteringPoint={selectedMeter}/>
        } else {
          return <></>
        }
      default:
        return <></>
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
        <IonFab horizontal="end">
          <IonFabButton size="small" routerLink="/page/addParticipant" routerDirection="root">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </div>
      <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
        <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
          <div className={"details-box"}>
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
            <IonAccordionGroup onIonChange={switchMeter} ref={accordionGroup}>
              {selectedParticipant && selectedParticipant.meters && selectedParticipant.meters.map((m, i) =>
                <IonAccordion key={i} value={m.meteringPoint}>
                  {/*<IonItem slot="header" color="light">*/}
                  {/*  <IonLabel>{m.meteringPoint}</IonLabel>*/}
                  {/*</IonItem>*/}
                  <IonItem slot="header" color="primary" lines="full"><IonTitle>{formatMeteringPointString(m.meteringPoint)}</IonTitle></IonItem>
                  <div className="ion-padding" slot="content">
                    {/*<IonToolbar*/}
                    {/*  color="primary"><IonTitle>{formatMeteringPointString(m.meteringPoint)}</IonTitle></IonToolbar>*/}
                    <IonItem lines="full" className={"eeg-item-box"} disabled={isMeterPending()}>
                      <IonIcon icon={caretForwardOutline} slot="start"></IonIcon>
                      <div>
                        <div
                          className={"detail-header"}>{`Zählpunkt ${m.status === "ACTIVE" ? "aktiv" : "inaktiv"}`}</div>
                      </div>
                      <IonToggle slot="end" checked={m.status === "ACTIVE"}></IonToggle>
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
                    <IonItem lines="full" className={"eeg-item-box"} onClick={() => console.log("onSyncMeterpoint")}>
                      <IonIcon icon={syncOutline} slot="start"></IonIcon>
                      <div>
                        <div className={"detail-header"}>Synchronisieren</div>
                        <div className={"detail-subheader"}>mit Energieprovider</div>
                      </div>
                    </IonItem>
                    <div style={{marginLeft: "20px"}}><h4>Verbrauch</h4></div>
                    {/*<div style={{display: "flex", height: "300px", width: "100%"}}>*/}
                    <div style={{height: "300px", width: "100%"}}>
                      <ResponsiveContainer width="90%" height={300}>
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
                          data={energySeries.map((e, i) => {
                            return {name: "" + (i + 1), distributed: e.allocated, consumed: e.consumed}
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
                          <Tooltip/>
                          <Legend/>
                          <Bar name="EEG" dataKey="distributed" fill="#8884d8"/>
                          <Bar name="Netz" dataKey="consumed" fill="#82ca9d"/>
                        </BarChart>

                      </ResponsiveContainer>
                    </div>
                  </div>
                </IonAccordion>
              )}
            </IonAccordionGroup>
          </div>
        </div>
        <div className="pane-content-details">
          <div className="pane-content-details-content">
            {/*<MemberFormComponent participant={selectedParticipant} formId={""} onSubmit={(e) => console.log("update", e)}/>*/}
            {dynamicComponent(activeMenu)}
            {/*{detailC("COMPONENT_A", {participant: selectedParticipant, formId:"", onSubmit: (e:any) => console.log("update", e)})}*/}
            {/*<MemberFormComponent participant={selectedParticipant} formId={""} onSubmit={(e) => console.log("update", e)}/>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantDetailsPaneComponent;