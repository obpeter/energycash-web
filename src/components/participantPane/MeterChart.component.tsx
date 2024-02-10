import React, {FC, useEffect, useState} from "react";
import MeterChartNavbarComponent from "../MeterChartNavbar.component";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {
  EnergySeries,
  MeterEnergySeries,
  MeterReport,
  ParticipantReport,
  SelectedPeriod
} from "../../models/energy.model";
import {eegService} from "../../service/eeg.service";
import {calcXAxisName, GetWeek} from "../../util/Helper.util";
import {MONTHNAME} from "../../models/eeg.model";
import {Metering} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import {useIonViewWillEnter} from "@ionic/react";
import {transformMeterReportToEnergySeries} from "../../util/ReportHelper";

interface MeterChartComponentProps {
  tenant: string
  report: MeterEnergySeries
  activePeriod: SelectedPeriod
  selectedMeter: Metering
  selectedParticipant: EegParticipant
}

const MeterChartComponent: FC<MeterChartComponentProps> = ({tenant, report, activePeriod, selectedMeter, selectedParticipant}) => {

  const [activeEnergySeries, setActiveEnergySeries] = useState<MeterEnergySeries>(report)

  useEffect(() => {
    setActiveEnergySeries(report)
  }, [report]);

  // useIonViewWillEnter( () => {
  //   return false
  // })

  const updateSeries = async (selectedPeriod: SelectedPeriod) => {
    if (selectedParticipant && selectedMeter) {
      return eegService.fetchReportV2(tenant, selectedPeriod.year, selectedPeriod.segment, selectedPeriod.type,
        [{
          participantId: selectedParticipant.id,
          meters: [
            {
              meterId: selectedMeter.meteringPoint,
              meterDir: selectedMeter.direction,
              from: selectedMeter.participantState
                ? new Date(selectedMeter.participantState.activeSince).getTime()
                : new Date().getTime(),
              until: selectedMeter.participantState
                ? new Date(selectedMeter.participantState.inactiveSince).getTime()
                : new Date().getTime(),
            } as MeterReport]
        } as ParticipantReport])
        .then(res => {
          if (res.participantReports.length !== 1) {
            throw new Error("Keine Daten gefunden")
          }
          return res.participantReports[0]
        })
        .then(rep => transformMeterReportToEnergySeries(rep.meters[0]))
        .then(s => {
          return {
            series: s,
            period: selectedPeriod
          } as MeterEnergySeries
        })
    }
    return activeEnergySeries
  }


  const onMeterPeriodSelectionChanged = (selectedPeriod: SelectedPeriod) => {
    updateSeries(selectedPeriod).then(r => setActiveEnergySeries(r))
  }

  return (
    // activePeriod && activeEnergySeries && activeEnergySeries.series && activeEnergySeries.series.length > 0 &&
    <div>
      <div style={{marginLeft: "20px"}}>
        <h4>Energiedaten</h4>
        <MeterChartNavbarComponent
          activePeriod={activePeriod}
          selectedMeterId={selectedMeter.meteringPoint}
          onSelectionChanged={onMeterPeriodSelectionChanged}/>
      </div>
      <div style={{height: "200px", width: "100%"}}>
        <ResponsiveContainer width="90%" height={200}>
          <BarChart
            width={500}
            height={300}
            data={activeEnergySeries.series.map((e, i) => {
              return {
                name: calcXAxisName(e.segmentIdx, activeEnergySeries.period),
                distributed: e.allocated,
                consumed: e.consumed
              }
            })}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap={0}
            barGap={1}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis fontSize={10} unit={" kWh"}/>
            <Tooltip formatter={(value) => Number(value).toFixed(3) + " kWh"}/>
            <Legend/>
            <Bar name="EEG" dataKey="distributed" fill="#82ca9d"/>
            <Bar name="EVU" dataKey="consumed" fill="#8884d8"/>
          </BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MeterChartComponent