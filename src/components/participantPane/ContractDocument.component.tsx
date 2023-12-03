import React, {FC, MouseEventHandler, useEffect, useState} from "react";
import {
  IonButton, IonButtons,
  IonCard, IonCol, IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader, IonRow,
  IonToolbar, useIonAlert,
  useIonModal
} from "@ionic/react";
import {eegPdfDoc, eegStar} from "../../eegIcons";
import {eegService} from "../../service/eeg.service";
import {ContractInfo, EegParticipant} from "../../models/members.model";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import UploadContractFilesDialog from "../dialogs/UploadContractFiles.dialog";

import "./ContractDocument.component.scss"
import {trash, trashBin} from "ionicons/icons";
import {fileService} from "../../service/file.service";
import {fetchBillingRun} from "../../store/billingRun";
import {createPeriodIdentifier} from "../../models/energy.model";
import {IonButtonCustomEvent} from "@ionic/core/dist/types/components";


interface ContractDocumentComponentProps {
  tenant: string;
  participant: EegParticipant;
}
const ContractDocumentComponent: FC<ContractDocumentComponentProps> = ({tenant, participant}) => {
  const [contractDocs, setContractDocs] = useState<ContractInfo[]>([])
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (tenant && participant) {
      fileService.loadContractDocumentInfos(tenant, participant.id)
        .then(docs => {
          return docs
        })
        // .then(docs => docs.filter(d => d.userId === participant.id && d.fileCategory === "contract"))
        .then(docs => setContractDocs(docs))
    }

  }, [tenant, participant])

  async function createReport(fileDownloadUrl: string, filename: string) {
    try {
      eegService.downloadDocument(tenant, fileDownloadUrl).then(b => {
        const fileURL = URL.createObjectURL(b);
        // //Open the URL on new Window
        window.open(fileURL, '_blank');
      })
    } catch (e) {
      console.log(e as string)
    }
  }

  // const onWillDismiss = (participant: EegParticipant, ev: CustomEvent<OverlayEventDetail<FormData>>) => {
  //   if (ev.detail.role === 'confirm' && ev.detail.data) {
  //     const data = ev.detail.data
  //     // uploadContractDocuments
  //     eegService.uploadContractDocuments(tenant, participant.id, data.getAll("docfiles").map(e => e as File))
  //   }
  // }

  const [present, dismiss] = useIonModal(UploadContractFilesDialog, {
    participant,
    onDismiss: (data: FormData, role: string) => dismiss(data, role),
    uploadButtonText: "Hochladen",
    children: (
      <>
        <p>Bitte lade die Anmeldedokumente von {participant.firstname} {participant.lastname} hoch</p>
      </>
    )
  });

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm' && ev.detail.data) {
          const data:FormData = ev.detail.data
          fileService.uploadContractDocuments(tenant, participant.id, data.getAll("docfiles")
            .map(e => e as File))
            .then((r) => {
              const fileInfo = {id: r.data.addFile.id,
                fileCategory: "contract",
                createdAt: r.data.addFile.createdAt,
                name: r.data.addFile.name,
                userId: participant.id} as ContractInfo
              setContractDocs(prev => [...prev, fileInfo])
            })
        }
      },
      cssClass: "upload-contract",
    });
  }

  const deleteContract = (c: ContractInfo) => (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
    event.stopPropagation()
    presentAlert({
      subHeader: "Vertragsdaten",
      message: `Die Datei ${c.name} wird unwiderruflich vom Server gelöscht!`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
      onDidDismiss: (e: CustomEvent) => {
        if (e.detail.role === 'confirm') {
          fileService.deleteContractDocuments(tenant, c.id).then(() => {
            setContractDocs((d) => d.filter(e => e.id !== c.id))
          })
        }
      },
    })
  }
  const parseFileName = (create: string, name: string) => {
    const date = new Date(create).toLocaleString('de-at',{month:'short', year:'numeric'})
    return (
      // <><span style={{width: "20%"}}>{date.getFullYear() + "-" + date.getMonth()}</span><span>{name}</span></>
      <IonGrid>
        <IonRow>
          {/*<IonCol size={"3"}>{date.getFullYear() + "-" + String(date.getMonth()).padStart(2, '0')}</IonCol>*/}
          <IonCol size={"3"}>{date}</IonCol>
          <IonCol>{name}</IonCol>
        </IonRow>
      </IonGrid>
    )
  }
  const renderContent = () => {
    if (contractDocs.length === 0) {
     return (
       <div className="ion-padding">
         <IonToolbar>
           <IonLabel><h1>Verträge</h1></IonLabel>
         </IonToolbar>
         <IonCard color="warning-light">
           <IonItem lines="none" color="warning-light">
             <IonIcon icon={eegStar} slot="start"/>
             <IonLabel>Noch keine Verträge für das Mitglied {participant.lastname} hochgeladen.</IonLabel>
           </IonItem>
           <IonItem lines="none" color="warning-light">
             <IonButton slot="end" color="warning" size="default" onClick={openModal}>Hochladen</IonButton>
           </IonItem>
         </IonCard>
       </div>
      )
    }

    return (
      <div className="ion-padding">
        <IonToolbar>
          <IonLabel><h1>Verträge</h1></IonLabel>
          <IonButton slot="end" onClick={openModal}>Hinzufügen</IonButton>
        </IonToolbar>
        <IonList>
        {
          contractDocs.map((d, i) => (
            <IonItem button key={d.id} lines="none" onClick={() => createReport(d.id, d.name)}>
              <IonLabel>{parseFileName(d.createdAt, d.name)}</IonLabel>
              <IonIcon icon={eegPdfDoc} slot="start"></IonIcon>
              <IonButtons slot="end">
                <IonButton size={"small"} fill={"clear"} onClick={deleteContract(d)}>
                  <IonIcon slot="icon-only" size={"small"} icon={trash}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
          ))
        }
        </IonList>
      </div>
    )
  }

  return (
    <div>
      {renderContent()}
    </div>  )
}

export default ContractDocumentComponent;