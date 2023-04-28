import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EegParticipant} from "../../../models/members.model";
import {Metering} from "../../../models/meteringpoint.model";

export const featureKey = 'participant';

export interface ParticipantState extends EntityState<EegParticipant> {
  isFetching: boolean;
  selectedParticipant: EegParticipant;
  selectedMeter: string | undefined;
  // newParticipant: EegParticipant;
}

export const adapter = createEntityAdapter<EegParticipant>({
  selectId: (participant) => participant.id
});

export const initialState: ParticipantState = adapter.getInitialState({
  isFetching: false,
  selectedParticipant: {} as EegParticipant,
  selectedMeter: undefined,
  // newParticipant: {} as EegParticipant
});