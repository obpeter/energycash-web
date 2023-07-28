import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/rate.state";
import {eegService} from "../../../service/eeg.service";
import {EegRate, EegTariff} from "../../../models/eeg.model";

export const fetchRatesModel = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { token: string, tenant: string }) => {
    const { token, tenant } = arg;
    const result = await eegService.fetchRates(token, tenant);
    return { rates: result };
  }
)

export const saveNewRate = createAsyncThunk(
  `${featureKey}/save`,
  async (arg: { rate: EegTariff, tenant: string }) => {
    const {rate, tenant} = arg
    const result = await eegService.addRate(tenant, rate);
    return result;
  }
)

export const updateRate = createAsyncThunk(
  `${featureKey}/update`,
  async (arg: {rate: EegTariff, tenant: string}) => {
      const {rate, tenant} = arg
      const result = await eegService.addRate(tenant, rate);
      return result;
  }
)

export const selectRate = createAction<EegTariff | undefined>(`${featureKey}/select/rate`);
