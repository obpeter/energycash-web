

import * as eeg from './eeg';
import * as participant from './participant';
import * as rate from './rate';
import * as energy from './energy';
import * as billing from './billing';
import * as billingRun from './billingRun';

import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";

/**
 * Reducer
 */
const reducer = combineReducers({
  [eeg.featureKey]: eeg.reducer,
  [participant.featureKey]: participant.reducer,
  [rate.featureKey]: rate.reducer,
  [energy.featureKey]: energy.reducer,
  [billing.featureKey]: billing.reducer,
  [billingRun.featureKey]: billingRun.reducer,
});

/**
 * MIddleware
 */
const middleware = getDefaultMiddleware({
  thunk: true,
  immutableCheck: true,
  serializableCheck: true
});

/**
 * Store
 */
export const store = configureStore({
  reducer,
  // middleware,
  devTools: true
});

/**
 * Types
 */
export type State = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
