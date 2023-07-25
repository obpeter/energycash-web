

export interface EnergyMeta {
  sourceIdx: number
  name: string
  period_start: string
  period_end: string
  dir: "GENERATION" | "CONSUMPTION"
}

export interface EnergyReport {
  id: string
  allocated: number[]
  consumed: number[]
  produced: number[]
  distributed: number[]
  total_produced: number
}

export interface EnergyReportModel {
  report: EnergyReport
  meta: EnergyMeta[]
  intermediateReportResults: EnergyReport[]
}

export interface EegEnergyReport {
  eeg: EnergyReportModel
}

export interface BaseReport {
  allocated: number
  total_production: number
}

export interface ConsumerReport extends BaseReport {
  consumed: number
}

export interface ProducerReport extends BaseReport {
  produced: number
}

export type ReportType = 'YH' | "YQ" | 'YM' | 'Y'
export interface SelectedPeriod {
  type: ReportType
  year: number
  segment: number
}

export interface EnergySeries {
  segmentIdx: number,
  allocated: number,
  consumed: number,
}

export interface MeterEnergySeries {
  period: SelectedPeriod,
  series: EnergySeries[],
}