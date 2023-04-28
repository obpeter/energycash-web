import React, {FC, useEffect, useState} from "react";
import {IonCheckbox, IonItem, IonSelect, IonSelectOption, SelectCustomEvent} from "@ionic/react";
import {MONTHNAME} from "../models/eeg.model";
import {EegParticipant} from "../models/members.model";
import {SelectedPeriod} from "../models/energy.model";
import {yearMonth} from "../util/Helper.util";
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

  useEffect(() => {
    if (periods && activePeriod) {
      const [beginMonth, beginYear] = yearMonth(periods.begin)
      let [endMonth, endYear] = yearMonth(periods.end)

      endYear = endYear || new Date().getFullYear()
      endMonth = endMonth || new Date().getMonth()

      const options: SelectedPeriod[] = [];
      for (let y = beginYear; y <= endYear; y++) {
        const em = y === endYear ? endMonth : 12
        const bm = y === beginYear ? beginMonth : 1
        for (let m = bm; m <= em; m++) {
          options.push({type: "MRP", month: m, year: y})
        }
      }
      let sortedOptions = options.sort((a, b) =>
        ((a.year * 1000) + (a.month * 10)) < ((b.year * 1000) + (b.month * 10)) ? 1 : -1)

      setPeroidOptions(sortedOptions);

      const si = sortedOptions.findIndex((p) => p.year === activePeriod.year && p.month === activePeriod.month)
      if (si >= 0) {
        setUsedPeriod(si + 1)
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
            <IonSelectOption key={idx} value={idx + 1}>{`${MONTHNAME[o.month]} ${o.year}`}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
    </div>
  )
}

export default PeriodSelectorComponent;