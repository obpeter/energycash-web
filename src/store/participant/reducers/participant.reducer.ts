import {createReducer} from "@reduxjs/toolkit";
import {
  addMeteringPoint,
  chancelNewParticipant, confirmParticipant, createParticipant, fetchParticipantModel,
  newParticipant, registerMeteringpoint,
  saveNewParticipant, selectMetering, selectParticipant, updateMeteringPoint, updateParticipant
} from "../actions/participant.action";
import {adapter, initialState} from "../states";
import {EegParticipant} from "../../../models/members.model";
import {v4} from 'uuid';
import {Address} from "../../../models/eeg.model";

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchParticipantModel.fulfilled, (state, action) => {
      const {participants} = action.payload
      return adapter.setAll(state, participants)
    })
    .addCase(newParticipant, (state, action) => {
      return {...state, isFetching: false,
        selectedParticipant: {...action.payload, status: "NEW", id: v4(), role: "EEG_USER",
          billingAddress: {...action.payload.residentAddress, type: "BILLING"} as Address,
          residentAddress: {...action.payload.residentAddress, type: "RESIDENCE"} as Address}};
    })
    .addCase(saveNewParticipant.fulfilled, (state, action) => {
      const {participant} = action.payload;
      return adapter.addOne({...state, selectedParticipant: participant}, participant);
    })
    .addCase(chancelNewParticipant.fulfilled, (state, action) => {
      return {...state, selectedParticipant: {} as EegParticipant};
    })
    .addCase(addMeteringPoint, (state, action) => {

      // return {...state, selectedParticipant: {...state.selectedParticipant, meters: [...state.selectedParticipant?.meters/* || {} as Metering, action.payload*/]}};

      return {...state, selectedParticipant: {...state.selectedParticipant, meters: [...(state.selectedParticipant?.meters || []), action.payload]}};
      // return {...state};
      // return s
    })
    .addCase(createParticipant.fulfilled, (state, action) => {
      return adapter.addOne({...state, selectedParticipant: action.payload, isFetching: false}, action.payload);
    })
    .addCase(createParticipant.rejected, (state, action) => {
      return {...state, selectedParticipant: {} as EegParticipant, isFetching: false}
    })
    .addCase(selectParticipant, (state, action) => {
      return {...state, selectedParticipant: {...state.entities[action.payload]!}}
    })
    .addCase(selectMetering, (state, action) => {
      return {...state, selectedMeter: action.payload}
    })
    .addCase(registerMeteringpoint.fulfilled, (state, action) => {
      return adapter.updateOne({...state },
        { id: action.payload.participantId,
          changes: {meters: [...(state.entities[action.payload.participantId] ? state.entities[action.payload.participantId]!.meters : []), action.payload.meter] } })
    })
    .addCase(updateMeteringPoint.fulfilled, (state, action) => {
      const {meter, participantId} = action.payload;

      const modParticipant = state.selectedParticipant;
      const changedParticipant = {...modParticipant, meters: [...modParticipant.meters.filter(m => m.meteringPoint !== meter.meteringPoint), ...[meter]] }
      return adapter.updateOne({...state, selectedMeter: meter.meteringPoint}, {id: modParticipant.id, changes: changedParticipant})
    })
    .addCase(confirmParticipant.fulfilled, (state, action) => {
      console.log("Confirm Participant Reducer", action.payload)
      const participant = action.payload
      return adapter.updateOne({...state, selectedParticipant: participant},
        { id: participant.id, changes: participant } )

    })
    .addCase(updateParticipant.fulfilled, (state, action) => {
      return adapter.updateOne({...state}, {id: action.payload.id, changes: action.payload})
    })
);
