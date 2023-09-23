import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {IonButton, IonButtons} from "@ionic/react";
import {createNewPeriod} from "../util/Helper.util";
import {
  EegEnergyReport,
  EnergySeries,
  MeterEnergySeries, MeterReport,
  ParticipantReport,
  ReportType,
  SelectedPeriod
} from "../models/energy.model";
import {eegService} from "../service/eeg.service";
import {Exception} from "sass";
import PeriodSelectorElement from "./core/PeriodSelector.element";
import {useAppSelector} from "../store";
import {periodsSelector} from "../store/energy";

interface MeterChartNavbarComponentProps {
  selectedMeterId: string
  activePeriod: SelectedPeriod
  onSelectionChanged: (selectedPeriod: SelectedPeriod) => void
}

const MeterChartNavbarComponent: FC<MeterChartNavbarComponentProps> = ({selectedMeterId, activePeriod, onSelectionChanged}) => {
  const periods = useAppSelector(periodsSelector);

  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod|undefined>(activePeriod)
  const [lastSegmentIdx, setLastSegmentIdx] = useState<number>(1)

  useEffect(() => {
    console.log("ACTIVE PERIOD: ", activePeriod, selectedPeriod)
    setSelectedPeriod(activePeriod)
  }, [activePeriod, selectedMeterId])

  const isPeriodSelected = (periodType: string) => selectedPeriod?.type === periodType

  const calcSelectedEnergySeries = (reportType: ReportType, meterId: string, report: EegEnergyReport): EnergySeries[] => {
    const meta = report.eeg.meta.find(m => m.name === meterId)
    return report.eeg.intermediateReportResults.map(r => {
      if (meta) {
        const [period, year, segment, idx] = r.id.split('/')
        switch (meta.dir) {
          case "CONSUMPTION":
            if ((r.allocated.length > meta.sourceIdx) && (r.consumed.length > meta.sourceIdx)) {
              return {
                segmentIdx: Number(idx),
                allocated: r.allocated[meta.sourceIdx],
                consumed: r.consumed[meta.sourceIdx] - r.allocated[meta.sourceIdx]
              } as EnergySeries
            }
            break;
          case "GENERATION":
            if ((r.produced.length > meta.sourceIdx) && (r.distributed.length > meta.sourceIdx)) {
              return {
                segmentIdx: Number(idx),
                allocated: r.produced[meta.sourceIdx] - r.distributed[meta.sourceIdx],
                consumed: r.produced[meta.sourceIdx]
              } as EnergySeries
            }
        }
      }
      return  { segmentIdx: 0, allocated: 0, consumed: 0 } as EnergySeries
    })
  }

  const selectLastSegmentIdx = (series: EnergySeries[]) => {
    if (series && series.length > 0) {
      setLastSegmentIdx(series[series.length-1].segmentIdx)
    } else {
      setLastSegmentIdx(1)
    }
    return series
  }

  const updateSeries = (meterId: string, selectedPeriod: SelectedPeriod) => {
    // eegService.fetchReport(tenant, selectedPeriod.year, selectedPeriod.segment, selectedPeriod.type)
    //   .then((r) => calcSelectedEnergySeries(selectedPeriod.type, meterId, r))
    //   .then((r) => selectLastSegmentIdx(r) )
    //   .then((r) => setEnergySeries({period: selectedPeriod, series:r}))

    onSelectionChanged(selectedPeriod)
  }

  const onChangePeriod = useCallback((selectedPeriod: SelectedPeriod | undefined)  =>{
    if (selectedPeriod) {
      setSelectedPeriod(selectedPeriod)
      updateSeries(selectedMeterId, selectedPeriod)
    }
  }, [selectedPeriod])

  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-around"}}>
      <div>
        <IonButtons>
          {(["Y", "YH", "YQ", "YM"] as ('YH' | "YQ" | 'YM' | 'Y')[]).map((p, i) => (
            <IonButton
              key={i}
              onClick={() => onChangePeriod(createNewPeriod(selectedPeriod, p, lastSegmentIdx))}
              shape="round"
              size="small"
              className="stateButton"
              fill={isPeriodSelected(p) ? "solid" : undefined}
              color={isPeriodSelected(p) ? 'success' : undefined}
            style={{minWidth: "32px", maxWidth: "32px"}}>
              {p}
            </IonButton>
          ))}
        </IonButtons>
      </div>
      <div>
        <PeriodSelectorElement periods={periods} activePeriod={selectedPeriod} onUpdatePeriod={onChangePeriod} />
      </div>
    </div>
  )
}

export default MeterChartNavbarComponent;