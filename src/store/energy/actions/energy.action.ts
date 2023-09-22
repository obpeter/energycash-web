import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/energy.state";
import {eegService} from "../../../service/eeg.service";
import {MeteringEnergyGroupType} from "../../../models/meteringpoint.model";
import {ParticipantReport, SelectedPeriod} from "../../../models/energy.model";

export const fetchEnergyReport = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, year: number, segment: number, type: string, token?: string }) => {
    const { token, tenant, year, segment, type } = arg;
    const result = await eegService.fetchReport(tenant, year, segment, type, token);
    return { report: result };
  }
)

export const fetchEnergyReportV2 = createAsyncThunk(
  `${featureKey}/fetch/v2`,
  async (arg: { tenant: string, year: number, segment: number, type: string, participants: ParticipantReport[]}) => {
    const { participants, tenant, year, segment, type } = arg;
    const result = await eegService.fetchReportV2(tenant, year, segment, type, participants);
    return { report: result };
  }
)

export const setSelectedPeriod = createAction<SelectedPeriod>(`${featureKey}/selectPeriod`);