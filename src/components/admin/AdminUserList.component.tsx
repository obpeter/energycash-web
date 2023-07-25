import React, {FC} from "react";
import CorePageTemplate from "../core/CorePage.template";
import {IonItem, IonLabel, IonList} from "@ionic/react";

interface AdminUserListComponent {

}

const AdminUserListComponent: FC<AdminUserListComponent> = ({}) => {
  return (
    <CorePageTemplate>
      <IonList>
        <IonItem>
          <IonLabel>Peter Obermüller</IonLabel>
        </IonItem>
      </IonList>
    </CorePageTemplate>
  )
}

export default AdminUserListComponent