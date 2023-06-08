import React, {FC, startTransition, useContext, useEffect, useRef, useState} from "react";

import {EegParticipant} from "../../models/members.model";
import {
  CheckboxCustomEvent,
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonToolbar,
  SelectCustomEvent,
  useIonAlert, useIonLoading, useIonPopover
} from "@ionic/react";
import {CheckboxChangeEventDetail} from "@ionic/core";
import {IonCheckboxCustomEvent} from "@ionic/core/dist/types/components";
import {SelectedPeriod} from "../../models/energy.model";
import PeriodSelectorComponent from "../PeriodSelector.component";
import MemberComponent from "./Member.component";
import {ClearingPreviewRequest, Metering, ParticipantBillType} from "../../models/meteringpoint.model";
import MeterCardComponent from "./MeterCard.component";
import {ParticipantContext} from "../../store/hook/ParticipantProvider";
import {MemberViewContext} from "../../store/hook/MemberViewProvider";

import "./ParticipantPane.component.scss"
import SlideButtonComponent from "../SlideButton.component";
import {useAppDispatch, useAppSelector} from "../../store";
import {billingSelector, fetchEnergyBills} from "../../store/billing";
import {eegSelector, selectedTenant} from "../../store/eeg";
import {fetchEnergyReport, meteringEnergyGroup, setSelectedPeriod} from "../../store/energy";
import ButtonGroup from "../ButtonGroup.component";
import {add, cloudUploadOutline, downloadOutline, flash, person} from "ionicons/icons";
import {eegPlug, eegSolar} from "../../eegIcons";
import {selectedParticipantSelector, selectMetering, selectParticipant} from "../../store/participant";
import cn from "classnames";
import {isParticipantActivated} from "../../util/Helper.util";
import DatepickerComponent from "../dialogs/datepicker.component";
import DatepickerPopover from "../dialogs/datepicker.popover";
import {ExcelReportRequest, InvestigatorCP} from "../../models/reports.model";
import {eegService} from "../../service/eeg.service";
import UploadPopup from "../dialogs/upload.popup";

interface ParticipantPaneProps {
  participants: EegParticipant[];
  periods: { begin: string, end: string };
  activePeriod: SelectedPeriod | undefined;
  onUpdatePeriod: (e: SelectCustomEvent<number>) => void;
}

