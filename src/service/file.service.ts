import BaseService, {FILESTORE_API_SERVER} from "./base.service";
import {AuthClient} from "../store/hook/AuthProvider";
import {ContractInfo} from "../models/members.model";
import {deleteContractFilesMutation, loadContractFilesQuery, uploadContractFilesMutation} from "./graphql-query";
import {authKeycloak} from "../keycloak";

class FileService extends BaseService {
  public constructor(authClient: AuthClient) {
    super(authClient);
  }

  // Filestore Services
  async loadContractDocumentInfos(tenant: string, participantId: string): Promise<ContractInfo[]> {
    const token = await this.authClient.getToken();
    return await fetch(`${FILESTORE_API_SERVER}/graphql`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        'Content-Type': "application/json"
      },
      body: JSON.stringify(loadContractFilesQuery(tenant, participantId))
    }).then(this.handleErrors).then(res => res.json()).then(res => res.data.files);
  }

  async uploadContractDocuments(tenant: string, participantId: string, files: File[]) {
    const token = await this.authClient.getToken();
    return await fetch(`${FILESTORE_API_SERVER}/graphql`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
      },
      // body: JSON.stringify(uploadContractFilesMutation(tenant, files, participantId))
      body: await uploadContractFilesMutation(tenant, files, participantId)
    }).then(this.handleErrors).then(res => res.json());

  }

  async deleteContractDocuments(tenant: string, fileId: string) {
    const token = await this.authClient.getToken();
    return await fetch(`${FILESTORE_API_SERVER}/graphql`, {
      method: 'POST',
      headers: {
        ...this.getSecureHeaders(token, tenant),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteContractFilesMutation(fileId))
    }).then(this.handleFilestoreResponse);

  }

  async downloadDocument(tenant: string, fileId: string): Promise<Blob> {
    const token = await this.authClient.getToken();
    return await fetch(`${FILESTORE_API_SERVER}/filestore/${fileId}`, {
      method: 'GET',
      headers: {
        ...this.getSecureHeaders(token, tenant),
      },
    }).then(this.handleErrors).then(res => res.blob());
  }

}

export const fileService = new FileService(authKeycloak);