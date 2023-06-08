import React, {FC, forwardRef, useEffect, useState} from "react";
import {IonButton, IonContent, IonFooter, IonIcon, IonInput, IonItem, IonLabel, IonToolbar} from "@ionic/react";
import {eye, trashBin} from "ionicons/icons";
import RateComponent from "../Rate.component";
import {EdaProcess, Eeg} from "../../models/eeg.model";

import './ProcessDetailPane.component.scss'
import InputForm from "../form/InputForm.component";
import {Control, useForm} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import SelectForm from "../form/SelectForm.component";
import DatePicker from "react-datepicker";
import {eegService} from "../../service/eeg.service";
import {useAppSelector} from "../../store";
import {selectedTenant} from "../../store/eeg";
import ProcessRequestValuesComponent from "./ProcessRequestValues.component";
import ProcessRegisterMeterComponent from "./ProcessRegisterMeter.component";


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
          return <ProcessRegisterMeterComponent eeg={eeg} meters={meters} participants={participants} />
        case 'CR_REQ_PT':
          return <ProcessRequestValuesComponent eeg={eeg} meters={meters} participants={participants} />
      }
    }
    return <></>
  }

  return (
    <div className={"details-body"} style={{height: "100%", display: "flex", flexDirection: "column"}}>
      <div className={"details-header"}>
        <div><h4>{selectedProcess?.name}</h4></div>
      </div>
      <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
        {renderProcess()}
      </div>
    </div>
  )
}

export default ProcessDetailPaneComponent;