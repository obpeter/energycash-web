import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ErrorState, featureKey} from "../states/eeg.state";
import {Api} from "../../../service";

export const fetchEegModel = createAsyncThunk(
  `${featureKey}/fetchEeg`,
  async (arg: { token?: string, tenant: string }) => {
    const { token, tenant } = arg;
    const result = await Api.eegService.fetchEeg(tenant, token);
    return { eeg: result };
  }
)

export const updateEegModel = createAsyncThunk(
  `${featureKey}/updateEeg`,
  async (arg: { tenant: string, eeg: Record<string, any> }) => {
    const { tenant, eeg } = arg;
    const result = await Api.eegService.updateEeg(tenant, eeg);
    return { tenant: tenant, eeg: result};
  }
)

export const selectTenant = createAction<string>(`${featureKey}/selectTenant`);

export const setErrorState = createAction<ErrorState>(`${featureKey}/setErrorState`)
export const clearErrorState = createAction<void>(`${featureKey}/clearErrorState`)