import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {ParticipantBillType} from "../../../models/meteringpoint.model";

export const featureKey = 'billing';

export interface BillingState extends EntityState<ParticipantBillType> {
  isFetching: boolean;
}
export const adapter = createEntityAdapter<ParticipantBillType>();

// export const adapter = createEntityAdapter<EegRate>({
//   selectId: (rate) => rate.id
// });

export const initialState: BillingState = adapter.getInitialState({
  isFetching: false,
});