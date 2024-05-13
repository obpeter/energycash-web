import {HttpError} from "./base.service";
import i18n from "../util/I18n";

export interface IErrorResponse {
  error: {code: number, error: string, message: string}
}

export class ErrorResponse {
  constructor(public error : {code: number, error: string, message: string}) {
  }
}

export const determineErrTxt = (error: any): string => {
  if (error instanceof ErrorResponse) {
    return i18n.t("E_" + error.error.code + "_" + error.error.error, { ns: 'error' })
  }
  return error
}