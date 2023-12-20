import {BillingConfig} from "../../../models/eeg.model";

export const featureKey = 'billingConfig';

export interface BillingConfigState {
  isFetching: boolean;
  billingConfig: BillingConfig | null;
  errorMessage : string | null;
}
export const initialState: BillingConfigState = {
  isFetching: false,
  billingConfig: {} as BillingConfig,
  errorMessage : null
};