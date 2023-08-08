import React, {FC, MouseEventHandler, startTransition, useContext, useEffect, useRef, useState} from "react";

import {EegParticipant} from "../../models/members.model";
import {
  CheckboxCustomEvent, IonAlert,
  IonButton,
  IonButtons,
  IonCol, IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow, IonSearchbar, IonSpinner,
  IonToolbar,
  SelectCustomEvent,
  useIonAlert, useIonLoading, useIonPopover, useIonToast
} from "@ionic/react";
import {CheckboxChangeEventDetail} from "@ionic/core";
import {IonCheckboxCustomEvent} from "@ionic/core/dist/types/components";
import {createPeriodIdentifier, SelectedPeriod} from "../../models/energy.model";
import ParticipantPeriodHeaderComponent from "./ParticipantPeriodHeader.component";
import MemberComponent from "./Member.component";
import {
  ClearingPreviewRequest,
  Metering,
  MeteringEnergyGroupType,
  ParticipantBillType
} from "../../models/meteringpoint.model";
import MeterCardComponent from "./MeterCard.component";
import {ParticipantContext} from "../../store/hook/ParticipantProvider";
import {MemberViewContext} from "../../store/hook/MemberViewProvider";

import "./ParticipantPane.component.scss"
import SlideButtonComponent from "../SlideButton.component";
import {useAppDispatch, useAppSelector} from "../../store";
import {
  billingSelector,
  fetchEnergyBills,
  fetchParticipantAmounts, resetParticipantAmounts,
  selectBillFetchingSelector
} from "../../store/billing";
import {eegSelector, selectedTenant} from "../../store/eeg";
import {fetchEnergyReport, meteringEnergyGroup, setSelectedPeriod} from "../../store/energy";
import ButtonGroup from "../ButtonGroup.component";
import {
  add, archiveOutline,
  cloudUploadOutline, documentTextOutline,
  downloadOutline,
  flash,
  mailOutline,
  person,
  search,
  searchCircle
} from "ionicons/icons";
import {eegPlug, eegSolar} from "../../eegIcons";
import {
  selectedMeterIdSelector,
  selectedParticipantSelector,
  selectMetering,
  selectParticipant
} from "../../store/participant";
import cn from "classnames";
import {isParticipantActivated, reformatDateTimeStamp} from "../../util/Helper.util";
import DatepickerComponent from "../dialogs/datepicker.component";
import DatepickerPopover from "../dialogs/datepicker.popover";
import {ExcelReportRequest, InvestigatorCP} from "../../models/reports.model";
import {eegService} from "../../service/eeg.service";
import UploadPopup from "../dialogs/upload.popup";
import {useRefresh} from "../../store/hook/Eeg.provider";
import {
  billingRunErrorSelector,
  billingRunIsFetchingSelector,
  billingRunSelector, billingRunSendmail,
  billingRunStatusSelector,
  fetchBillingRun, fetchBillingRunById
} from "../../store/billingRun";

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
  const selectedMeterId = useAppSelector(selectedMeterIdSelector);
  const billingInfo = useAppSelector(billingSelector);
  const eeg = useAppSelector(eegSelector);

  const billingRun = useAppSelector(billingRunSelector);
  const billingRunStatus = useAppSelector(billingRunStatusSelector);
  const billingRunIsFetching = useAppSelector(billingRunIsFetchingSelector);
  const selectBillIsFetching = useAppSelector(selectBillFetchingSelector);
  const billingRunErrorMessage = useAppSelector(billingRunErrorSelector);

  const [searchActive, setSearchActive] = useState(false);
  const [sortedParticipants, setSortedParticipants] = useState(participants);
  const [result, setResult] = useState(participants)

  const [loading, dismissLoading] = useIonLoading();

  const {refresh} = useRefresh()

  const [toaster] = useIonToast()

  const {
    billingEnabled,
    setBillingEnabled,
    checkedParticipant,
    setCheckedParticipant,
    showDetailsPage,
    setShowAddMeterPane,
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


  useEffect( () => {
    if (showAmount && billingRun && billingRun.id) {
      dispatcher(fetchParticipantAmounts({tenant: tenant, billingRunId: billingRun.id }))
    }
    if (showAmount && !billingRun) {
      dispatcher(resetParticipantAmounts());
    }
  }, [billingRun, showAmount])

  useEffect(() => {
    if (checkedParticipant) {
      const nextBillingEnabled =
        Object.entries(checkedParticipant).reduce((r, e) => (isParticipantActivated(participants, e[0]) && e[1]) || r, false)
      // console.log("Show Billing: ", nextBillingEnabled);

      setBillingEnabled(nextBillingEnabled)
      if (!nextBillingEnabled)
        toggleShowAmount(false)
    }
  }, [checkedParticipant])

  useEffect( () => {
    if (billingRunErrorMessage) {
      errorToast(billingRunErrorMessage);
    }
  }, [billingRunErrorMessage]);

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
    setResult(sorted);
  }, [participants])

  const infoToast = (message: string) => {
    toaster({
      message: message,
      duration: 3500,
      position: 'bottom',
    });
  };

  const errorToast = (message: string) => {
    toaster({
      message: message,
      duration: 3500,
      position: 'bottom',
      color: "danger"
    });
  };


  const buildAllocationMapFromSelected = ():MeteringEnergyGroupType[] => {
    const participantMap =
      participants.reduce((r, p) => ({...r, [p.id]: p}), {} as Record<string, EegParticipant>)

    return Object.entries(checkedParticipant)
      .flatMap((r) => ([...participantMap[r[0]].meters.filter(m => m.tariffId !== null)]))
      .map(m => { return {meteringPoint: m.meteringPoint, allocationKWh: energyMeterGroup[m.meteringPoint]} as MeteringEnergyGroupType})
  }

  const selectAll = (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    participants.forEach((p) => {
      if (p.status === 'ACTIVE') {
        const tariffConfigured = p.meters.reduce((c, e) => c || (e.tariffId !== undefined && e.tariffId !==null), (p.tariffId !== undefined && p.tariffId != null))
        if (tariffConfigured) {
          setCheckedParticipant(p.id, event.detail.checked);
        }
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
            if (activePeriod) {
              dispatcher(fetchBillingRun({
                tenant: tenant,
                clearingPeriodType: activePeriod.type,
                clearingPeriodIdentifier: createPeriodIdentifier(activePeriod.type,
                    activePeriod.year, activePeriod.segment)
              }))
            }
            toggleShowAmount(true);
          } else {
            toggleShowAmount(false);
          }
        },
      })
    } else {
      toggleShowAmount(false);
      setBillingEnabled(false);
    }
  }

  const onUpdatePeriodSelection = (selectedPeriod: SelectedPeriod) => {
    dispatcher(fetchEnergyReport({
      tenant: tenant!,
      year: selectedPeriod.year,
      segment: selectedPeriod.segment,
      type: selectedPeriod.type,
    }))
    dispatcher(fetchBillingRun({
      tenant: tenant,
      clearingPeriodType : selectedPeriod.type,
      clearingPeriodIdentifier : createPeriodIdentifier(selectedPeriod.type,
          selectedPeriod.year, selectedPeriod.segment)
    }))

    // setUsedPeriod(idx)
  }

  const onSelectParticipant = (p: EegParticipant) => (e: React.MouseEvent<Element, MouseEvent>) => {
    dispatcher(selectParticipant(p.id))
    dispatcher(selectMetering(p.meters[0].meteringPoint));
    setShowAddMeterPane(false)
  }

  const onShowAddMeterPage = (p: EegParticipant) => (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
    dispatcher(selectParticipant(p.id))
    dispatcher(selectMetering(p.meters[0].meteringPoint));

    setShowAddMeterPane(true)
    e?.preventDefault()
    e?.stopPropagation()
  }

  const onSelectMeter = (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>, participantId: string, meter: Metering) => {
    dispatcher(selectParticipant(participantId))
    dispatcher(selectMetering(meter.meteringPoint));
    e.stopPropagation();
    setShowAddMeterPane(false)
  }

  const billingSum = () => {
    if (billingInfo) {
      const sum = billingInfo.reduce((i, s) => i + s.amount + s.meteringPoints.reduce((mi, ms) => mi + ms.amount, 0), 0)
      return Math.round(sum * 100) / 100;
    }
    return 0
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
        .catch(() => {
          dismissReport(undefined)
          dismissLoading()})
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
            loading({message: "Energiedaten importieren ..."})
            eegService.uploadEnergyFile(tenant, sheetName, file[0])
              .then(() => refresh())
              .then(() => dismissLoading())
              .then(() => infoToast("Energiedaten-Upload beendet."))
              .catch(() => dismissLoading())
            break
          case 1:
            loading({message: "Stammdaten importieren ..."})
            eegService.uploadMasterDataFile(tenant, sheetName, file[0])
              .then(() => refresh())
              .then(() => dismissLoading())
              .then(() => infoToast("Stammdaten-Upload beendet."))
              .catch(() => dismissLoading())
            break;
        }
      }
    }
  }

  const onDoBilling = (preview : boolean) => {
    if (activePeriod) {
      const invoiceRequest = {
        allocations: buildAllocationMapFromSelected(),
        tenantId: tenant,
        preview: preview,
        clearingPeriodIdentifier: createPeriodIdentifier(activePeriod.type, activePeriod.year, activePeriod.segment),
        clearingPeriodType: activePeriod.type} as ClearingPreviewRequest;
      dispatcher(
        fetchEnergyBills({tenant, invoiceRequest}))
        .then(() => {
            dispatcher(fetchBillingRun({
              tenant: tenant,
              clearingPeriodType: activePeriod.type,
              clearingPeriodIdentifier: createPeriodIdentifier(activePeriod.type,
                activePeriod.year, activePeriod.segment)
            }))
          }
        );
    }
  }

  async function sendBilling (billingRunId : string) {
    if (billingRunId) {
      dispatcher(
        billingRunSendmail( {tenant, billingRunId}))
        .then(() => {
          dispatcher(fetchBillingRunById({tenant, billingRunId }));
        })
    }
  }

  async function exportBillingExcel(billingRunId: string) {
    try {
      await eegService.exportBillingExcel(tenant, billingRunId);
    } catch (e) {
      console.log(e as string)
    }
  }

  async function exportBillingArchive(billingRunId: string) {
    try {
      await eegService.exportBillingArchive(tenant, billingRunId);
    } catch (e) {
      console.log(e as string)
    }
  }

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResult(sortedParticipants.filter((d) => d.lastname.toLowerCase().indexOf(query) > -1 || d.firstname.toLowerCase().indexOf(query) > -1));
  };

  const popoverRef = useRef<HTMLIonToolbarElement>(null)
  return (
    <div className={"participant-pane"}>
      <div className={"pane-body"}>
        <DatepickerComponent range={dismiss} trigger="open-datepicker-dialog" />
        <div className={"pane-content"}>
          <IonToolbar color="eeglight" style={{"--min-height": "56px"}} ref={popoverRef}>
            <IonButtons slot="end">
              <IonButton
                // id="open-datepicker-dialog"
                color="primary"
                shape="round"
                fill={"solid"}
                style={{"--border-radius": "50%", width:"36px", height: "36px", marginRight: "16px"}}
                onClick={() => setSearchActive(!searchActive)}
              >
                <IonIcon slot="icon-only" icon={search}></IonIcon>
              </IonButton>
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
          {searchActive &&
              <IonToolbar>
                <IonSearchbar
                    style={{"--box-shadow": "undefined"}}
                    debounce={500} onIonInput={(ev) => handleInput(ev)}>
                </IonSearchbar>
              </IonToolbar>}
          <ParticipantPeriodHeaderComponent periods={periods} activePeriod={activePeriod} selectAll={selectAll}
                                            onUpdatePeriod={onUpdatePeriodSelection}/>

          {result.map((p, idx) => {
            return (
              <div key={idx} onClick={onSelectParticipant(p)}
                   className={cn("participant", {"selected": p.id === selectedParticipant?.id})}>
                <MemberComponent
                  participant={p}
                  onCheck={onCheckParticipant(p)}
                  isChecked={checkedParticipant && (checkedParticipant[p.id] || false)}
                  hideMeter={hideMeter}
                  hideMember={hideMember}
                  showAmount={showAmount}
                  showDetailsPage={showDetailsPage}
                  onShowAddMeterPage={onShowAddMeterPage}
                >
                  {hideMeter || p.meters.filter((m) => {
                    if (m.direction === 'GENERATION' && hideProducers)
                      return false;
                    if (m.direction === 'CONSUMPTION' && hideConsumers)
                      return false;
                    return true;
                  }).map((m, i) => (
                    <MeterCardComponent key={i}
                                        participant={p}
                                        meter={m}
                                        hideMeter={false}
                                        showCash={showAmount}
                                        onSelect={onSelectMeter}
                                        isSelected={m.meteringPoint === selectedMeterId}/>
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
                  { billingRunIsFetching || selectBillIsFetching &&
                      <IonSpinner name="dots"></IonSpinner>
                  }
                  { !billingRunIsFetching && !billingRun &&
                      <IonButton expand="block" disabled={activePeriod === undefined} onClick={() => onDoBilling(true)}>{`VORSCHAU ERSTELLEN`}</IonButton>
                  }
                  { !billingRunIsFetching && billingRunStatus === 'NEW' &&
                      <>
                        { "Vorschau (" + reformatDateTimeStamp(billingRun.runStatusDateTime) + ")"}
                        <IonButton expand="block" disabled={activePeriod === undefined} onClick={() => onDoBilling(true)}>{`VORSCHAU AKTUALISIEREN`}</IonButton>
                        <IonButton expand="block" disabled={activePeriod === undefined} onClick={() => onDoBilling(false)}>{`ABRECHNUNG DURCHFÜHREN (${billingInfo.length})`}</IonButton>
                      </>
                  }
                  { !billingRunIsFetching && billingRunStatus === 'DONE' &&
                    <>
                      <div>
                        { (billingRun.mailStatus === "SENT") ? "Versendet ("+reformatDateTimeStamp(billingRun.mailStatusDateTime)+")"
                            : "Abgerechnet (" + reformatDateTimeStamp(billingRun.runStatusDateTime) + ")" }
                      </div>
                      <div>
                        <IonButton id="confirm-send">
                          <IonIcon slot="end" icon={mailOutline}></IonIcon>
                          {'SENDEN'}
                        </IonButton>
                        <IonAlert
                            header="SENDEN"
                            subHeader="Mit Klick auf OK versenden Sie alle Abrechnungsdokumente per E-Mail."
                            trigger="confirm-send"
                            buttons={[
                              {
                                text: 'Abbrechen',
                                role: 'cancel'
                              },
                              {
                                text: 'OK',
                                role: 'confirm',
                                handler: () => {
                                  sendBilling(billingRun.id);
                                },
                              },
                            ]}
                        ></IonAlert>
                        <IonButton onClick={() => exportBillingArchive(billingRun.id)}>
                          <IonIcon slot="end" icon={archiveOutline}></IonIcon>
                          {'DOWNLOAD'}
                        </IonButton>
                        <IonButton onClick={() => exportBillingExcel(billingRun.id)}>
                          <IonIcon slot="end" icon={documentTextOutline}></IonIcon>
                          {'EXCEL'}
                        </IonButton>
                      </div>
                    </>
                  }
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