import React, {FC} from "react";

import '../styles/Pane.style.scss'

interface EegWebContentPaneComponentProps {
  children: React.ReactNode
}

const EegWebContentPaneComponent: FC<EegWebContentPaneComponentProps> = ({children}) => {
  return (
    <div className={"details-body"} style={{height: "100%", display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
        {children}
      </div>
    </div>
  )
}

export default EegWebContentPaneComponent;