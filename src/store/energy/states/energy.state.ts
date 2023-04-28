import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EnergyMeta, EnergyReport, SelectedPeriod} from "../../../models/energy.model";

export const featureKey = 'energy';

export interface EnergyEntitieState {
  meta: EntityState<EnergyMeta>
  intermediateReportResults:EntityState<EnergyReport>
  report: EnergyReport | undefined
  selectedPeriod: SelectedPeriod | undefined
}

export interface EnergyMetaState extends EntityState<EnergyMeta> {
  isFetching: boolean;
}
export const metaAdapter = createEntityAdapter<EnergyMeta>({
  selectId: (meta) => meta.name
});

export const reportAdapter = createEntityAdapter<EnergyReport>({
  selectId: (report) => report.id
})

export const initialState: EnergyEntitieState = {
  meta: metaAdapter.getInitialState({isFetching: false}),
  intermediateReportResults: reportAdapter.getInitialState(),
  report : undefined,
  selectedPeriod: undefined
};
