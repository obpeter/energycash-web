import {AuthClient} from "../store/hook/AuthProvider";

export const API_API_SERVER = import.meta.env.REACT_APP_API_SERVER_URL;
export const FILESTORE_API_SERVER = import.meta.env.REACT_APP_FILESTORE_SERVER_URL;

export interface ErrorMessage {
  status: string
}

export class HttpError extends Error {
  public constructor(public reasonObject: ErrorMessage, public statusText: string) {
    super(statusText);
  }
}

class EegBaseService {
  authClient: AuthClient;

  public constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  protected getSecureHeaders(token: string, tenant: string) {
    return {'Authorization': `Bearer ${token}`, "tenant": tenant}
  }

  protected async handleErrors(response: Response) {
    if (!response.ok) {
      const errorBody = await response.json()
      throw new HttpError(errorBody, response.statusText);
    }
    return response;
  }

  protected async handleFilestoreResponse(response: Response) {
    const data = await response.json()
    if (data && data.data && data.data.deleteFile && data.data.deleteFile.message) {
      throw new Error(data.data.deleteFile.message)
    }
    return data
  }
}

export default EegBaseService