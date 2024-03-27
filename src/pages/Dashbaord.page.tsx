import React, {FC, useContext, useEffect, useState} from "react";
import {IonCard, IonCol, IonContent, IonGrid, IonPage, IonRow} from "@ionic/react";
import {
  CartesianGrid,
  Legend, Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip, XAxis,
  YAxis
} from "recharts";
import {selectAllIntermediates, selectAllIntermediatesV2} from "../store/energy";
import {useAppSelector} from "../store";

import "./Dashboard.page.scss"
import DashboardLayoutComponent from "../components/dashboard/DashboardLayout.component";
import {ParticipantContext} from "../store/hook/ParticipantProvider";
import {selectedTenant} from "../store/eeg";

export type PieSeriesType = {
  name: string;
  value: number;
  fill: string;
}

export type ReportSeriesType = {
  name: string, distributed: number, consumed: number, produced: number
}
const DashbaordPage: FC = () => {

  // const intermediateSeries = useAppSelector(selectAllIntermediates)
  const intermediateSeriesV2 = useAppSelector(selectAllIntermediatesV2)

  const [allocatedSeries, setAllocatedSeries] = useState<PieSeriesType>({value:0} as PieSeriesType)
  const [consumedSeries, setConsumedSeries] = useState<PieSeriesType>({value: 0} as PieSeriesType)
  const [producedSeries, setProducedSeries] = useState<PieSeriesType>({value:0} as PieSeriesType)
  const [reportSeries, setReportSeries] = useState<ReportSeriesType[]>([])
  const [reportSummary, setReportSummary] = useState<ReportSeriesType>({} as ReportSeriesType)

  const {
    participants,
  } = useContext(ParticipantContext);
  // useEffect(() => {
  //   console.log(intermediateSeries)
  //   if (intermediateSeries) {
  //     const [allocated, consumed, produced] =
  //       intermediateSeries.reduce(([a, b, c], s) =>
  //           [
  //             a + s.allocated.reduce((as, a) => as + a, 0),
  //             b + s.consumed.reduce((bs, b) => bs + b, 0),
  //             c + s.produced.reduce((cs, c) => cs + c, 0)
  //           ],
  //         [0, 0, 0])
  //     setAllocatedSeries({name: "EEG", value: allocated, fill: '#1f7485'} as PieSeriesType)
  //     setConsumedSeries({name: "Verbrauch", value: consumed, fill: '#1657a6'} as PieSeriesType)
  //     setProducedSeries({name: "Produktion", value: produced, fill: '#3a7234'} as PieSeriesType)
  //   }
  // }, [intermediateSeries])


  useEffect(() => {
    if (intermediateSeriesV2) {
      const [allocated, consumed, produced, utilized] =
        intermediateSeriesV2.reduce(([a, b, c, d], s) =>
            [
              a + s.allocation.reduce((as, a) => as + a, 0),
              b + s.consumption.reduce((bs, b) => bs + b, 0),
              c + s.production.reduce((cs, c) => cs + c, 0),
              d + s.utilization.reduce((cs, d) => cs + d, 0)
            ],
          [0, 0, 0, 0])

      setAllocatedSeries({name: "EEG", value: utilized, fill: '#1f7485'} as PieSeriesType)
      setConsumedSeries({name: "Verbrauch", value: consumed, fill: '#1657a6'} as PieSeriesType)
      setProducedSeries({name: "Produktion", value: produced, fill: '#3a7234'} as PieSeriesType)


      const [utilizationS, consuptionS, productionS] =intermediateSeriesV2.reduce(([utilizationSeries, consumptionSeries, productionSeries], p) => {
          p.utilization.forEach((v, i) =>  {
            return utilizationSeries.length > i ? utilizationSeries[i] = utilizationSeries[i] + v : utilizationSeries.push(v)
          })
          p.consumption.forEach((v, i) =>  {
            return consumptionSeries.length > i ? consumptionSeries[i] = consumptionSeries[i] + v : consumptionSeries.push(v)
          })
          p.production.forEach((v, i) =>  {
            return productionSeries.length > i ? productionSeries[i] = productionSeries[i] + v : productionSeries.push(v)
          })
          return [
            utilizationSeries,
            consumptionSeries,
            productionSeries,
          ]
        },
        [[] as number[], [] as number[], [] as number[]])

      const max = Math.max(utilizationS.length, consuptionS.length, productionS.length)
      const report = [] as ReportSeriesType[]
      const reportSum = {name: "sum"} as ReportSeriesType
      for (let i = 0; i < max; i++) {
        const d = utilizationS[i] || 0
        const c = consuptionS[i] || 0
        const p = productionS[i] || 0
        report.push({
          name: "" + (i + 1),
          distributed: utilizationS.length > i ? utilizationS[i] : 0,
          consumed: consuptionS.length > i ? consuptionS[i] : 0,
          produced: productionS.length > i ? productionS[i] : 0
        })
        reportSum.distributed += d
        reportSum.consumed += c
        reportSum.produced += p
      }
      setReportSeries(report)
      setReportSummary(reportSum)
    } else {
      setReportSeries([])
      setReportSummary({} as ReportSeriesType)
      setAllocatedSeries({value:0} as PieSeriesType)
      setConsumedSeries({value:0} as PieSeriesType)
      setProducedSeries({value:0} as PieSeriesType)
    }
  }, [intermediateSeriesV2]);

  const style = {
    top: '10%',
    right: 0,
    // transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

  return (
    <IonPage>
      <IonContent fullscreen color="eeg">
        <DashboardLayoutComponent participants={participants} intermediateSeries={intermediateSeriesV2} report={reportSeries} consumed={consumedSeries} produced={producedSeries} allocated={allocatedSeries}/>
        {/*  <IonCard>*/}
        {/*    <div style={{height: "270px", width: "100%"}}>*/}
        {/*      <ResponsiveContainer width="90%" height={300}>*/}
        {/*        <RadialBarChart cx="50%" cy="50%"*/}
        {/*                        innerRadius="20%" outerRadius="80%" barSize={20} data={[consumedSeries, allocatedSeries, producedSeries]}>*/}
        {/*          <RadialBar*/}
        {/*            // label={{ position: 'insideStart', fill: '#fff' }}*/}
        {/*            background*/}
        {/*            dataKey="value"*/}
        {/*          />*/}
        {/*          <Legend iconSize={5} layout="vertical" verticalAlign="bottom" wrapperStyle={style}/>*/}
        {/*        </RadialBarChart>*/}
        {/*      </ResponsiveContainer>*/}
        {/*    </div>*/}
        {/*    <div className={"ion-padding"}>*/}
        {/*      <IonGrid>*/}
        {/*        <IonRow>*/}
        {/*          <IonCol size={"4"}>*/}
        {/*            <div className={"energy-card consumption"}>*/}
        {/*              <div className={"header"}>Verbrauch</div>*/}
        {/*              <div className={"value"}>*/}
        {/*                <span style={{fontSize: "12px"}}>{Math.round(100 * consumedSeries.value) / 100}</span>*/}
        {/*                <span style={{fontSize: "12px"}}> kWh</span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </IonCol>*/}
        {/*          <IonCol size={"4"}>*/}
        {/*            <div className={"energy-card allocation"}>*/}
        {/*              <div className={"header"}>EEG</div>*/}
        {/*              <div className={"value"}>*/}
        {/*                <span style={{fontSize: "12px"}}>{Math.round(100 * allocatedSeries.value) / 100}</span>*/}
        {/*                <span style={{fontSize: "12px"}}> kWh</span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </IonCol>*/}
        {/*          <IonCol size={"4"}>*/}
        {/*            <div className={"energy-card production"}>*/}
        {/*              <div className={"header"}>Produktion</div>*/}
        {/*              <div className={"value"}>*/}
        {/*                <span style={{fontSize: "12px"}}>{Math.round(100 * producedSeries.value) / 100}</span>*/}
        {/*                <span style={{fontSize: "12px"}}> kWh</span></div>*/}
        {/*            </div>*/}
        {/*          </IonCol>*/}
        {/*        </IonRow>*/}
        {/*      </IonGrid>*/}
        {/*    </div>*/}
        {/*  </IonCard>*/}
        {/*<IonCard>*/}
        {/*  <div style={{height: "50%", width: "100%"}}>*/}
        {/*    <ResponsiveContainer width="100%" height={400}>*/}
        {/*      /!*<LineChart width={600} height={400} data={intermediateSeries.map((e, i) => {*!/*/}
        {/*      /!*  const consumed = e.consumed.reduce((s, i) => s + i, 0)*!/*/}
        {/*      /!*  const allocated = e.allocated.reduce((s, i) => s + i, 0)*!/*/}
        {/*      /!*  const produced = e.produced.reduce((s, i) => s + i, 0)*!/*/}
        {/*      /!*  return {*!/*/}
        {/*      /!*    name: "" + (i + 1),*!/*/}
        {/*      /!*    distributed: allocated,*!/*/}
        {/*      /!*    consumed: consumed,*!/*/}
        {/*      /!*    produced: produced*!/*/}
        {/*      /!*  }*!/*/}
        {/*      /!*})} margin={{top: 15, right: 15, bottom: 35, left: 0}}>*!/*/}
        {/*      <LineChart width={600} height={400} data={reportSeries} margin={{top: 15, right: 15, bottom: 35, left: 0}}>*/}
        {/*        <YAxis fontSize={10} unit={" kWh"}/>*/}
        {/*        <CartesianGrid strokeDasharray="3 3"/>*/}
        {/*        <XAxis dataKey="name" angle={315} tickMargin={5} fontSize={10}/>*/}
        {/*        <Tooltip formatter={(value) => Number(value).toFixed(3) + " kWh"}/>*/}
        {/*        <Legend align={'center'} verticalAlign={'bottom'} height={40} fontSize={"4px"}/>*/}
        {/*        <Line name="Verteilt" type="monotone" dataKey="distributed" stroke="#20c997" strokeWidth={2} fontSize={6} activeDot={false} dot={false}/>*/}
        {/*        <Line name="Verbrauch" type="monotone" dataKey="consumed" stroke="#1657a6" strokeWidth={1} fontSize={6} activeDot={false} dot={false}/>*/}
        {/*        <Line name="Erzeugt" type="monotone" dataKey="produced" stroke="#1f7485" strokeWidth={1} fontSize={6} activeDot={false} dot={false}/>*/}
        {/*      </LineChart>*/}
        {/*    </ResponsiveContainer>*/}
        {/*  </div>*/}
        {/*</IonCard>*/}
      </IonContent>
    </IonPage>
  )
}

export default DashbaordPage;