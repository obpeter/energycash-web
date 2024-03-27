import BaseService, {ENERGY_API_SERVER} from "./base.service";
import {
  EegEnergyReport,
  EnergyReportResponse,
  ParticipantReport,
  RecordV2,
  SelectedPeriod,
  SummaryReportData
} from "../models/energy.model";
import {AuthService} from "./auth.service";
import {reportDateGraphqlQuery, uploadEnergyGraphqlMutation} from "./graphql-query";
import {ExcelReportRequest} from "../models/reports.model";

export class EnergyService extends BaseService {
  public constructor(authService: AuthService) {
    super(authService);
  }

  async fetchReportV2(tenant: string, year: number, segment: number, type: string, participants: ParticipantReport[]): Promise<EnergyReportResponse> {
    const token = await this.lookupToken()
    return await fetch(`${ENERGY_API_SERVER}/eeg/report/v2`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({reportInterval: {type: type, year: year, segment: segment}, participants: participants})
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchLastReportEntryDate(tenant: string, token?: string): Promise<string> {
    if (!token) {
      token = await this.lookupToken()
    }
    return await fetch(`${ENERGY_API_SERVER}/query`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportDateGraphqlQuery(tenant))
    }).then(this.handleErrors).then(res => res.json().then(data => data.data ? data.data.lastEnergyDate : ""));
    //   return await Http.post({
    //     url: `${ENERGY_API_SERVER}/query`,
    //     method: 'POST',
    //     headers: {
    //       ...this.getSecureHeaders(token, tenant),
    //       'Accept': 'application/json',
    //       "Content-Type": "application/json",
    //     },
    //     data: JSON.stringify(reportDateGraphqlQuery(tenant))
    //   }).then(async res => {
    //     if (res.status === 200) {
    //       const data = await res.data;
    //       console.log("last Report DATE: ", data);
    //       return data.data ? data.data.lastEnergyDate : "";
    //     }
    //   })
  }
  async fetchIntraDayReportV2(tenant: string, selectedPeroid: SelectedPeriod): Promise<SummaryReportData[]> {
    const token = await this.lookupToken()

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
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(calcStartEndTime(selectedPeroid))
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchSummary(tenant: string, year: number, segment: number, type: string): Promise<RecordV2> {
    const token = await this.lookupToken()
    return await fetch(`${ENERGY_API_SERVER}/eeg/v2/summary`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({type: type, year: year, segment: segment})
    }).then(this.handleErrors).then(res => res.json());
  }

  async createReport(tenant: string, payload: ExcelReportRequest) {
    const token = await this.lookupToken()
    return fetch(`${ENERGY_API_SERVER}/eeg/excel/report/download`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(this.handleErrors)
      .then( response => this.handleDownload(response, "energy-export"));
  }

  async fetchReport(tenant: string, year: number, segment: number, type: string, token?: string): Promise<EegEnergyReport> {
    if (!token) {
      token = await this.lookupToken()
    }
    return await fetch(`${ENERGY_API_SERVER}/eeg/report`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({type: type, year: year, segment: segment})
    }).then(this.handleErrors).then(res => res.json());

    //   return await Http.post({
    //       url: `${ENERGY_API_SERVER}/query`,
    //       method: 'POST',
    //       headers: {
    //         ...this.getSecureHeaders(token, tenant),
    //         'Accept': 'application/json',
    //         "Content-Type": "application/json",
    //       },
    //       data: JSON.stringify(energyGraphqlQuery(tenant, year, month))
    //     }
    //   ).then(async res => {
    //     if (res.status === 200) {
    //       const data = await res.data;
    //       return data.data;
    //     }
    //   })
  }

  async uploadEnergyFile(tenant: string, sheet: string, data: File): Promise<boolean> {
    const token = await this.lookupToken()
    return await fetch(`${ENERGY_API_SERVER}/query`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeadersX(token, tenant),
        'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data'
      },
      body: await uploadEnergyGraphqlMutation(tenant, sheet, data)
    }).then(this.handleErrors).then(this.handleGQLResponse).then(res => true);
  }

}

// export const energyService = new EnergyService(authKeycloak);