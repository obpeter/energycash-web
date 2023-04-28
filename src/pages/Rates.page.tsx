import React, {FC, useEffect, useState} from "react";
import EegWebContentPaneComponent from "../components/EegWebContentPane.component";
import {useAppSelector} from "../store";
import {ratesSelector} from "../store/rate";
import RateCardComponent from "../components/RateCard.component";
import {IonContent, IonIcon, IonItem, IonLabel, IonPage} from "@ionic/react";
import {EegTariff} from "../models/eeg.model";
import cn from "classnames";

import "./Rates.scss"
import {trashBin} from "ionicons/icons";
import RateComponent from "../components/Rate.component";
import RateDetailPaneComponent from "../components/RateDetailPane.component";

const RatesPage: FC = () => {

  const rates = useAppSelector(ratesSelector)

  const [selectedRate, setSelectedRate] = useState<EegTariff|undefined>()

  useEffect(() => {
    if (rates && rates.length > 0 && !selectedRate) {
      setSelectedRate(rates[0])
    }
  }, [rates])

  const onSelect = (rate: EegTariff) => {
    setSelectedRate(rate)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{display: "flex", flexDirection: "row", height: "100vh"}}>
          <div className={"ratePane"}>
            {rates.map((r, idx) => (
              <div key={idx} className={cn("rates", {"selected": r === selectedRate})}>
                <RateCardComponent rate={r} editable={true} onSelect={onSelect}/>
              </div>
            ))}
          </div>
          <div style={{flexGrow:"1", background: "#EAE7D9"}}>
            <RateDetailPaneComponent selectedRate={selectedRate} onSubmit={(d) => console.log(d)} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default RatesPage;