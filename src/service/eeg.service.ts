import {BillingConfig, Eeg, EegNotification, EegTariff} from "../models/eeg.model";
import {EegParticipant} from "../models/members.model";
import {AuthClient} from "../store/hook/AuthProvider";
import {authKeycloak} from "../keycloak";
import {
  ClearingPreviewRequest, ClearingPreviewResponse, InvoiceDocumentResponse,
  Metering,
  MeteringEnergyGroupType,
  ParticipantBillType,
  BillingRun
} from "../models/meteringpoint.model";
import {EegEnergyReport} from "../models/energy.model";
import {
  eegGraphqlQuery,
  energyGraphqlQuery,
  reportDateGraphqlQuery,
  uploadEnergyGraphqlMutation
} from "./graphql-query";
import {ExcelReportRequest} from "../models/reports.model";

const ENERGY_API_SERVER = process.env.REACT_APP_ENERGY_SERVER_URL;
const BILLING_API_SERVER = process.env.REACT_APP_BILLING_SERVER_URL;
const API_API_SERVER = process.env.REACT_APP_API_SERVER_URL;

class EegService {

  authClient: AuthClient;

  public constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  private getSecureHeaders(token: string, tenant: string) {
    return {'Authorization': `Bearer ${token}`, "tenant": tenant}
  }

  private handleErrors(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  async handleDownload (response : Response, defaultFilename : string) : Promise<boolean> {
    response.blob().then(file => {
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);

      let filename = response.headers.get('Filename')
      if (!filename) {
        const disposition = response.headers.get('Content-Disposition');
        const dispositionParts = disposition ? disposition.split(';') : null;
        filename = dispositionParts ? dispositionParts[1].split('=')[1]: null;
        filename = filename ? filename.replaceAll('"', '') : null;
      }
      if (!filename)
        filename = defaultFilename

      const link = document.createElement('a');
      link.href = fileURL
      link.setAttribute('download', filename)

      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode?.removeChild(link);
    });
    return true;
  }


