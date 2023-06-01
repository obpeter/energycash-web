import React, {FC, useEffect, useState} from "react";
import {IonIcon, IonItem, IonLabel, IonList, IonListHeader} from "@ionic/react";
import {eegService} from "../service/eeg.service";
import {InvoiceDocumentResponse} from "../models/meteringpoint.model";
import {EegParticipant} from "../models/members.model";
import {eegPdfDoc} from "../eegIcons";


const InvoiceDocumentComponent: FC<{tenant: string, participant: EegParticipant}> = ({tenant, participant}) => {

  const [invoiceDocs, setInvoiceDocs] = useState<InvoiceDocumentResponse[]>([])

  useEffect(() => {
    if (tenant && participant) {
      eegService.fetchInvoiceDocuments(tenant)
        .then(docs => docs.filter(d => d.participantId === participant.id))
        .then(docs => setInvoiceDocs(docs))
    }
  }, [tenant, participant])


  async function createReport(fileDataId: string) {
    try {
      eegService.downloadInvoiceDocument(tenant, fileDataId).then(b => {
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
          <IonItem button key={d.billingDocumentId} lines="none" onClick={() => createReport(d.fileDataId)}>
            <IonLabel> {d.name} </IonLabel>
            <IonIcon icon={eegPdfDoc} slot="start"></IonIcon>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}

export default InvoiceDocumentComponent;