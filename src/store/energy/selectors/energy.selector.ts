import {createSelector} from "@reduxjs/toolkit";

// import { EnergyState, adapter, featureKey } from '../states';
import {featureKey, EnergyEntitieState, metaAdapter, reportAdapter} from "../states";
import {ConsumerReport, EnergyReport, ProducerReport} from "../../../models/energy.model";
import {calc, splitDate} from "../../../util/Helper.util";
import {MeteringEnergyGroupType} from "../../../models/meteringpoint.model";

const {selectAll, selectById, selectEntities} = metaAdapter.getSelectors();


const nowTimeString = () => {
 const now = new Date()
 return `${now.getDay()}.${now.getMonth()}.${now.getFullYear()}`
}

const featureStateSelector = (state: { [featureKey]: EnergyEntitieState }) => state[featureKey];

// const intermediateReportEntitiesSelector = (state: { [featureKey]: EnergyEntitieState }) => state[featureKey].intermediateReportResults;

export const stateSelector = createSelector(
  featureStateSelector,
  state => selectEntities
);

// export const rateSelector = createSelector(
//   featureStateSelector,
//   selectAll
// );

const selectAllMeta = createSelector(
  featureStateSelector,
  items => selectAll(items.meta)
)

export const selectAllIntermediates = createSelector(
  featureStateSelector,
  items => reportAdapter.getSelectors().selectAll(items.intermediateReportResults)
)

export const selectMeta = (meterId: string) => createSelector(
  featureStateSelector,
  items => selectById(items.meta, meterId)
)

const selectReport = createSelector(
  featureStateSelector,
  items => items.report
)
export const meteringReportSelector = (meterId: string, reportId: string) => createSelector(
  selectMeta(meterId),
  selectReport,
  (meta, report) => {
    if (meta && report) {
      if (meta.dir === "CONSUMPTION") {
        return {
          consumed: report.consumed[meta.sourceIdx],
          allocated: report.allocated[meta.sourceIdx],
          total_production: report.total_produced
        } as ConsumerReport
      } else {
        return {
          produced: report.produced[meta.sourceIdx],
          allocated: report.distributed[meta.sourceIdx],
          total_production: report.distributed.reduce((s, d) => s + d, 0)
        } as ProducerReport
      }
    }
  }
)

export const periodsSelector = createSelector(
  selectAllMeta,
  metas => metas.reduce((i, m) => {
    if (m.period_start && m.period_start !== "" && calc(splitDate(m.period_start)) < calc(splitDate(i.begin))) {
      i.begin = m.period_start
    }
    if (m.period_end && m.period_end !== "" && calc(splitDate(m.period_end)) > calc(splitDate(i.end))) {
      i.end = m.period_end
    }
    return i
  }, {begin: nowTimeString(), end: ""})
)

export const selectedPeriodSelector = createSelector(
  featureStateSelector,
  items => items.selectedPeriod
)

export const energySeriesByMeter = (meter: string) => createSelector(
  selectMeta(meter),
  selectAllIntermediates,
  (meta, entities:EnergyReport[]) =>
    entities.map(r =>
      (meta && r.allocated.length > meta.sourceIdx) ?
        { allocated: meta.dir === "CONSUMPTION" ? r.allocated[meta.sourceIdx] : r.distributed[meta.sourceIdx],
          consumed: meta.dir === "CONSUMPTION" ? r.consumed[meta.sourceIdx] : r.produced[meta.sourceIdx] } as {allocated: number, consumed: number} :
        { allocated: 0, consumed: 0 } as {allocated: number, consumed: number})
)

export const meteringEnergyGroup = createSelector(
  selectAllMeta,
  selectReport,
  (entities, report) => entities.map((m) => {
    let allocation = 0.0
    if (report) {
      if (m.dir === "CONSUMPTION") {
        allocation = report.allocated[m.sourceIdx]
      } else {
        allocation = report.distributed[m.sourceIdx]
      }
    }
    return {meteringPoint: m.name, allocationKWh: allocation} as MeteringEnergyGroupType
  })
)