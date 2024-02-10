import React, {FC} from "react";
import {IntermediateRecord} from "../../models/energy.model";
import {PieSeriesType, ReportSeriesType} from "../../pages/Dashbaord.page";
import LoadSharingComponent from "./LoadSharing.component";
import IntraDayReportComponent from "./IntraDayReport.component";
import EnergyOverviewComponent from "./EnergyOverview.component";
import {EegParticipant} from "../../models/members.model";
import EegOverviewComponent from "./EegOverview.component";
import {useAppSelector} from "../../store";
import {ratesMapSelector} from "../../store/rate";

import "./eeg-card.scss"
import {selectedPeriodSelector} from "../../store/energy";

interface LoadSharingComponentProps {
  participants: EegParticipant[]
  intermediateSeries: IntermediateRecord[];
  report: ReportSeriesType[]
  consumed: PieSeriesType
  produced: PieSeriesType
  allocated: PieSeriesType
}
const DashboardLayoutComponent: FC<LoadSharingComponentProps> = ({intermediateSeries, report, consumed, produced, allocated, participants}) => {
  const rates = useAppSelector(ratesMapSelector)
  const activePeriod = useAppSelector(selectedPeriodSelector);

  return (
    <div style={{display: "flex", height: "100%", padding: "10px"}}>
      <div style={{flex: "1", display: "grid", gridTemplateColumns: "50% 50%", height: "100%"}}>
        <div style={{display: "grid", gridTemplateRows: "50% 50%"}}>
          <div className="eeg-card-border" style={{margin: "10px"}}>
            <EegOverviewComponent participants={participants} rateMap={rates} />
          </div>
          <div className="eeg-card-border" style={{margin: "10px"}}>
            {activePeriod && <LoadSharingComponent activePeriod={activePeriod} report={report} intermediateSeries={intermediateSeries} /> }
          </div>
        </div>
        <div style={{display: "grid", gridTemplateRows: "50% 50%"}}>
          <div className="eeg-card-border" style={{margin: "10px", maxHeight: "100%"}}>
            <EnergyOverviewComponent consumed={consumed} allocated={allocated} produced={produced} rates={rates}/>
          </div>
          <div className="eeg-card-border" style={{margin: "10px"}}>
            <IntraDayReportComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayoutComponent