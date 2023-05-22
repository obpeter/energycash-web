import React, {FC, useRef, useState} from "react";
import {IonItem, IonList, IonModal} from "@ionic/react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface DatepickerComponentProps {
  range: (range: [Date, Date]) => void
  trigger: string
}

const DatepickerComponent: FC<DatepickerComponentProps> = ({range, trigger}) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const [dateRange, setDateRange] = useState<[Date|null, Date|null]>([null, null]);
  const [startDate, endDate] = dateRange;

  function dismiss(start: boolean) {
    modal.current?.dismiss();
    const [begin, end] = dateRange
    if (start && begin !== null && end !== null) {
      range([begin, end])
    }
    setDateRange([null, null])
  }

  return (
    <IonModal ref={modal} trigger={trigger}>
      <div className="wrapper">
        <h1>Zeitraum</h1>
        <IonList lines="none" style={{textAlign: "center"}}>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update:[Date|null, Date|null]) => {
              setDateRange(update);
            }}
            inline
          />

          <IonItem button={true} detail={false} onClick={() => dismiss(true)}>
            Export
          </IonItem>
          <IonItem button={true} detail={false} onClick={() => dismiss(false)}>
            Chancel
          </IonItem>
        </IonList>

      </div>
    </IonModal>
  )
}

export default DatepickerComponent