import React, {FC, forwardRef, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {IonButton, IonIcon, IonInput, IonLabel} from "@ionic/react";

import "react-datepicker/dist/react-datepicker.css";
import "./data.component.scss"
import {calendar} from "ionicons/icons";

interface DateComponentProps {
  initialDate: [Date|null, Date|null]
  range: (range: [Date|null, Date|null]) => void
}

const DateComponent: FC<DateComponentProps> = ({range, initialDate}) => {
  const [dateRange, setDateRange] = useState<[Date|null, Date|null]>(initialDate);
  const [startDate, endDate] = dateRange;

  const setRange = (newRange: [Date|null, Date|null]) => {
    setDateRange(newRange)
    range(newRange)
  }

  const DateInputComponent = forwardRef<HTMLIonButtonElement, any>(function CustomInput(p, ref) {
    return (
      <IonButton fill="clear" size="small" ref={ref} {...p}>
        <IonIcon slot="icon-only" icon={calendar}/>
      </IonButton>
    );
  });

  return (
    <div style={{display: "flex", flexDirection: "row", alignItems:"center"}}>
      <div><span>{startDate?.toDateString()}</span> - <span>{endDate?.toDateString()}</span></div>
    <DatePicker
      showIcon={true}
      className={"ion-date-picker"}
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update:[Date|null, Date|null]) => {
        setRange(update);
      }}
      customInput={
            <DateInputComponent />
      }
      dateFormat="dd.MMM yyyy"
      portalId="root-portal"
    />
    </div>
  )
}

export default DateComponent;