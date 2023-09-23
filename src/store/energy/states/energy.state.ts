import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EnergyMeta, EnergyReport, ParticipantReport, SelectedPeriod} from "../../../models/energy.model";

export const featureKey = 'energy';

export interface EnergyEntitieState {
  meta: EntityState<EnergyMeta>
  participantReports: EntityState<ParticipantReport>
  intermediateReportResults:EntityState<EnergyReport>
  report: EnergyReport | undefined
  selectedPeriod: SelectedPeriod | undefined
  totalProduction: number
  totalConsumption: number
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

export const participantReportAdapter = createEntityAdapter<ParticipantReport>({
  selectId: (report) => report.participantId
})

export const initialState: EnergyEntitieState = {
  meta: metaAdapter.getInitialState({isFetching: false}),
  intermediateReportResults: reportAdapter.getInitialState(),
  participantReports: participantReportAdapter.getInitialState(),
  report : undefined,
  selectedPeriod: undefined,
  totalConsumption: 0,
  totalProduction: 0,
};
