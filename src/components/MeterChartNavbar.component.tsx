import React, {FC, useEffect, useState} from "react";
import {IonButton, IonButtons} from "@ionic/react";
import {createNewPeriod} from "../util/Helper.util";
import {EegEnergyReport, EnergySeries, MeterEnergySeries, ReportType, SelectedPeriod} from "../models/energy.model";
import {eegService} from "../service/eeg.service";
import {Exception} from "sass";
import PeriodSelectorElement from "./core/PeriodSelector.element";

interface MeterChartNavbarComponentProps {
  tenant: string
  selectedMeterId: string
  periods: { begin: string, end: string }
  activePeriod: SelectedPeriod
  setEnergySeries: (series: MeterEnergySeries) => void
}

const MeterChartNavbarComponent: FC<MeterChartNavbarComponentProps> = ({tenant, selectedMeterId, periods, activePeriod, setEnergySeries}) => {

  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod|undefined>(activePeriod)
  const [lastSegmentIdx, setLastSegmentIdx] = useState<number>(1)

  useEffect(() => {
    setSelectedPeriod(activePeriod)
    updateSeries(selectedMeterId, activePeriod)
  }, [activePeriod, selectedMeterId])

  const isPeriodSelected = (periodType: string) => selectedPeriod?.type === periodType

  const calcSelectedEnergySeries = (reportType: ReportType, meterId: string, report: EegEnergyReport): EnergySeries[] => {
    const meta = report.eeg.meta.find(m => m.name === meterId)
    return report.eeg.intermediateReportResults.map(r => {
      if (meta && r.allocated.length > meta.sourceIdx) {
        const [period, year, segment, idx] = r.id.split('/')
        return {
          segmentIdx: Number(idx),
          allocated: meta.dir === "CONSUMPTION" ? r.allocated[meta.sourceIdx] : r.produced[meta.sourceIdx] - r.distributed[meta.sourceIdx],
          consumed: meta.dir === "CONSUMPTION" ? r.consumed[meta.sourceIdx] - r.allocated[meta.sourceIdx] : r.produced[meta.sourceIdx]
        } as EnergySeries
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
    eegService.fetchReport(tenant, selectedPeriod.year, selectedPeriod.segment, selectedPeriod.type)
      .then((r) => calcSelectedEnergySeries(selectedPeriod.type, meterId, r))
      .then((r) => selectLastSegmentIdx(r) )
      .then((r) => setEnergySeries({period: selectedPeriod, series:r}))
  }

  const onChangePeriod = (selectedPeriod: SelectedPeriod | undefined)  =>{
    if (selectedPeriod) {
      setSelectedPeriod(selectedPeriod)
      updateSeries(selectedMeterId, selectedPeriod)
    }
  }

  const onSelectAll = ()  => {
  };

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