import {createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states";
import {eegService} from "../../../service/eeg.service";

export const fetchBillingRun = createAsyncThunk(
    `${featureKey}/fetchBillingRun`,
    async (arg: {tenant: string, clearingPeriodType: string, clearingPeriodIdentifier: string, token?: string}) => {
        const { tenant, clearingPeriodType, clearingPeriodIdentifier, token} = arg;
        const result = await eegService.fetchBillingRun(tenant, clearingPeriodType, clearingPeriodIdentifier, token);
        return {billingRunList : result};
    }
);

export const fetchBillingRunById = createAsyncThunk(
    `${featureKey}/fetchBillingRunById`,
    async (arg: {tenant: string, billingRunId: string, token?: string}) => {
        const { tenant, billingRunId, token} = arg;
        const result = await eegService.fetchBillingRunById(tenant, billingRunId, token);
        return {billingRun : result};
    }
);

export const billingRunSendmail = createAsyncThunk(
    `${featureKey}/sendBilling`,
    async (arg: {tenant: string, billingRunId: string, token?: string}) => {
        const { tenant, billingRunId, token} = arg;
        const result = await eegService.billingRunSendmail(tenant, billingRunId, token);
        return {billingRun : result};
    }
);
