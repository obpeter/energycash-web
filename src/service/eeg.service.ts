import {Eeg, EegTariff} from "../models/eeg.model";
import {EegParticipant} from "../models/members.model";
import {AuthClient} from "../store/hook/AuthProvider";
import {authKeycloak} from "../keycloak";
import {Metering, MeteringEnergyGroupType, ParticipantBillType} from "../models/meteringpoint.model";
import {EegEnergyReport} from "../models/energy.model";
import {eegGraphqlQuery, energyGraphqlQuery, reportDateGraphqlQuery} from "./graphql-query";

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

  async fetchEeg(token: string, tenant: string): Promise<Eeg> {
    return await fetch(`${API_API_SERVER}/query`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eegGraphqlQuery)
    }).then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        return data.data.eeg;
      }
    });
  }

  async updateEeg(tenant: string, eeg: Eeg): Promise<Eeg> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eeg)
    }).then(res => res.json());
  }
  // async fetchEeg(token: string, tenant: string): Promise<Eeg> {
  //   return await fetch('./api/eeg',{
  //     method: 'GET',
  //     headers: { ...this.getSecureHeaders(token, tenant),
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(res => res.json());
  // }


  // async fetchParicipants(tenant: string): Promise<EegParticipant[]> {
  //   return await fetch('/assets/data/data.json').then(res => res.json());
  // }

  async fetchParicipants(tenant: string, token?: string): Promise<EegParticipant[]> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${API_API_SERVER}/participant`, {
      method: 'GET',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }

  async createParticipant(tenant: string, participant: EegParticipant): Promise<EegParticipant> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant`, {
      method: 'POST',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participant)
    }).then(res => res.json());
  }

  async updateParticipant(tenant: string, participant: EegParticipant): Promise<EegParticipant> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant/${participant.id}`, {
      method: 'PUT',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(participant)
    }).then(res => res.json());
  }

  async confirmParticipant(tenant: string, pid: string, data: FormData): Promise<boolean> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/participant/${pid}/confirm`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      },
      body: data
    }).then(res => true);

  }

  async fetchRates(token: string, tenant: string): Promise<EegTariff[]> {
    return await fetch(`${API_API_SERVER}/eeg/tariff`, {
      method: 'GET',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(async res => res.json());
  }

  async addRate(tenant: string, rate: EegTariff): Promise<EegTariff> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/tariff`, {
      method: 'POST',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rate)
    }).then(async res => res.json());
  }

  async createMeteringPoint(tenant: string, participantId: string, meter: Metering): Promise<Metering> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/create`, {
      method: 'PUT',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meter)
    }).then(res => res.json());
  }

  async updateMeteringPoint(tenant: string, participantId: string, meter: Metering): Promise<Metering> {
    const token = await this.authClient.getToken();
    // return new Promise<Metering>((resolve, reject) => resolve(meter));
    return await fetch(`${API_API_SERVER}/meteringpoint/${participantId}/update/${meter.meteringPoint}`, {
      method: 'PUT',
      headers: { ... this.getSecureHeaders(token, tenant),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meter)
    }).then(res => res.json());
  }

  async fetchReport(tenant: string, year: number, month: number, token?: string): Promise<EegEnergyReport> {
    if (!token) {
      token = await this.authClient.getToken();
    }
    return await fetch(`${ENERGY_API_SERVER}/eeg/${year}/${month}`, {
      method: 'GET',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      },
    }).then(res => res.json());

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
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportDateGraphqlQuery(tenant))
    }).then(res => res.json().then(data => data.data ? data.data.lastEnergyDate : ""));
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

  async fetchEnergyBill(tenant: string, energyGroup: MeteringEnergyGroupType[]): Promise<ParticipantBillType[]> {
    const token = await this.authClient.getToken();
    return await fetch(`${BILLING_API_SERVER}/cash/preview`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(energyGroup)
    }).then(res => res.json());
  }

  async syncMeteringPointList(tenant: string): Promise<EegEnergyReport> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/sync/participants`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }

  async syncMeteringPoint(tenant: string, meter: Metering): Promise<EegEnergyReport> {
    const token = await this.authClient.getToken();
    return await fetch(`${API_API_SERVER}/eeg/sync/meterpoint`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      },
      body: JSON.stringify(meter)
    }).then(res => res.json());
  }

  async startExcelExport(tenant: string, year: number, month: number): Promise<boolean> {
    const token = await this.authClient.getToken();
    return await fetch(`${ENERGY_API_SERVER}/eeg/excel/export/${year}/${month}`, {
      method: 'POST',
      headers: { ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json'
      },
    }).then(res => true);

  }
}

export const eegService = new EegService(authKeycloak);