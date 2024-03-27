import {HttpError} from "./base.service";

export interface IErrorResponse {
  error: {code: number, error: string, message: string}
}

export class ErrorResponse {
  constructor(public error : {code: number, error: string, message: string}) {
  }
}

export const determineErrTxt = (error: any): string => {
  if (error instanceof ErrorResponse) {
    return "E_" + error.error.code
  }
  return error
}