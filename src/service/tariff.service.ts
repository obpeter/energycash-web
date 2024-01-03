import EegBaseService, {API_API_SERVER} from "./base.service";
import {AuthClient} from "../store/hook/AuthProvider";
import {Eeg} from "../models/eeg.model";
import {authKeycloak} from "../keycloak";

class TariffService extends EegBaseService {
  public constructor(authClient: AuthClient) {
    super(authClient);
  }

  async archiveTariff(tenant: string, id: string): Promise<any> {
    const token = await this.authClient.getToken();
    return fetch(`${API_API_SERVER}/eeg/tariff/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept-Type': 'application/json'
      },
    }).then(this.handleErrors).then(res => res.json());
  }
}

export const tariffService = new TariffService(authKeycloak);