import {createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states";
import {eegService} from "../../../service/eeg.service";
import {BillingConfig} from "../../../models/eeg.model";

export const fetchBillingConfig = createAsyncThunk(
    `${featureKey}/fetch`,
    async (arg: {tenant: string, token?: string}) => {
        const { tenant, token} = arg;
        const result = await eegService.fetchBillingConfigByTenantId(tenant, token);
        return {billingConfig : result};
    }
);

export const createBillingConfig = createAsyncThunk(
    `${featureKey}/create`,
    async (arg: {tenant: string,  token?: string}) => {
        const { tenant, token} = arg;
        const result = await eegService.createBillingConfig(tenant, token);
        return {billingConfig : result};
    }
);

export const updateBillingConfig = createAsyncThunk(
    `${featureKey}/update`,
    async (arg: {tenant: string, billingConfig: BillingConfig, token?: string}) => {
        const { tenant, billingConfig, token} = arg;
        const result = await eegService.updateBillingConfig(tenant, billingConfig, token);
        return {billingConfig : result};
    }
);

export const uploadImageBillingConfig = createAsyncThunk(
    `${featureKey}/uploadImage`,
    async (arg: {tenant: string, billingConfig : BillingConfig, imageType: 'logo' | 'footer', file: File, token?: string}) => {
        const { tenant, billingConfig, imageType, file, token} = arg;
        const result = await eegService.uploadImageBillingConfig(tenant, billingConfig, imageType, file);
        return {billingConfig : result};
    }
);

export const deleteImageBillingConfig = createAsyncThunk(
    `${featureKey}/deleteImage`,
    async (arg: {tenant: string, billingConfig : BillingConfig, imageType: 'logo' | 'footer', token?: string}) => {
        const { tenant, billingConfig, imageType, token} = arg;
        const result = await eegService.deleteImageBillingConfig(tenant, billingConfig, imageType);
        return {billingConfig : result};
    }
);
