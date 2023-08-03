import {BillingRun} from "../../../models/meteringpoint.model";

export const featureKey = 'billingRun';

export interface BillingRunState {
  isFetching: boolean;
  billingRun: BillingRun;
  errorMessage : string | null;
}
export const initialState: BillingRunState = {
  isFetching: false,
  billingRun: {} as BillingRun,
  errorMessage : null
};