import {createReducer} from "@reduxjs/toolkit";
import {fetchRatesModel, saveNewRate, updateRate} from "../actions/rate.action";
import {adapter, initialState} from "../states";

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchRatesModel.fulfilled, (state, action) => {
      const {rates} = action.payload
      return adapter.setAll(state, rates)
    })
    .addCase(saveNewRate.fulfilled, (state, action) => {
      return adapter.addOne(state, action.payload)
    })
    .addCase(updateRate.fulfilled, (state, action) => {
      return adapter.setOne(state, action.payload);
    })
);
