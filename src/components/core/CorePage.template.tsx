import React, {FC, ReactNode} from "react";
import {IonContent} from "@ionic/react";

import "../../styles/Pane.style.scss"

const CorePageTemplate: FC<{children: ReactNode}> = ({children}) => {
  return (
    <IonContent color={"eeglight"}>
      <div className={"details-container"}>
        {children}
      </div>
    </IonContent>
  )
}
export default CorePageTemplate