import {FC, useEffect, useState} from "react";
import {useAppSelector} from "../../store";
import {selectAllIntermediatesV2} from "../../store/energy";
import {IntermediateRecord, SelectedPeriod} from "../../models/energy.model";
import {Bar, BarChart, Legend, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {PieSeriesType, ReportSeriesType} from "../../pages/Dashbaord.page";
import {calcXAxisName, periodDisplayString} from "../../util/Helper.util";
import {IonSpinner} from "@ionic/react";

interface LoadSharingComponentProps {
  intermediateSeries: IntermediateRecord[];
  report: ReportSeriesType[]
  activePeriod: SelectedPeriod
}

type LoadSharingData = {
  name: string
}

const LoadSharingComponent: FC<LoadSharingComponentProps> = ({intermediateSeries, report, activePeriod}) => {

  const [data, setData] = useState<LoadSharingData[]>([] as LoadSharingData[])

  useEffect(() => {
    setData(report.map((r, i) => {
      return {
        name: calcXAxisName(i, activePeriod),
        consumed: r.consumed - r.distributed,
        produced: r.produced,
        distributed: r.distributed,
      } as LoadSharingData
    }))
  }, [report]);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul>
        {
          payload.map((entry:any, index:any) => (
            <li key={`item-${index}`}>{entry.value}</li>
          ))
        }
      </ul>
    );
  }

  if (!activePeriod) {
    return <IonSpinner></IonSpinner>
  }

  return (
    <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
      <div style={{textAlign: "center", margin: "6px"}}>
        <div style={{fontSize: "24px"}}>Lastverlauf</div>
        <div style={{fontSize: "14px"}}>Zeitraum: {periodDisplayString(activePeriod)}</div>
      </div>
      <div style={{display: "flex", flexFlow: "column", height: "100%", margin: "16px"}}>
        <div className={"eeg-card eeg-card-border"} style={{flex: "1", width: "100%", height: "100%", minHeight: "100px"}}>
          <ResponsiveContainer width="100%" height={"100%"} minHeight={300} minWidth={100}>
            <BarChart width={600} height={400} data={data} margin={{top: 15, right: 15, bottom: 5, left: 0}}>
              <YAxis fontSize={10} unit={" kWh"}/>
              <XAxis dataKey="name" angle={315} tickMargin={5} fontSize={10}/>
              <Tooltip formatter={(value) => Number(value).toFixed(3) + " kWh"}/>
              <Legend align={'center'} verticalAlign={'bottom'} height={20} wrapperStyle={{fontSize: "10px"}}/>
              {/*<Legend content={renderLegend} align={'center'} verticalAlign={'bottom'} height={40} fontSize={"4px"}/>*/}
              <Bar name="EEG" stackId="a" dataKey="distributed"  fill="#0AF2D3"/>
              <Bar name="EVU" stackId="a" dataKey="consumed" fill="#F20A5E" />
              <Bar name="Erzeugt" dataKey="produced"  fill="#2B6860"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default LoadSharingComponent