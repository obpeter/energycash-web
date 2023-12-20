import React, {FC} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {ratesSelector, saveNewRate, selectedRateSelector, selectRate, updateRate} from "../store/rate";
import RateCardComponent from "../components/RateCard.component";
import {
  IonButton, IonButtons,
  IonContent,
  IonIcon,
  IonPage,
  IonToolbar
} from "@ionic/react";
import {EegTariff} from "../models/eeg.model";
import cn from "classnames";

import "./Rates.scss"
import {add} from "ionicons/icons";
import RateDetailPaneComponent from "../components/RateDetailPane.component";
import {selectedTenant} from "../store/eeg";
import {useRateType} from "../store/hook/Rate.provider";

const RatesPage: FC = () => {

  const dispatcher = useAppDispatch();
  const selectedTariff = useAppSelector(selectedRateSelector)
  const rates = useAppSelector(ratesSelector)
  const tenant = useAppSelector(selectedTenant)

  const {setRateType} = useRateType()

  // const [selectedRate, setSelectedRate] = useState<EegTariff|undefined>()

  // useEffect(() => {
  //   if (rates && rates.length > 0 && (!selectedTariff || selectedTariff.id.length === 0)) {
  //     dispatcher(selectRate(rates[0]))
  //   }
  //   return () => {
  //     dispatcher(selectRate(undefined))
  //   }
  // }, [rates])

  const onSelect = (rate: EegTariff) => {
    setRateType(rate.type)
    dispatcher(selectRate(rate))
  }

  const onNew = () => {
    const newRate = {id: '', name: '', type: 'EEG', useVat: false, baseFee: "0",
        accountGrossAmount: "0", participantFee: 0, accountNetAmount: "0", billingPeriod: 'monthly', businessNr:"0",
        centPerKWh: 0, discount: "0", freeKWH:"0", vatInPercent: "0"} as EegTariff
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
          <div className={"ratePane"} style={{overflowY: "auto"}}>
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
              <div key={idx} className={cn("rates", {"selected": r.id === selectedTariff?.id})}>
                <RateCardComponent rate={r} editable={true} onSelect={onSelect}/>
              </div>
            ))}
            </div>
          </div>
          <div style={{flexGrow:"1", background: "#EAE7D9"}}>
            {selectedTariff && <RateDetailPaneComponent submitId="change-rate-submit-id" onSubmit={onSubmitRateChange} />}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default RatesPage;