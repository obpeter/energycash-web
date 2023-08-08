import {createSelector} from "@reduxjs/toolkit";

// import { EnergyState, adapter, featureKey } from '../states';
import {EegParticipant} from "../../../models/members.model";
import {adapter, featureKey, ParticipantState} from "../states";
import {Metering} from "../../../models/meteringpoint.model";

const { selectAll, selectById, selectEntities } = adapter.getSelectors();

const featureStateSelector = (state: { [featureKey]: ParticipantState }) => state[featureKey];

export const entitiesSelector = createSelector(
  featureStateSelector,
  selectEntities
);

export const isFetchingSelector = createSelector(
  featureStateSelector,
  state => state.isFetching
);

// export const rateSelector = createSelector(
//   featureStateSelector,
//   selectAll
// );

export const participantsSelector = createSelector(
  featureStateSelector,
  selectAll
)

export const participantSelector = createSelector(
  featureStateSelector,
  (participantState: ParticipantState): EegParticipant | undefined => {
    return selectById(participantState, (participantState.selectedParticipant?.id || "")) || undefined;
  }
)

export const selectParticipantById = (id: string) =>
  createSelector(
    featureStateSelector,
    (participantState: ParticipantState): EegParticipant | undefined => {
      return selectById(participantState, id) || undefined;
    }
  );

export const selectedParticipantSelector = createSelector(
  featureStateSelector,
  state => state.selectedParticipant
)

export const meterSelector = createSelector(participantsSelector,
  (participants) => participants.reduce((meterArray, p) => { return [...p.meters, ...meterArray]}, [] as Metering[]))

export const selectedMeterById = (meter: string) => createSelector(
  meterSelector,
  meters => meters.find((m) => m.meteringPoint === meter)
)

export const selectParticipantNames = createSelector(
  participantsSelector,
  (participants) => participants.map((p) => {
    return {id: p.id, name: `${p.firstname} ${p.lastname}`}
  })
)

export const selectedMeterIdSelector = createSelector(
  featureStateSelector,
  state => state.selectedMeter
)

export const selectedMeterSelector = createSelector(
  featureStateSelector,
  state => state.selectedParticipant ? state.selectedParticipant.meters?.find(m => m.meteringPoint === state.selectedMeter) : undefined

)

