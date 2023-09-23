import BaseService, {API_API_SERVER} from "./base.service";
import {AuthClient} from "../store/hook/AuthProvider";
import {authKeycloak} from "../keycloak";


class ParticipantService extends BaseService {
  public constructor(authClient: AuthClient) {
    super(authClient);
  }

  async archiveParticipant(tenant: string, id: string): Promise<any> {
    const token = await this.authClient.getToken();
    return fetch(`${API_API_SERVER}/participant/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept-Type': 'application/json'
      },
    }).then(this.handleErrors).then(res => res.json());
  }
}

export const participantService = new ParticipantService(authKeycloak);