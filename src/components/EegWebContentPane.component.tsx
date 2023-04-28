import React, {FC} from "react";

interface EegWebContentPaneComponentProps {
  children: React.ReactNode
}


const EegWebContentPaneComponent: FC<EegWebContentPaneComponentProps> = ({children}) => {
  return (
    <div className={"eeg-content-pane"}>
      <div className={"eeg-pane-body"}>
        <div className={"eeg-pane-content"}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default EegWebContentPaneComponent;