const ParticipantPaneComponent: FC<ParticipantPaneProps> = ({
                                                              participants,
                                                              periods,
                                                              activePeriod,
                                                              onUpdatePeriod
                                                            }) => {

  const dispatcher = useAppDispatch();
  const tenant = useAppSelector(selectedTenant);
  const energyMeterGroup = useAppSelector(meteringEnergyGroup);
  const selectedParticipant = useAppSelector(selectedParticipantSelector);
  const billingInfo = useAppSelector(billingSelector);
  const eeg = useAppSelector(eegSelector)

  const [sortedParticipants, setSortedParticipants] = useState(participants);

  const [loading, dismissLoading] = useIonLoading();

  const {
    billingEnabled,
    setBillingEnabled,
    checkedParticipant,
    setCheckedParticipant,
    detailsPageOpen,
    showDetailsPage
  } = useContext(ParticipantContext);
  const {
    toggleMembersMeter,
    toggleMetering,
    toggleShowAmount,
    hideMeter,
    hideConsumers,
    hideProducers,
    showAmount,
    hideMember
  } = useContext(MemberViewContext);

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (checkedParticipant) {
      const nextBillingEnabled = Object.entries(checkedParticipant).reduce((r, e) => (isParticipantActivated(participants, e[0]) && e[1]) || r, false)
      // console.log("Show Billing: ", nextBillingEnabled);

      setBillingEnabled(nextBillingEnabled)
      if (!nextBillingEnabled)
        toggleShowAmount(false)
    }
  }, [checkedParticipant])

  useEffect(() => {
    const sorted = participants.sort((a, b) => {
      const meterAOK = a.meters.reduce((i, m) => (m.status === 'ACTIVE') && i, true)
      const meterBOK = b.meters.reduce((i, m) => (m.status === 'ACTIVE') && i, true)

      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') {
        return -1
      }

      if (b.status !== 'ACTIVE' && a.status === 'ACTIVE') {
        return 1
      }

      if (b.status !== 'ACTIVE' || a.status !== 'ACTIVE') {
        if (meterAOK === meterBOK) {
          return 0
        } else if (!meterAOK && meterBOK) {
          return -1
        }
        return 1
      }

      if (meterAOK && !meterBOK) {
        return 1
      } else if (!meterAOK && meterBOK) {
        return -1
      }
      return 0
    })
    // setCheckedParticipant(sorted.map(() => false))
    setSortedParticipants(sorted);
  }, [participants])

  const selectAll = (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    participants.forEach((p) => {
      if (p.status === 'ACTIVE') {
        setCheckedParticipant(p.id, event.detail.checked);
      }
    })
  }

  const onCheckParticipant = (p: EegParticipant) => (e: CheckboxCustomEvent) => {
    if (p.status === 'ACTIVE') {
      setCheckedParticipant(p.id, e.detail.checked)
    }
  }
  const activateBilling = (c: boolean) => {
    if (c) {
      presentAlert({
        subHeader: "Abrechnungsmodus",
        message: "Du hast den Abrechnungsmodus aktiviert. Selektiere den Zeitraum den du abrechnen möchtest und wähle “Abrechnung erstellen”. Es werden automatisch alle Mitglieder gewählt, da du Einzelabrechnungen nur machen kannst wenn ein Mitglied die EEG verlässt. Eine genaue Aufstellung der Posten siehst erhältst du durch betätigen der Summe des jeweiligen Mitglieds.",
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
            const invoiceRequest = {allocations: energyMeterGroup, tenantId: tenant, preview: true, clearingPeriodIdentifier: "Preview", clearingPeriodType: "YM"} as ClearingPreviewRequest
            dispatcher(
              fetchEnergyBills({tenant, invoiceRequest}))
              .then(() => toggleShowAmount(true));
          } else {
            toggleShowAmount(false);
          }
        },
      })
    } else {
      toggleShowAmount(false);
    }
  }

  const onUpdatePeriodSelection = (selectedPeriod: SelectedPeriod) => {
    dispatcher(fetchEnergyReport({
      tenant: tenant!,
      year: selectedPeriod.year,
      segment: selectedPeriod.segment,
      type: selectedPeriod.type,
    }))
    // setUsedPeriod(idx)
  }

  const onSelectParticipant = (p: EegParticipant) => {
    dispatcher(selectParticipant(p.id))
    dispatcher(selectMetering(p.meters[0].meteringPoint));
    // e.stopPropagation();
  }

  const billingSum = () => {
    if (billingInfo) {
      const sum = billingInfo.reduce((i, s) => i + s.amount + s.meteringPoints.reduce((mi, ms) => mi + ms.amount, 0), 0)
      return Math.round(sum * 100) / 100;
    }
    return 0
  }

  const selectMeter = (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>, participantId: string, meter: Metering) => {
    dispatcher(selectParticipant(participantId))
    dispatcher(selectMetering(meter.meteringPoint));
    e.stopPropagation();
  }

  const dismiss = (range: [Date|null, Date|null]) => {
    const [startDate, endDate] = range
    if (startDate === null || endDate === null) {
      return
    }
    console.log("Export: ", range);
  }

  const [reportPopover, dismissReport] = useIonPopover(DatepickerPopover, {
    tenant: tenant,
    onDismiss: (startDate: Date, endDate: Date) => {
      loading({message: "Daten exportieren ..."})
      onExport([startDate, endDate])
        .then(b => {
          dismissReport([startDate, endDate], "")
          dismissLoading()
        })
        .catch(() => dismissLoading())
    }
  });

  const [uploadPopover, dismissUpload] = useIonPopover(UploadPopup, {
    tenant,
    onDismiss: (data: any, role: string) => dismissUpload(data, role)
  });

  const onExport = async (data: any) => {
    if (data && eeg) {
      const [start, end] = data
      const exportdata = {
        start: start.getTime(),
        end: end.getTime(),
        communityId: eeg.communityId,
        cps:  participants.reduce((r, p) =>
          r.concat(p.meters.map( m => { return { meteringPoint: m.meteringPoint, direction: m.direction, name: p.firstname + " " + p.lastname} as InvestigatorCP})), [] as InvestigatorCP[])
      } as ExcelReportRequest
      return eegService.createReport(tenant, exportdata)
    }
  }

  const onImport = (data: any) => {
    if (data) {
      const [file, sheetName, type] = data
      if (file && file.length === 1 && sheetName) {
        switch (type) {
          case 0:
            eegService.uploadEnergyFile(tenant, sheetName, file[0])
            break
          case 1:
            eegService.uploadMasterDataFile(tenant, sheetName, file[0])
            break;
        }
      }
    }
  }

  const onSubmitBills = () => {
    if (activePeriod) {
      const invoiceRequest = {
        allocations: energyMeterGroup,
        tenantId: tenant,
        preview: false,
        clearingPeriodIdentifier: "Rechnung_"+activePeriod.type+"-"+activePeriod.segment,
        clearingPeriodType: activePeriod.type} as ClearingPreviewRequest;
      eegService.startEnergyBill(tenant, invoiceRequest);
    }
  }

  const popoverRef = useRef<HTMLIonToolbarElement>(null)
  return (
    <div className={"participant-pane"}>
      <div className={"pane-body"}>
        <DatepickerComponent range={dismiss} trigger="open-datepicker-dialog" />
        <div className={"pane-content"}>
          <IonToolbar color="eeglight" style={{"--min-height": "56px"}} ref={popoverRef}>
            <IonButtons slot="end">
              {eeg && !eeg.online && <IonButton
                color="primary"
                shape="round"
                fill={"solid"}
                aria-label="Favorite"
                style={{"--border-radius": "50%", width:"36px", height: "36px", marginRight: "16px"}}
                onClick={(e: any) =>
                  uploadPopover({
                    event: e,
                    size: "auto",
                    side: "bottom",
                    alignment: "start",
                    cssClass: "upload-popover",
                    onDidDismiss: (e: CustomEvent) => onImport(e.detail.data),
                  })
                }
              >
                <IonIcon slot="icon-only" icon={cloudUploadOutline}></IonIcon>
              </IonButton>}
              <IonButton
                // id="open-datepicker-dialog"
                color="primary"
                shape="round"
                fill={"solid"}
                style={{"--border-radius": "50%", width:"36px", height: "36px", marginRight: "16px"}}
                onClick={(e: any) =>
                  reportPopover({
                    event: e,
                    size: "auto",
                    side: "bottom",
                    alignment: "start",
                    cssClass: "upload-popover",
                    // onDidDismiss: (e: CustomEvent) => onExport(e.detail.data),
                  })
                }
              >
                <IonIcon slot="icon-only" icon={downloadOutline}></IonIcon>
              </IonButton>
              <IonButton
                color="primary"
                shape="round"
                fill={"solid"}
                style={{"--border-radius": "50%", width:"36px", height: "36px", marginRight: "16px"}}
                routerLink="/page/addParticipant" routerDirection="root"
              >
                <IonIcon slot="icon-only" icon={add}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <PeriodSelectorComponent periods={periods} activePeriod={activePeriod} selectAll={selectAll}
                                   onUpdatePeriod={onUpdatePeriodSelection}/>

          {sortedParticipants.map((p, idx) => {
            return (
              <div key={idx} onClick={() => onSelectParticipant(p)}
                   className={cn("participant", {"selected": p.id === selectedParticipant.id})}>
                <MemberComponent
                  participant={p}
                  onCheck={onCheckParticipant(p)}
                  isChecked={checkedParticipant && (checkedParticipant[p.id] || false)}
                  hideMeter={hideMeter}
                  hideMember={hideMember}
                  showAmount={showAmount}
                  showDetailsPage={showDetailsPage}
                >
                  {hideMeter || p.meters.filter((m) => {
                    if (m.direction === 'GENERATION' && hideProducers)
                      return false;
                    if (m.direction === 'CONSUMPTION' && hideConsumers)
                      return false;
                    return true;
                  }).map((m, i) => (
                    <MeterCardComponent key={i} participant={p} meter={m} hideMeter={false} showCash={showAmount} onSelect={selectMeter}/>
                  ))}
                </MemberComponent>
              </div>
            )
          })}
        </div>
        <div className={"pane-footer"}>
          {showAmount &&
            <div>
              <IonRow>
                <IonCol>
                  <IonItem lines="none">
                    <IonLabel slot="end">Gesamte EEG: {billingSum()} €</IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonButton expand="block" disabled={activePeriod === undefined} onClick={() => onSubmitBills()}>{`RECHNUNG VERSENDEN (${billingInfo.length})`}</IonButton>
                </IonCol>
              </IonRow>
            </div>
          }
          <div className={"button-bar"}>
            <div style={{marginLeft: "20px"}}>
              <SlideButtonComponent checked={showAmount} disabled={!billingEnabled}
                                    setChecked={(c) => activateBilling(c)}></SlideButtonComponent>
            </div>
            <div style={{marginRight: "20px", display: "flex", flexDirection: "row"}}>
              <div style={{marginRight: "10px"}}>
                <ButtonGroup buttons={[
                  {icon: <IonIcon slot="icon-only" icon={person}></IonIcon>},
                  {icon: <IonIcon slot="icon-only" icon={flash}></IonIcon>}
                ]} onChange={toggleMembersMeter}/>
              </div>
              <div>
                <ButtonGroup buttons={[
                  {icon: <IonIcon slot="icon-only" icon={eegSolar}></IonIcon>},
                  {icon: <IonIcon slot="icon-only" icon={eegPlug}></IonIcon>}
                ]} onChange={toggleMetering}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantPaneComponent;