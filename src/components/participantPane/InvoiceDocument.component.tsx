import React, {FC, useEffect, useState} from "react";
import {IonIcon, IonItem, IonLabel, IonList, IonListHeader} from "@ionic/react";
import {InvoiceDocumentResponse} from "../../models/meteringpoint.model";
import {EegParticipant} from "../../models/members.model";
import {eegPdfDoc} from "../../eegIcons";
import {Api} from "../../service";


const InvoiceDocumentComponent: FC<{tenant: string, participant: EegParticipant}> = ({tenant, participant}) => {

  const [invoiceDocs, setInvoiceDocs] = useState<InvoiceDocumentResponse[]>([])

  useEffect(() => {
    if (tenant && participant) {
      Api.eegService.fetchBillingDocumentFiles(tenant)
        .then(docs => docs.filter(d => d.participantId === participant.id))
        .then(docs => setInvoiceDocs(docs))
    }
  }, [tenant, participant])


  async function downloadBillingDocument(fileDataId: string) {
    try {
      Api.eegService.downloadBillingDocument(tenant, fileDataId).then(b => {
        const fileURL = URL.createObjectURL(b);
        // //Open the URL on new Window
        window.open(fileURL, '_blank');
      })
    } catch (e) {
      console.log(e as string)
    }
  }
  return (
    <div>
      <IonList>
        <IonListHeader><h2>Rechnungen</h2></IonListHeader>
        {invoiceDocs.map((d, i) => (
          <IonItem button key={d.billingDocumentId} lines="none" onClick={() => downloadBillingDocument(d.fileDataId)}>
            <IonLabel> {d.name} </IonLabel>
            <IonIcon icon={eegPdfDoc} slot="start"></IonIcon>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}

export default InvoiceDocumentComponent;