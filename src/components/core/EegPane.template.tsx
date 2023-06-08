import React, {FC, ReactNode} from "react";

import "../../styles/Pane.style.scss"

const EegPaneTemplate: FC<{children: ReactNode}> = ({children}) => {
  return (
      <div className={"eeg-pane-content"}>
        {children}
      </div>
  )
}
export default EegPaneTemplate