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
    </div>
  )
}

export default ProcessHeaderComponent;