import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states";
import {ClearingPreviewRequest} from "../../../models/meteringpoint.model";
import {Api} from "../../../service";

export const fetchEnergyBills = createAsyncThunk(
  `${featureKey}/fetch`,
  async (arg: { tenant: string, invoiceRequest: ClearingPreviewRequest}) => {
    const { tenant, invoiceRequest } = arg;
    const result = await Api.eegService.fetchBilling(tenant, invoiceRequest);
    return { billing: result };
  }
)

export const fetchParticipantAmounts = createAsyncThunk(
    `${featureKey}/fetchParticipantAmounts`,
    async (arg: { tenant: string, billingRunId : string}) => {
        const { tenant, billingRunId } = arg;
        const result = await Api.eegService.fetchParticipantAmounts(tenant, billingRunId);
        return { participantAmounts: result };
    }
)

export const resetParticipantAmounts = createAction(
    `${featureKey}/resetParticipantAmounts`
)
