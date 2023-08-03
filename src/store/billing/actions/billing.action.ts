import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states";
import {eegService} from "../../../service/eeg.service";
import {EegRate} from "../../../models/eeg.model";
import {ClearingPreviewRequest, MeteringEnergyGroupType} from "../../../models/meteringpoint.model";

export const fetchEnergyBills = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, invoiceRequest: ClearingPreviewRequest}) => {
    const { tenant, invoiceRequest } = arg;
    const result = await eegService.fetchBilling(tenant, invoiceRequest);
    return { billing: result };
  }
)

export const fetchParticipantAmounts = createAsyncThunk(
    `${featureKey}/fetchParticipantAmounts`,
    async (arg: { tenant: string, billingRunId : string}) => {
        const { tenant, billingRunId } = arg;
        const result = await eegService.fetchParticipantAmounts(tenant, billingRunId);
        return { participantAmounts: result };
    }
)

export const resetParticipantAmounts = createAction(
    `${featureKey}/resetParticipantAmounts`
)
