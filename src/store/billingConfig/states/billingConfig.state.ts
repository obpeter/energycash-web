import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {BillingConfig} from "../../../models/eeg.model";
import {EegParticipant} from "../../../models/members.model";
import {BillingRun} from "../../../models/meteringpoint.model";

export const featureKey = 'billingConfig';

export interface BillingConfigState {
  isFetching: boolean;
  billingConfig: BillingConfig;
  errorMessage : string | null;
}
export const initialState: BillingConfigState = {
  isFetching: false,
  billingConfig: {} as BillingConfig,
  errorMessage : null
};