import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/billing.state";
import {eegService} from "../../../service/eeg.service";
import {EegRate} from "../../../models/eeg.model";
import {ClearingPreviewRequest, MeteringEnergyGroupType} from "../../../models/meteringpoint.model";

export const fetchEnergyBills = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, invoiceRequest: ClearingPreviewRequest}) => {
    const { tenant, invoiceRequest } = arg;
    const result = await eegService.startEnergyBill(tenant, invoiceRequest);
    return { billing: result };
  }
)