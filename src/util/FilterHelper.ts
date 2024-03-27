import {Metering, MeteringStatusType} from "../models/meteringpoint.model";


export function FilterByMeterState(meters: Metering[], status: MeteringStatusType[]): Metering[] {
  return meters.filter(m => status.includes(m.status))
}

export const meteringDisplayName = (m: Metering): string => {
  if (m.equipmentName && m.equipmentName.length > 0) {
    return `${m.equipmentName} - ${m.meteringPoint}`
  }
  return m.meteringPoint
}