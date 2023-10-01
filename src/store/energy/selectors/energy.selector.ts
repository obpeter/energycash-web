import {createSelector} from "@reduxjs/toolkit";

// import { EnergyState, adapter, featureKey } from '../states';
import {featureKey, EnergyEntitieState, metaAdapter, reportAdapter, participantReportAdapter} from "../states";
import {
  ConsumerReport,
  EnergyReport,
  EnergySeries,
  MeterEnergySeries,
  ProducerReport
} from "../../../models/energy.model";
import {calc, splitDate} from "../../../util/Helper.util";
import {MeteringEnergyGroupType} from "../../../models/meteringpoint.model";
import {buildSlice} from "@reduxjs/toolkit/dist/query/core/buildSlice";

const {selectAll, selectById, selectEntities} = metaAdapter.getSelectors();
const {selectAll: selectAllParticipants, selectById: selectParticipantById} = participantReportAdapter.getSelectors();


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
const selectParticipantReport = (participantId: string | undefined) => createSelector(
  featureStateSelector,
  items => participantId ? selectParticipantById(items.participantReports, participantId) : undefined
)

const selectTotalNumbers = createSelector(
  featureStateSelector,
  (state) => [state.totalConsumption, state.totalProduction]
)
// export const meteringReportSelector = (meterId: string, reportId: string) => createSelector(
//   selectMeta(meterId),
//   selectReport,
//   (meta, report): ConsumerReport | ProducerReport | undefined => {
//     if (meta && report) {
//       if (meta.dir === "CONSUMPTION") {
//         return {
//           consumed: report.consumed[meta.sourceIdx],
//           allocated: report.allocated[meta.sourceIdx],
//           total_production: report.total_produced
//         } as ConsumerReport
//       } else {
//         return {
//           produced: report.produced[meta.sourceIdx],
//           allocated: report.distributed[meta.sourceIdx],
//           total_production: report.distributed.reduce((s, d) => s + d, 0)
//         } as ProducerReport
//       }
//     }
//   }
// )

export const meteringReportSelectorV2 = (participantId: string, meterId: string) => createSelector(
  selectTotalNumbers,
  selectParticipantReport(participantId),
  ([totalConsumption, totalProduction], report): ConsumerReport | ProducerReport | undefined => {
    if (report) {
      const r = report.meters.filter(m => m.meterId === meterId).map(m => {
        if (m.meterDir === "CONSUMPTION") {
          return {
            consumed: m.report.summery.consumption,
            allocated: m.report.summery.utilization,
            total_production: totalProduction
          } as ConsumerReport
        } else {
          return {
            produced: m.report.summery.production,
            allocated: m.report.summery.allocation,
            total_production: totalProduction
          } as ProducerReport
        }
      })
      return (r.length > 0) ? r[0] : undefined
    }
    return undefined
  }
)

export const meteringInterReportSelectorV2 = (participantId: string | undefined, meterId: string | undefined) => createSelector(
  selectedPeriodSelector,
  selectParticipantReport(participantId),
  (period, report): MeterEnergySeries | undefined => {
    if (report) {
      const r = report.meters.filter(m => m.meterId === meterId).map(m => {
        if (m.meterDir === 'CONSUMPTION') {
          return m.report.intermediate.consumption.map((c, i) => {
            return {
              segmentIdx: i,
              allocated: m.report.intermediate.utilization[i],
              consumed: c,
            } as EnergySeries
          })
        } else {
          return m.report.intermediate.production.map((c, i) => {
            return {
              segmentIdx: i,
              allocated: m.report.intermediate.allocation[i],
              consumed: c,
            } as EnergySeries
          })

        }
      })
      return (r.length > 0) ? {period: period, series: r[0]} as MeterEnergySeries : undefined
    }
    return undefined
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
  (entities, report) => entities.reduce((e, m) => {
    let allocation = 0.0
    if (report) {
      if (m.dir === "CONSUMPTION") {
        allocation = report.allocated[m.sourceIdx]
      } else {
        allocation = report.produced[m.sourceIdx] - report.distributed[m.sourceIdx]
      }
    }
    return {...e, [m.name]: allocation} //{meteringPoint: m.name, allocationKWh: allocation} as MeteringEnergyGroupType
  }, {} as Record<string, number>)
)

export const meteringEnergyGroup1 = createSelector(
  featureStateSelector,
  (state:EnergyEntitieState) => selectAllParticipants(state.participantReports),
)
export const meteringEnergyGroup11 = createSelector(
  meteringEnergyGroup1,
  items => items.flatMap(i => i.meters).reduce((i, s) => {
    let utilization = 0.0
    if (s.meterDir === "CONSUMPTION") {
      utilization = s.report.summery.utilization
    } else {
      utilization = s.report.summery.production - s.report.summery.allocation
    }
    return {...i, [s.meterId]: utilization}
  }, {} as Record<string, number>),
)