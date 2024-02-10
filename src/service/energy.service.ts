import BaseService, {ENERGY_API_SERVER} from "./base.service";
import {AuthClient} from "../store/hook/AuthProvider";
import {authKeycloak} from "../keycloak";
import {
  EnergyReportResponse,
  ParticipantReport,
  RecordV2,
  SelectedPeriod,
  SummaryReportData
} from "../models/energy.model";

class EnergyService extends BaseService {
  public constructor(authClient: AuthClient) {
    super(authClient);
  }

  async fetchIntraDayReportV2(tenant: string, selectedPeroid: SelectedPeriod): Promise<SummaryReportData[]> {
    const token = await this.authClient.getToken();
    const calcStartEndTime = (selectedPeroid: SelectedPeriod) => {
      const year = selectedPeroid.year
      const segment = selectedPeroid.segment
      const type = selectedPeroid.type
      switch (type) {
        case "YM":
          return {start: new Date(year, segment - 1).getTime(), end: new Date(year, segment, 0).getTime()}
        case "YQ":
          return {start: new Date(year, (segment * 3) - 3).getTime(), end: new Date(year, (segment * 3), 0).getTime()}
        case "YH":
          return {start: new Date(year, (segment * 6) - 6).getTime(), end: new Date(year, (segment * 6), 0).getTime()}
        default:
          return {start: new Date(year, 0).getTime(), end: new Date(year, 11, 31).getTime()}
      }
      throw new Error("wrong period type. Expected [Y, YH, YQ, YM]. Got " + type)
    }

    return await fetch(`${ENERGY_API_SERVER}/eeg/v2/intradayreport`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(calcStartEndTime(selectedPeroid))
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchSummary(tenant: string, year: number, segment: number, type: string): Promise<RecordV2> {
    const token = await this.authClient.getToken();
    return await fetch(`${ENERGY_API_SERVER}/eeg/v2/summary`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({type: type, year: year, segment: segment})
    }).then(this.handleErrors).then(res => res.json());
  }
}

export const energyService = new EnergyService(authKeycloak);