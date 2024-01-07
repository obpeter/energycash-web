import {EegParticipant} from "../models/members.model";
import {EnergyMeta} from "../models/energy.model";
import {Metering} from "../models/meteringpoint.model";
import moment from "moment";

export const filterActiveParticipantAndMeter = (participants: EegParticipant[], start: Date, end: Date) => {
  return participants.map(p => {
    return {
      ...p, meters: p.meters.filter(m =>
        (m.participantState
          ? (new Date(m.participantState.inactiveSince).getTime() >= end.getTime() && new Date(m.participantState.activeSince).getTime() <= end.getTime()) ||
          (new Date(m.participantState.inactiveSince).getTime() >= start.getTime() && new Date(m.participantState.inactiveSince).getTime() <= end.getTime())
          : true) || (m.status !== 'ACTIVE' && m.status !== 'INACTIVE')
      )
    } as EegParticipant
  }).filter(p => p.meters.length > 0)
}

export const filterActiveMeter = <T extends Record<string, EnergyMeta>>(meta: T, m: Metering, start: moment.Moment, end: moment.Moment) => {
  const metaInfo = meta[m.meteringPoint]
  if (metaInfo) {
    try {
      const startDate = moment(metaInfo.period_start, "DD.MM.YYYY HH:mm:ss")
      const endDate = moment(metaInfo.period_end, "DD.MM.YYYY HH:mm:ss")

      if (startDate.isBefore(end) && endDate.isAfter(start)) {
        return true
      }
    } catch(e) {
      console.log("Filter Meter: ", m, e, meta[m.meteringPoint])
    }
  }
  return false
}