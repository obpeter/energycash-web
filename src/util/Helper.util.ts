import {EegParticipant} from "../models/members.model";
import {ReportType, SelectedPeriod} from "../models/energy.model";
import {CpPeriodType} from "../models/reports.model";


export const formatedName = (participant: EegParticipant) => {
  let title = ""
  if (participant.titleBefore && participant.titleBefore.length > 0) {
    title = participant.titleBefore + " ";
  }

  return title + `${participant.firstname} ${participant.lastname}`
}

const splitDatePattern = /\.|\s|:/
export const splitDate = (date: string) => date.split(splitDatePattern).map(s=>Number(s))
export const calc = (e:number[]) => e.length > 2 ? (e[2]*372)+(e[1]*31)+e[0] : 0

export const yearMonth = (date: string) => splitDate(date).slice(1,3)


export function toRecord<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T> {
  return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>)
}

export const formatMeteringPointString = (m: string | undefined) => {
  if (m && m.length > 32) {
    return m.slice(0, 8) + "..." + m.slice(23)
  }
  return m
}

export const isParticipantActivated = (participants: EegParticipant[], id: string) => {
  return participants.find((p) => p.id === id && p.status === 'ACTIVE') !== undefined
}

export const getPeriodSegment = (period: string, month: number) => {
  switch (period) {
    case 'Y': return 0
    case 'YH': return month < 7 ? 1 : 2
    case 'YQ': return (month < 4 ? 1 : month < 7 ? 2 : month < 10 ? 3 : 4)
    case 'YM': return month > 12 ? 12 : month < 1 ? 1 : month
    default:
      return 0
  }
}

const splitCpPeriod = (cpPeriod: CpPeriodType) => {
  const [beginMonth, beginYear] = yearMonth(cpPeriod.begin)
  const [endMonth, endYear] = yearMonth(cpPeriod.end)

  return [beginYear, beginMonth, endYear, endMonth]
}

export const determinePeriodEnd = (period: SelectedPeriod) => {
  switch (period.type) {
    case "Y": return [12, period.year]
    case "YH": return [period.segment * 6, period.year]
    case "YQ": return [period.segment * 3, period.year]
    default: return [period.segment, period.year]
  }
}

export const calcSegment = (period: SelectedPeriod, cpPeriod?: CpPeriodType) => {
  const [month, year] = determinePeriodEnd(period)
  if (cpPeriod) {
    const [beginYear, beginMonth, endYear, endMonth] = splitCpPeriod(cpPeriod)
    if (endYear > period.year) {
      return [year, month]
    } else {
      return [year, Math.min(endMonth, month)]
    }
  }
  return [year, month]
}

export const createNewPeriod = (period: SelectedPeriod | undefined, target: ReportType, currentSegmentIdx: number, cpPeriod?: CpPeriodType) => {
  if (period !== undefined) {
    switch (target) {
      case 'Y':
        return {type: target, segment: 0, year: period.year}
      case 'YM':
        const splitedPeriod = cpPeriod && splitCpPeriod(cpPeriod)
        switch (period.type) {
          case 'Y':
            return {type: target, segment: splitedPeriod ? splitedPeriod[3] : currentSegmentIdx, year: splitedPeriod ? splitedPeriod[2] : period.year}
          case 'YH':
            return {type: target, segment: splitedPeriod ? splitedPeriod[3] : period.segment === 2 ? 6 : 1, year: splitedPeriod ? splitedPeriod[2] : period.year}
          case 'YQ':
            return {type: target, segment: splitedPeriod ? splitedPeriod[3] : period.segment === 2 ? 3 : period.segment === 3 ? 6 : period.segment === 4 ? 9 : 1, year: splitedPeriod ? splitedPeriod[2] : period.year}
          default:
            return period
        }
      case 'YQ':
        switch (period.type) {
          case 'Y':
            return {type: target, segment: Math.ceil((cpPeriod ? splitCpPeriod(cpPeriod)[3] : currentSegmentIdx) / 3), year: period.year}
          case 'YH':
            return {type: target, segment: period.segment === 2 ? 3 : 1, year: period.year}
          case 'YM':
            return {type: target, segment: Math.ceil(period.segment / 3), year: period.year}
          default:
            return period
        }
      case 'YH':
        switch (period.type) {
          case 'Y':
            return {type: target, segment: Math.max(1, Math.ceil((cpPeriod ? splitCpPeriod(cpPeriod)[3] : currentSegmentIdx) / 6)), year: period.year}
          case 'YQ':
            return {type: target, segment: Math.max(1, Math.ceil(period.segment / 2)), year: period.year}
          case 'YM':
            return {type: target, segment: Math.max(1, Math.ceil(period.segment / 6)), year: period.year}
          default:
            return period
        }
      default: return period
    }
  }
  return undefined
}

export const calcCurrentPeriod = (period: SelectedPeriod) => {
  const currentDate =  new Date(Date.now())
  const currentPeroid = {type: period.type, year: currentDate.getFullYear(), segment: 0} as SelectedPeriod

  switch (period.type) {
    case "YM":
      currentPeroid.segment = currentDate.getMonth() + 1
      break;
    case "YQ":
      const m = currentDate.getMonth() + 1
      currentPeroid.segment = (m < 4 ? 1 : m < 7 ? 2 : m < 10 ? 3 : 4)
      break;
    case "YH":
      currentPeroid.segment = (currentDate.getMonth() + 1 < 7 ? 1 : 2)
  }
    return currentPeroid;
}

export function findPartial<O extends object, OT extends keyof object>(obj: O, key: string): Partial<O> {
  let result = {}
  Object.keys(obj).forEach(k => {
    if (typeof obj[k as OT] === 'object') {
      const sub = findPartial(obj[k as OT], key)
      if (Object.keys(sub).length !== 0) {
        result = {[k]: sub}
      }
    } else if (k === key) {
      result = {[k]: obj[k as OT]}
    }
  })
  return result
}

// Kuerzt lange Timestampangaben. Z.B.: 2023-07-31T19:55:04.234769 -> 2023-07-31, 19:55
export function reformatDateTimeStamp(dateTimeStampString : string) : string {
  if (dateTimeStampString && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*$/.test(dateTimeStampString)) {
    return dateTimeStampString.substring(0,10)+", "+dateTimeStampString.substring(11,16)
  } else {
    return "";
  }
}

export function GetWeek(date: Date) {
  let currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
  let yearOfThursday = currentThursday.getFullYear();
  let firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
  let weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
  return weekNumber;
}