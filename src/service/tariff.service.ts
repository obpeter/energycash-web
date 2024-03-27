import EegBaseService, {API_API_SERVER} from "./base.service";
import {AuthService} from "./auth.service";

export class TariffService extends EegBaseService {
  public constructor(authService: AuthService) {
    super(authService);
  }

  async archiveTariff(tenant: string, id: string): Promise<any> {
    const token = await this.lookupToken()
    return fetch(`${API_API_SERVER}/eeg/tariff/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept-Type': 'application/json'
      },
    }).then(this.handleErrors).then(res => res.json());
  }
}

// export const tariffService = new TariffService(authKeycloak);