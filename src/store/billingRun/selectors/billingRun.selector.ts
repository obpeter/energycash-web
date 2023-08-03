import {createSelector} from "@reduxjs/toolkit";
import {featureKey, BillingRunState} from "../states";
import {BillingRun} from "../../../models/meteringpoint.model";

const featureStateSelector = (state: { [featureKey]: BillingRunState }) => state[featureKey];


export const billingRunSelector = createSelector(
    featureStateSelector, (billingRunState) : BillingRun => {
        return billingRunState.billingRun;
    }
);

export const billingRunStatusSelector = createSelector (
    featureStateSelector, (billingRunState) => {
        return billingRunState.billingRun ? billingRunState.billingRun.runStatus : undefined;
    }
);

export const billingRunIsFetchingSelector = createSelector (
    featureStateSelector, (billingRunState) => {
        return billingRunState.isFetching;
    }
);

export const billingRunErrorSelector = createSelector (
    featureStateSelector, (billingRunState) => {
        return billingRunState.errorMessage;
    }
)

