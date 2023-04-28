import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/billing.state";
import {eegService} from "../../../service/eeg.service";
import {EegRate} from "../../../models/eeg.model";
import {MeteringEnergyGroupType} from "../../../models/meteringpoint.model";

export const fetchEnergyBills = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, energyMeterGroup: MeteringEnergyGroupType[]}) => {
    const { tenant, energyMeterGroup } = arg;
    const result = await eegService.fetchEnergyBill(tenant, energyMeterGroup);
    return { billing: result };
  }
)