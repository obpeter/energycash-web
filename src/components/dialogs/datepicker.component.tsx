import React, {FC, useRef, useState} from "react";
import {IonButton, IonIcon, IonItem, IonList, IonModal} from "@ionic/react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {calendar} from "ionicons/icons";

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
    <>
      <div style={{display: "flex", flexDirection: "row"}}>
        <div>12:08:2023 - 26.08.2023</div>
        <IonButton size="small" fill="clear" id="open-date-picker">
          <IonIcon slot="icon-only" icon={calendar}/>
        </IonButton>
      </div>

    <IonModal ref={modal} trigger="open-date-picker">
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
    </>
  )
}

export default DatepickerComponent