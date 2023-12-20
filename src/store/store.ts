

import * as eeg from './eeg';
import * as participant from './participant';
import * as rate from './rate';
import * as energy from './energy';
import * as billing from './billing';
import * as billingRun from './billingRun';
import * as billingConfig from './billingConfig';

import {combineReducers, configureStore} from "@reduxjs/toolkit";

/**
 * Reducer
 */
export const reducer = combineReducers({
  [eeg.featureKey]: eeg.reducer,
  [participant.featureKey]: participant.reducer,
  [rate.featureKey]: rate.reducer,
  [energy.featureKey]: energy.reducer,
  [billing.featureKey]: billing.reducer,
  [billingRun.featureKey]: billingRun.reducer,
  [billingConfig.featureKey]: billingConfig.reducer,
});

// /**
//  * MIddleware
//  */
// const middleware = getDefaultMiddleware({
//   thunk: true,
//   immutableCheck: true,
//   serializableCheck: true
// });

/**
 * Store
 */
export const store = configureStore({
  reducer,
  // middleware,
  devTools: true
});


export function setupStore(preloadedState?: any) {
  return configureStore({
    reducer: reducer,
    preloadedState
  })
}

/**
 * Types
 */
export type State = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch;
