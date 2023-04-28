import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {featureKey} from "../states/participant.state";
import {eegService} from "../../../service/eeg.service";
import {EegParticipant} from "../../../models/members.model";
import {Metering} from "../../../models/meteringpoint.model";

export const fetchParticipantModel = createAsyncThunk(
  `${featureKey}/fetchParticipants`,
  async (arg: { token: string, tenant: string }) => {
    const { token, tenant } = arg;
    const result = await eegService.fetchParicipants(tenant, token);
    return { participants: result };
  }
)

// export const newParticipant = createAsyncThunk(
//   `${featureKey}/new`,
//   async (arg: {participant: EegParticipant}) => {
//     return arg
//   }
// )
export const newParticipant = createAction<EegParticipant>(`${featureKey}/new`);

export const saveNewParticipant = createAsyncThunk(
  `${featureKey}/save`,
  async (arg: {participant: EegParticipant}) => {
    return arg
  }
)

export const chancelNewParticipant = createAsyncThunk(
  `${featureKey}/chancel`,
  async () => {
    return undefined
  }
)

// export const addMeteringPoint = createAsyncThunk(
//   `${featureKey}/addMeter`,
//   async (arg: {meter: Metering}) => {
//     return arg
//   }
// )

export const addMeteringPoint = createAction<Metering>(`${featureKey}/meter/add`)

export const selectParticipant = createAction<string>(`${featureKey}/select/participant`);

export const selectMetering = createAction<string>(`${featureKey}/select/meter`)

export const createParticipant = createAsyncThunk(
  `${featureKey}/create`,
  async (arg: { tenant: string, participant: EegParticipant }) => {
    const {participant, tenant} = arg
    return await eegService.createParticipant(tenant, participant);
  }
)

export const registerMeteringpoint = createAsyncThunk(
  `${featureKey}/meter/create`,
  async (arg: { tenant: string, participant: string, meter: Metering }) => {
    const {participant, tenant, meter} = arg
    return await eegService.createMeteringPoint(tenant, participant, meter);
  }
)

export const updateMeteringPoint = createAsyncThunk(
  `${featureKey}/meter/update`,
  async (args: {tenant: string, participantId: string, meter: Metering}) => {
    const {tenant, participantId, meter} = args
    await eegService.updateMeteringPoint(tenant, participantId, meter);
    return {meter: meter, participantId: participantId}
  }
)