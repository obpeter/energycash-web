import {createSelector} from "@reduxjs/toolkit";
import {featureKey, BillingConfigState} from "../states";
import {BillingConfig} from "../../../models/eeg.model";

const featureStateSelector = (state: { [featureKey]: BillingConfigState }) => state[featureKey];


export const billingConfigSelector = createSelector(
    featureStateSelector, (billingConfigState) : BillingConfig | null => {
        return billingConfigState.billingConfig;
    }
);

export const billingConfigIsFetchingSelector = createSelector (
    featureStateSelector, (billingConfigState) => {
        return billingConfigState.isFetching;
    }
);

export const billingConfigErrorSelector = createSelector (
    featureStateSelector, (billingConfigState) => {
        return billingConfigState.errorMessage;
    }
)

