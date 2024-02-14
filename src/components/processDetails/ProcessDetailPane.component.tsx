import React, {FC, useState} from "react";
import {EdaProcess, Eeg} from "../../models/eeg.model";

import './ProcessDetailPane.component.scss'
import {Metering} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import {useAppSelector} from "../../store";
import {selectedTenant} from "../../store/eeg";
import ProcessRequestValuesComponent from "./ProcessRequestValues.component";
import ProcessRegisterMeterComponent from "./ProcessRegisterMeter.component";
import ProcessHistoryComponent from "./ProcessHistory.component";
import DateComponent from "../dialogs/date.component";
import {IonButton, IonButtons, IonIcon} from "@ionic/react";
import {calendar} from "ionicons/icons";
import DatepickerComponent from "../dialogs/datepicker.component";
import ProcessRevokeMeteringpointComponent from "./ProcessRevokeMeteringpoint.component";


interface ProcessDetailPaneComponentProps {
  selectedProcess: EdaProcess | undefined
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
}

const ProcessDetailPaneComponent: FC<ProcessDetailPaneComponentProps> = ({
                                                                           selectedProcess,
                                                                           eeg,
                                                                           meters,
                                                                           participants
                                                                         }) => {

  const tenant = useAppSelector(selectedTenant)

  const renderProcess = () => {
    if (selectedProcess) {
      switch (selectedProcess?.type) {
        case 'EC_REQ_ONL':
          return <ProcessRegisterMeterComponent eeg={eeg} meters={meters} participants={participants} edaProcess={selectedProcess}/>
        case 'CR_REQ_PT':
          return <ProcessRequestValuesComponent eeg={eeg} meters={meters} participants={participants} edaProcess={selectedProcess}/>
        case 'CM_REV_CUS':
          return <ProcessRevokeMeteringpointComponent eeg={eeg} meters={meters} participants={participants} edaProcess={selectedProcess}/>
        case 'HISTORY':
          return <ProcessHistoryComponent eeg={eeg} edaProcess={selectedProcess}/>
      }
    }
    return <></>
  }

  return (

    <div className={"details-body"} style={{height: "100%", display: "flex", flexDirection: "column"}}>
      {renderProcess()}
    </div>
  )
}

export default ProcessDetailPaneComponent;