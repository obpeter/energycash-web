

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

export interface ProducerReport {
  allocated: number
  total_production: number
}

export interface ConsumerReport extends ProducerReport{
  consumed: number
}

export interface SelectedPeriod {
  type: string
  year: number
  segment: number
}