import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/energy.state";
import {eegService} from "../../../service/eeg.service";
import {MeteringEnergyGroupType} from "../../../models/meteringpoint.model";
import {SelectedPeriod} from "../../../models/energy.model";

export const fetchEnergyReport = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, year: number, month: number, token?: string }) => {
    const { token, tenant, year, month } = arg;
    const result = await eegService.fetchReport(tenant, year, month, token);
    return { report: result };
  }
)

export const setSelectedPeriod = createAction<SelectedPeriod>(`${featureKey}/selectPeriod`);