import React, {FC, ReactNode} from "react";
import DateComponent from "../dialogs/date.component";

interface ProcessHeaderComponentProps {
  name: string
  children?: ReactNode
}

const ProcessHeaderComponent: FC<ProcessHeaderComponentProps> = ({name, children}) => {
  return (
    <div className={"details-header"}>
      <div><h4>{name}</h4></div>
      {children}
      {/*{selectedProcess?.type === 'HISTORY' &&*/}
      {/*    <>*/}

      {/*        <DateComponent range={setHistoryDate} initialDate={historyDate}/>*/}
      {/*    </>*/}
      {/*}*/}
    </div>
  )
}

export default ProcessHeaderComponent;