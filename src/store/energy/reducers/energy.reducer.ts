import {createReducer} from "@reduxjs/toolkit";
import {metaAdapter, initialState, reportAdapter, participantReportAdapter} from "../states";
import {fetchEnergyReport, fetchEnergyReportV2, setSelectedPeriod} from "../actions";
import {SelectedPeriod} from "../../../models/energy.model";

const reportIdToPeriod = (id: string):SelectedPeriod => {
  const [type, year, month] = id.split('/')
  return {type: type as 'YH' | "YQ" | 'YM' | 'Y', year: Number(year), segment: Number(month)}
}

export const reducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchEnergyReport.fulfilled, (state, action) => {
      const {report} = action.payload
      state.report = report.eeg.report
      // state.selectedPeriod = reportIdToPeriod(report.eeg.report.id)
      metaAdapter.setAll(state.meta, report.eeg.meta)
      reportAdapter.setAll(state.intermediateReportResults, report.eeg.intermediateReportResults)
      // return { ...state, report: report.eeg.report, selectedPeriod: reportIdToPeriod(report.eeg.report.id)}
    })
    .addCase(setSelectedPeriod, (state, action) => {
      return {...state, selectedPeriod: action.payload}
    })
    .addCase(fetchEnergyReportV2.fulfilled, (state, action) => {
      const {report} = action.payload
      // state.selectedPeriod = reportIdToPeriod(report.id)
      state.totalConsumption = report.totalConsumption
      state.totalProduction = report.totalProduction
      participantReportAdapter.setAll(state.participantReports, report.participantReports)
      metaAdapter.setAll(state.meta, report.meta)
    })
);
