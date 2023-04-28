import {createReducer} from "@reduxjs/toolkit";
import {adapter, initialState} from "../states";
import {fetchEnergyBills} from "../actions";

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchEnergyBills.fulfilled, (state, action) => {
      console.log("Reducer Billing. Payload: ", action.payload)
      const {billing} = action.payload
      return adapter.setAll(state, billing)
    })
);
