

import * as eeg from './eeg';
import * as participant from './participant';
import * as rate from './rate';
import * as energy from './energy';
import * as billing from './billing';
import * as billingRun from './billingRun';
import * as billingConfig from './billingConfig';

import {combineReducers, configureStore, createSelector} from "@reduxjs/toolkit";
import {activeMetersSelector} from "./participant";
import {meteringEnergyGroup11} from "./energy";
import {Metering} from "../models/meteringpoint.model";

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


export const activeMeterEnergyArray = createSelector(
  activeMetersSelector,
  meteringEnergyGroup11,
  (metering, report) => metering.map((m) => {
    return { meter: m, utilization: report[m.meteringPoint] }
  })
)

export const activeMeterEnergyGroup = createSelector(
  activeMetersSelector,
  meteringEnergyGroup11,
  (metering, report) => metering.reduce((out, m) => {
    return {...out, [m.meteringPoint]: {m: m, utilization: report[m.meteringPoint]}}
  }, {} as Record<string, {m: Metering, utilization: number}>)
)
