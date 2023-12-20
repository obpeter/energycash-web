import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EegParticipant} from "../../../models/members.model";

export const featureKey = 'participant';

export interface ParticipantState extends EntityState<EegParticipant, string> {
  isFetching: boolean;
  selectedParticipant: EegParticipant | undefined;
  selectedMeter: string | undefined;
  // newParticipant: EegParticipant;
}

export const adapter = createEntityAdapter<EegParticipant>({
  // selectId: (participant) => participant.id
});

export const initialState: ParticipantState = adapter.getInitialState({
  isFetching: false,
  selectedParticipant: {} as EegParticipant,
  selectedMeter: undefined,
  // newParticipant: {} as EegParticipant
});