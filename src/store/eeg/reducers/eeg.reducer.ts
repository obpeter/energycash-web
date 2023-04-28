import {fetchEegModel, selectTenant, updateEegModel} from "../actions/eeg.action";
import {createReducer} from "@reduxjs/toolkit";
import {adapter, initialState} from "../states/eeg.state";

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchEegModel.pending, state => {
      return { ...state, isFetching: true };
    })
    .addCase(fetchEegModel.fulfilled, (state, action) => {
      const { eeg } = action.payload;
      // return adapter.setOne({ ...state, isFetching: false }, eeg);
      return adapter.setOne({ ...state, isFetching: false }, eeg)
    })
    .addCase(fetchEegModel.rejected, state => {
      return { ...state, isFetching: false };
    })
    .addCase(updateEegModel.fulfilled, (state, action) => {
      const { eeg } = action.payload;
      return adapter.setOne({ ...state, isFetching: false }, eeg)
    })
    .addCase(updateEegModel.rejected, state => {
      return { ...state, isFetching: false };
    })
    .addCase(selectTenant, (state, action) => {
      return { ...state, selectedTenant: action.payload }
    })
);
