import React, {FC, useEffect, useState} from "react";
import {IonCheckbox, IonItem, IonSelect, IonSelectOption, SelectCustomEvent} from "@ionic/react";
import {MONTHNAME} from "../models/eeg.model";
import {EegParticipant} from "../models/members.model";
import {SelectedPeriod} from "../models/energy.model";
import {getPeriodSegment, yearMonth} from "../util/Helper.util";
import {IonCheckboxCustomEvent} from "@ionic/core/dist/types/components";
import {CheckboxChangeEventDetail} from "@ionic/core";

import "./PeriodSelector.component.css"

interface PeriodSelectorProps {
  periods: {begin: string, end: string};
  activePeriod: SelectedPeriod | undefined;
  selectAll: (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => void;
  onUpdatePeriod: (selectedPeriod: SelectedPeriod) => void;
}

const PeriodSelectorComponent: FC<PeriodSelectorProps> = ({periods, activePeriod, selectAll, onUpdatePeriod}) => {

  const [periodOptions, setPeroidOptions] = useState<SelectedPeriod[]>([]);
  const [usedPeriod, setUsedPeriod] = useState(0)

  const periodDisplayString = (period: SelectedPeriod) => {
    switch (period.type) {
      case 'YH': return `${MONTHNAME[(period.segment*6)-5].substring(0, 3)}-${MONTHNAME[period.segment*6].substring(0, 3)} ${period.year}`
      case 'YQ': return `${MONTHNAME[(period.segment*3)-2].substring(0, 3)}-${MONTHNAME[period.segment*3].substring(0, 3)} ${period.year}`
      case 'YM': return `${MONTHNAME[period.segment]} ${period.year}`
      case 'Y' : return `${MONTHNAME[1].substring(0, 3)}-${MONTHNAME[12].substring(0, 3)} ${period.year}`
    }
  }

  const generatePeriodOptions = (period: string, endMonth: number, endYear: number, beginMonth: number, beginYear: number) => {
    const options: SelectedPeriod[] = [];
    for (let y = beginYear; y <= endYear; y++) {
      const em = y === endYear ? endMonth : 12
      const bm = y === beginYear ? beginMonth : 1

      const factor = period === "Y" ? 12 : period === 'YH' ? 6 : period === "YQ" ? 3 : 1

      let m = (bm - 1 + (factor - (bm-1) % factor));
      const _em = em-1+(factor - (em-1) % factor);
      while (m <= _em) {
        console.log("m=", m, "em=", em)
        options.push({type: period, segment: getPeriodSegment(period, m), year: y})
        m = (m  + (factor - (m) % factor))
      }
    }

    return options.sort((a, b) => (a.year+(a.segment*0.01)) > (b.segment*0.01+b.year) ? -1 : 1);
  }

  useEffect(() => {
    if (periods && activePeriod) {
      const [beginMonth, beginYear] = yearMonth(periods.begin)
      let [endMonth, endYear] = yearMonth(periods.end)

      endYear = endYear || new Date().getFullYear()
      endMonth = endMonth || new Date().getMonth()

      const options = generatePeriodOptions(activePeriod.type, endMonth, endYear, beginMonth, beginYear)
      setPeroidOptions(options);

      const si = options.findIndex((p) => p.year === activePeriod.year && p.segment === activePeriod.segment)
      if (si >= 0) {
        setUsedPeriod(si+1)
      }
    }
  }, [periods, activePeriod])

  const onSelect = (e: SelectCustomEvent<number>) => {
    const idx = e.detail.value;
    if (idx && idx > 0) {
      onUpdatePeriod(periodOptions[idx - 1]);
    }
    // setUsedPeriod(idx)
  }

  return (
    <div className={"fixed-header flex-row"} style={{marginBottom: "16px"}}>
      <IonItem lines="none">
        <IonCheckbox style={{"--size": "16px", margin: "0px"}} onIonChange={selectAll}> </IonCheckbox>
      </IonItem>
      <IonItem lines="none" style={{flexGrow: "1"}}>
        {/*<IonLabel></IonLabel>*/}
        <IonSelect interface="popover" className="select-box" value={usedPeriod}
                   onIonChange={onSelect}>
          {periodOptions.map((o, idx) => (
            <IonSelectOption key={idx} value={idx + 1}>{periodDisplayString(o)}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
    </div>
  )
}

export default PeriodSelectorComponent;