import React, {FC, useEffect, useState} from "react";
import EegWebContentPaneComponent from "../components/EegWebContentPane.component";
import {useAppDispatch, useAppSelector} from "../store";
import {ratesSelector, saveNewRate, updateRate} from "../store/rate";
import RateCardComponent from "../components/RateCard.component";
import {
  IonButton, IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar
} from "@ionic/react";
import {EegTariff} from "../models/eeg.model";
import cn from "classnames";
import {v4} from 'uuid';

import "./Rates.scss"
import {add, trashBin} from "ionicons/icons";
import RateComponent from "../components/Rate.component";
import RateDetailPaneComponent from "../components/RateDetailPane.component";
import {selectedTenant} from "../store/eeg";
import RateProvider, {useRateType} from "../store/hook/Rate.provider";

const RatesPage: FC = () => {

  const dispatcher = useAppDispatch();
  const rates = useAppSelector(ratesSelector)
  const tenant = useAppSelector(selectedTenant)

  const {currentRateType, setRateType} = useRateType()

  const [selectedRate, setSelectedRate] = useState<EegTariff|undefined>()

  useEffect(() => {
    if (rates && rates.length > 0 && (!selectedRate || selectedRate.id.length === 0)) {
      setSelectedRate(rates[0])
    }
  }, [rates])

  const onSelect = (rate: EegTariff) => {
    setRateType(rate.type)
    setSelectedRate(rate)
    console.log("SELECT RATE: ", rate)
  }

  const onNew = () => {
    const newRate = {id: '', name: '', type: 'EEG', useVat: false, baseFee: "0",
        accountGrossAmount: "0", participantFee: "0", accountNetAmount: "0", billingPeriod: 'monthly', businessNr:"0",
        centPerKWh: "0", discount: "0", freeKWH:"0", vatInPercent: "0"} as EegTariff
    onSelect(newRate)
  }

  const onSubmitRateChange = (rate: EegTariff) => {
    if (rate.id.length === 0) {
      dispatcher(saveNewRate({rate, tenant}))
    } else {
      dispatcher(updateRate({rate, tenant}))
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen color="eeg">
        <div style={{display: "flex", flexDirection: "row", height: "100vh"}}>
          <div className={"ratePane"}>
            <IonToolbar color="eeg">
              <IonButtons slot="end">
                <IonButton
                  color="primary"
                  shape="round"
                  fill={"solid"}
                  style={{"--border-radius": "50%", width:"36px", height: "36px", marginRight: "16px"}}
                onClick={() => onNew()}>
                  <IonIcon slot="icon-only" icon={add}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <div className={"content"}>
            {rates.map((r, idx) => (
              <div key={idx} className={cn("rates", {"selected": r.id === selectedRate?.id})}>
                <RateCardComponent rate={r} editable={true} onSelect={onSelect}/>
              </div>
            ))}
            </div>
          </div>
          <div style={{flexGrow:"1", background: "#EAE7D9"}}>
            <RateDetailPaneComponent selectedRate={selectedRate} submitId="change-rate-submit-id" onSubmit={onSubmitRateChange} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default RatesPage;