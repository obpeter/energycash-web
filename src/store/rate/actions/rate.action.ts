import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/rate.state";
import {eegService} from "../../../service/eeg.service";
import {EegTariff} from "../../../models/eeg.model";
import {tariffService} from "../../../service/tariff.service";
import {HttpError} from "../../../service/base.service";

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

export const archiveRate = createAsyncThunk(
  `${featureKey}/archive`,
  async (arg: {rate: EegTariff, tenant: string}, { rejectWithValue }) => {
    const {rate, tenant} = arg
    try {
      await tariffService.archiveTariff(tenant, rate.id);
      return rate.id
    } catch (e) {
      if (e instanceof HttpError) {
        return rejectWithValue(e.reasonObject)
      }
      return rejectWithValue(e)
    }
  }
)

export const selectRate = createAction<EegTariff | undefined>(`${featureKey}/select/rate`);
