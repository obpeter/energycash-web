import {createReducer} from "@reduxjs/toolkit";
import {initialState} from "../states";
import {
    createBillingConfig,
    deleteImageBillingConfig,
    fetchBillingConfig,
    updateBillingConfig,
    uploadImageBillingConfig
} from "../actions";

export const reducer = createReducer(initialState, builder =>
    builder
        .addCase(fetchBillingConfig.pending, state => {
            return { ...state, isFetching: true, errorMessage : null };
        })
        .addCase(fetchBillingConfig.fulfilled, (state, action) => {
            const { billingConfig } = action.payload;
            return { ...state, billingConfig: billingConfig, isFetching: false, errorMessage : null }
        })
        .addCase(fetchBillingConfig.rejected, state => {
            return { ...state, billingConfig : null, isFetching: false, errorMessage : 'Fehler beim Laden der Abrechnungseinstellungen' };
        })
        .addCase(createBillingConfig.pending, state => {
            return { ...state, isFetching: true, errorMessage : null };
        })
        .addCase(createBillingConfig.fulfilled, (state, action) => {
            const { billingConfig   } = action.payload;
            return { ...state, billingConfig: billingConfig, isFetching: false, errorMessage : null }
        })
        .addCase(createBillingConfig.rejected, state => {
            return { ...state, isFetching: false, errorMessage : 'Fehler beim Erstellen der Abrechnungseinstellungen.' };
        })
        .addCase(updateBillingConfig.pending, state => {
            return { ...state, isFetching: true, errorMessage : null };
        })
        .addCase(updateBillingConfig.fulfilled, (state, action) => {
            const { billingConfig   } = action.payload;
            return { ...state, billingConfig: billingConfig, isFetching: false, errorMessage : null }
        })
        .addCase(updateBillingConfig.rejected, state => {
            return { ...state, isFetching: false, errorMessage : 'Fehler beim Ändern der Abrechnungseinstellungen.' };
        })
        .addCase(uploadImageBillingConfig.pending, state => {
            return { ...state, isFetching: true, errorMessage : null };
        })
        .addCase(uploadImageBillingConfig.fulfilled, (state, action) => {
            const { billingConfig   } = action.payload;
            return { ...state, billingConfig: billingConfig, isFetching: false, errorMessage : null }
        })
        .addCase(uploadImageBillingConfig.rejected, state => {
            return { ...state, isFetching: false, errorMessage : 'Fehler beim Upload des Bildes.' };
        })
        .addCase(deleteImageBillingConfig.pending, state => {
            return { ...state, isFetching: true, errorMessage : null };
        })
        .addCase(deleteImageBillingConfig.fulfilled, (state, action) => {
            const { billingConfig   } = action.payload;
            return { ...state, billingConfig: billingConfig, isFetching: false, errorMessage : null }
        })
        .addCase(deleteImageBillingConfig.rejected, state => {
            return { ...state, isFetching: false, errorMessage : 'Fehler beim Löschen des Bildes.' };
        })
);