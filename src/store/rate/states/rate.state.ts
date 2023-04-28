import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EegTariff} from "../../../models/eeg.model";

export const featureKey = 'rate';

export interface RateState extends EntityState<EegTariff> {
  isFetching: boolean;
}
export const adapter = createEntityAdapter<EegTariff>();

// export const adapter = createEntityAdapter<EegRate>({
//   selectId: (rate) => rate.id
// });

export const initialState: RateState = adapter.getInitialState({
  isFetching: false,
});