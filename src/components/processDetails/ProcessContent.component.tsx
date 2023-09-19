import React, {FC, ReactNode} from "react";

interface ProcessContentComponentProps {
  children?: ReactNode
}

const ProcessContentComponent: FC<ProcessContentComponentProps> = ({children}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
      {children}
    </div>
  )
}

export default ProcessContentComponent;