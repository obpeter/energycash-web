import {createSelector} from "@reduxjs/toolkit";

// import { EnergyState, adapter, featureKey } from '../states';
import {EegParticipant} from "../../../models/members.model";
import {adapter, featureKey, ParticipantState} from "../states";
import {Metering} from "../../../models/meteringpoint.model";
import {SelectedPeriod} from "../../../models/energy.model";
import {selectedPeriodSelector} from "../../energy";

const {selectAll, selectById, selectEntities} = adapter.getSelectors();

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

export const participantsSelector1 = createSelector(
  featureStateSelector,
  selectAll
)

const getPeriodDates = (period: SelectedPeriod) => {
  switch (period.type) {
    case 'YM':
      return [new Date(period.year, period.segment, 1, 0, 0, 0), new Date(period.year, period.segment + 1, 0, 0, 0, 0)]
    case 'YQ':
      return [new Date(period.year, ((period.segment - 1) * 3) + 1, 0, 0, 0, 0), new Date(period.year, ((period.segment) * 3), 0, 0, 0, 0)]
    case 'YH':
      return [new Date(period.year, period.segment, 0, 0, 0, 0), new Date(period.year, period.segment + 1, 0, 0, 0, 0)]
    default:
      return [new Date(period.year, period.segment, 0, 0, 0, 0), new Date(period.year, period.segment + 1, 0, 0, 0, 0)]
  }
}

// export const activeParticipantsSelector = (period: SelectedPeriod | undefined) => createSelector(
//   participantsSelector1,
//     (participants): EegParticipant[] => {
//     if (period) {
//       const [start, end] = getPeriodDates(period)
//       const n = participants.map(p => {
//         return {
//           ...p, meters: p.meters.filter(m =>
//             new Date(m.registeredSince).getTime() >= start.getTime() &&
//             (m.inactiveSince ? new Date(m.inactiveSince).getTime() <= end.getTime() && new Date(m.inactiveSince).getTime() >= start.getTime() : false)
//           )
//         } as EegParticipant
//       })
//       return n
//     }
//     return participants
//   }
// )

export const activeParticipantsSelector1 = createSelector(
  participantsSelector1,
  selectedPeriodSelector,
  (participants, period): EegParticipant[] => {
    if (period) {
      const [start, end] = getPeriodDates(period)
      const n = participants.map(p => {
        return {
          ...p, meters: p.meters.filter(m =>
            new Date(m.registeredSince).getTime() <= start.getTime() &&
            (m.inactiveSince ? new Date(m.inactiveSince).getTime() <= end.getTime() && new Date(m.inactiveSince).getTime() >= start.getTime() : true)
          )
        } as EegParticipant
      })
      return n
    }
    return participants
  }
)

// export const participantSelector = createSelector(
//   featureStateSelector,
//   (participantState: ParticipantState): EegParticipant | undefined => {
//     return selectById(participantState, (participantState.selectedParticipant?.id || "")) || undefined;
//   }
// )

export const selectParticipantById = (id: string) =>
  createSelector(
    featureStateSelector,
    (participantState: ParticipantState): EegParticipant | undefined => {
      return selectById(participantState, id) || undefined;
    }
  );

export const meterSelector = createSelector(
  participantsSelector1,
  (participants) => participants.reduce((meterArray, p) => {
    return [...p.meters, ...meterArray]
  }, [] as Metering[]))

export const selectedParticipantSelector = createSelector(
  featureStateSelector,
  state => state.selectedParticipant
)

export const selectedMeterById = (meter: string) => createSelector(
  meterSelector,
  meters => meters.find((m) => m.meteringPoint === meter)
)

export const selectParticipantNames = createSelector(
  selectAll,
  activeParticipantsSelector1,
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

