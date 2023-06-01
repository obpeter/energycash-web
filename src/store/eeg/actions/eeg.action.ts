import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/eeg.state";
import {eegService} from "../../../service/eeg.service";
import { Eeg } from "../../../models/eeg.model";

export const fetchEegModel = createAsyncThunk(
  `${featureKey}/fetchEeg`,
  async (arg: { token: string, tenant: string }) => {
    const { token, tenant } = arg;
    const result = await eegService.fetchEeg(token, tenant);
    return { eeg: result };
  }
)

export const updateEegModel = createAsyncThunk(
  `${featureKey}/updateEeg`,
  async (arg: { tenant: string, eeg: Record<string, any> }) => {
    const { tenant, eeg } = arg;
    const result = await eegService.updateEeg(tenant, eeg);
    return { tenant: tenant, eeg: result};
  }
)

export const selectTenant = createAction<string>(`${featureKey}/selectTenant`);