  async fetchEeg(token: string, tenant: string): Promise<Eeg> {
    return await fetch(`${API_API_SERVER}/query`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eegGraphqlQuery)
    }).then(this.handleErrors).then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        return data.data.eeg;
      }
    });
  }

  async updateEeg(tenant: string, eeg: Record<string, any>): Promise<Eeg> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eeg)
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchParicipants(tenant: string, token?: string): Promise<EegParticipant[]> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${API_API_SERVER}/participant`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async createParticipant(tenant: string, participant: EegParticipant): Promise<EegParticipant> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participant)
    }).then(this.handleErrors).then(res => res.json());
  }

  async updateParticipant(tenant: string, participant: EegParticipant): Promise<EegParticipant> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant/${participant.id}`, {
      method: 'PUT',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participant)
    }).then(this.handleErrors).then(res => res.json());
  }

  async confirmParticipant(tenant: string, pid: string, data: FormData): Promise<EegParticipant> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant/${pid}/confirm`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      },
      body: data
    }).then(this.handleErrors).then(res => res.json());

  }

  async fetchRates(token: string, tenant: string): Promise<EegTariff[]> {
    return await fetch(`${API_API_SERVER}/eeg/tariff`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(this.handleErrors).then(async res => res.json());
  }

  async addRate(tenant: string, rate: EegTariff): Promise<EegTariff> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/tariff`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rate)
    }).then(this.handleErrors).then(async res => res.json());
  }

  async createMeteringPoint(tenant: string, participantId: string, meter: Metering): Promise<{
    participantId: string,
    meter: Metering
  }> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/create`, {
      method: 'PUT',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meter)
    }).then(this.handleErrors)
      .then((res) => res.json())
      .then(m => {return {participantId: participantId, meter: m}});
  }

  async updateMeteringPoint(tenant: string, participantId: string, meter: Metering): Promise<Metering> {
    const token = await this.authClient.getToken();
    // return new Promise<Metering>((resolve, reject) => resolve(meter));
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/update/${meter.meteringPoint}`, {
      method: 'PUT',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meter)
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchReport(tenant: string, year: number, segment: number, type: string, token?: string): Promise<EegEnergyReport> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${ENERGY_API_SERVER}/eeg/report`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
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

  async fetchLastReportEntryDate(tenant: string, token?: string): Promise<string> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${ENERGY_API_SERVER}/query`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
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

  async fetchBillingRun(tenant: string, clearingPeriodType: string, clearingPeriodIdentifier: string, token?: string): Promise<BillingRun[]> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch( `${BILLING_API_SERVER}/api/billingRuns/${tenant}/${clearingPeriodType}/${clearingPeriodIdentifier}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchBillingRunById(tenant: string, billingRundId : string, token?: string): Promise<BillingRun> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch( `${BILLING_API_SERVER}/api/billingRuns/${billingRundId}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchBilling(tenant: string, invoiceRequest: ClearingPreviewRequest): Promise<ClearingPreviewResponse> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/api/billing`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceRequest)
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchParticipantAmounts(tenant : string, billingRunId : string) : Promise<ParticipantBillType[]> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/api/billingRuns/${billingRunId}/participantAmounts`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    }).then(this.handleErrors).then(res => res.json())
  }

  async fetchBillingDocumentFiles(tenant: string): Promise<InvoiceDocumentResponse[]> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/api/billingDocumentFiles/tenant/${tenant.toUpperCase()}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      },
    }).then(this.handleErrors).then(res => res.json());
  }

  async downloadBillingDocument(tenant: string, filedataId: string): Promise<Blob> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/api/fileData/${filedataId}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => res.blob());
  }

  async exportBillingArchive(tenant: string, billingRunId : string, token? : string): Promise<boolean> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${BILLING_API_SERVER}/api/billingRuns/${billingRunId}/billingDocuments/archive`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => this.handleDownload(res, billingRunId+".zip"));
  }

  async exportBillingExcel(tenant: string, billingRunId : string, token? : string): Promise<boolean> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${BILLING_API_SERVER}/api/billingRuns/${billingRunId}/billingDocuments/xlsx`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => this.handleDownload(res, billingRunId+".xlsx"));
  }

  async billingRunSendmail(tenant: string, billingRunId : string, token? : string): Promise<boolean> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${BILLING_API_SERVER}/api/billingRuns/${billingRunId}/billingDocuments/sendmail`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => true);
  }

  async fetchBillingConfigByTenantId(tenant: string, token?: string): Promise<BillingConfig> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch( `${BILLING_API_SERVER}/api/billingConfigs/tenant/${tenant}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async fetchBillingConfigById(billingConfigId: string, tenant : string, token?: string): Promise<BillingConfig> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch( `${BILLING_API_SERVER}/api/billingConfigs/${billingConfigId}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async createBillingConfig(tenant: string, token?: string): Promise<BillingConfig> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    const result = fetch( `${BILLING_API_SERVER}/api/billingConfigs`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({tenantId : tenant, invoiceNumberStart : 0,
                          creditNoteNumberStart: 0, documentNumberSequenceLength: 5} as BillingConfig)
    }).then(this.handleErrors).then(res => res.json())

    return await result.then(
        data => {
          return this.fetchBillingConfigById(data, tenant, token);
        }
    )
  }

  async updateBillingConfig(tenant: string, billingConfig: BillingConfig, token?: string): Promise<BillingConfig> {
    if (!token) {
      token = await this.authClient.getToken();
    }

    const result = await fetch( `${BILLING_API_SERVER}/api/billingConfigs/${billingConfig.id}`, {
      method: 'PUT',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(billingConfig)
    }).then(this.handleErrors).then(res => {});

    return this.fetchBillingConfigById(billingConfig.id, tenant, token);

  }

  async uploadImageBillingConfig(tenant: string, billingConfig : BillingConfig, imageType: "logo" | "footer", file: File): Promise<BillingConfig> {
    const token = await this.authClient.getToken();
    const body = new FormData();
    body.append('file', file)

    const result = await fetch(`${BILLING_API_SERVER}/api/billingConfigs/${billingConfig.id}/${imageType}Image`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      },
      body: body
    }).then(this.handleErrors).then(res => {});

    return this.fetchBillingConfigById(billingConfig.id, tenant, token);
  }

  async deleteImageBillingConfig(tenant: string, billingConfig : BillingConfig, imageType: "logo" | "footer"): Promise<BillingConfig> {
    const token = await this.authClient.getToken();

    const result = await fetch(`${BILLING_API_SERVER}/api/billingConfigs/${billingConfig.id}/${imageType}Image`, {
      method: 'DELETE',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      }
    }).then(this.handleErrors).then(res => {});

    return this.fetchBillingConfigById(billingConfig.id, tenant, token);
  }

  async getImageBillingConfig(tenant: string, billingConfig : BillingConfig, imageType: "logo" | "footer"): Promise<Blob> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/api/billingConfigs/${billingConfig.id}/${imageType}Image`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      }
    }).then(this.handleErrors).then(response => response.blob());
  }

  async syncMeteringPointList(tenant: string): Promise<EegEnergyReport> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/sync/participants`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(this.handleErrors).then(res => res.json());
  }

  async syncMeteringPoint(tenant: string, participantId: string, meter: string, direction: string, from: number, to: number): Promise<EegEnergyReport> {
    const token = await this.authClient.getToken();

    const body = {meteringPoint: meter, direction: direction, from: from, to: to}
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/syncenergy`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(this.handleErrors).then(res => res.json());
  }

  async registerMeteringPoint(tenant: string, participantId: string, meter: string, direction: string): Promise<EegEnergyReport> {
    const token = await this.authClient.getToken();
    const body = {meteringPoint: meter, direction: direction}
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/register`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(this.handleErrors).then(res => res.json());
  }

  async startExcelExport(tenant: string, year: number, month: number): Promise<boolean> {
    const token = await this.authClient.getToken();
    return await fetch(`${ENERGY_API_SERVER}/eeg/excel/export/${year}/${month}`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      },
    })
      .then(this.handleErrors)
      .then(res => true);
  }


  async createReport(tenant: string, payload: ExcelReportRequest) {
    const token = await this.authClient.getToken();
    return fetch(`${ENERGY_API_SERVER}/eeg/excel/report/download`, {
        method: 'POST',
        headers: {
          ...this.getSecureHeaders(token, tenant),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
      .then(this.handleErrors)
      .then( response => this.handleDownload(response, "energy-export"));
  }

  async uploadEnergyFile(tenant: string, sheet: string, data: File): Promise<boolean> {
    const token = await this.authClient.getToken();
    return await fetch(`${ENERGY_API_SERVER}/query`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data'
      },
      body: await uploadEnergyGraphqlMutation(tenant, sheet, data)
    }).then(this.handleErrors).then(res => true);
  }

  async uploadMasterDataFile(tenant: string, sheet: string, data: File): Promise<boolean> {
    const token = await this.authClient.getToken();

    const formData = new FormData();
    formData.append("sheet", sheet)
    formData.append("masterdatafile", data)

    return await fetch(`${API_API_SERVER}/eeg/import/masterdata`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
      body: formData
    }).then(this.handleErrors).then(res => true);
  }

  async getNotifications(tenant: string, start: number): Promise<EegNotification[]> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/notifications/${start}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => res.json());
  }
}

export const eegService = new EegService(authKeycloak);