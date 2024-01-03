import {EnergySeries, MeterReport} from "../models/energy.model";

export const transformMeterReportToEnergySeries = (m: MeterReport) => {
  if (m.meterDir === 'CONSUMPTION') {
    return m.report.intermediate.consumption.map((c, i) => {
      return {
        segmentIdx: i,
        allocated: m.report.intermediate.utilization[i],
        consumed: c - m.report.intermediate.utilization[i],
      } as EnergySeries
    })
  } else {
    return m.report.intermediate.production.map((c, i) => {
      return {
        segmentIdx: i,
        allocated: c - m.report.intermediate.allocation[i],
        consumed: m.report.intermediate.allocation[i],
      } as EnergySeries
    })
  }
}