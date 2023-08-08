import {EegParticipant} from "../../models/members.model";
import React, {ChangeEvent, FC, ReactNode, useRef, useState} from "react";
import {IonButton, IonButtons, IonIcon, IonModal} from "@ionic/react";
import {eegPdfDoc} from "../../eegIcons";
import {trash} from "ionicons/icons";

import "./UploadContractFiles.dialog.scss"

interface UploadContractFilesDialogProps {
  participant: EegParticipant;
  onDismiss: (data?: FormData, role?: string) => void;
  children?: ReactNode;
  uploadButtonText?: string;
}

const UploadContractFilesDialog: FC<UploadContractFilesDialogProps> = ({participant, onDismiss, children, uploadButtonText}) => {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<File[]>([])

  // const formData = new FormData();
  function confirm() {
    const formData = new FormData();
    files.forEach(f => {
      if (f) {
        formData.append('docfiles', f, f.name);
      }
    })
    onDismiss(formData, 'confirm');
  }

  const appendFileToFormData = () => {
    inputFile.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newfiles = e.target.files
    if (newfiles && newfiles.length > 0) {
      setFiles([...files, newfiles[0]])
    }
  }

  return (
    <div className="doc-upload-modal">
      <div className="wrapper">
        {children}
        <input type="file" id="file" accept=".jpeg,.png,.pdf" ref={inputFile} style={{display: "none"}} onChange={onFileChange}/>
        <IonButton expand="block" onClick={() => appendFileToFormData()}> DATEI AUSWÄHLEN
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <IonIcon slot="start" icon={eegPdfDoc} />
        </IonButton>
        <div className={"file-list"}>
          {files.map((v, i) => (
            <div className={"entry"} key={i}>
              <div>{v.name}</div>
              <IonButton size={"small"} fill={"clear"} onClick={() => setFiles((prevState) => prevState.filter((f, ii) => i !== ii))}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </div>
          ))}
        </div>
      </div>
      <div style={{display: "flex", flexDirection:"row-reverse"}}>
        <IonButtons color="eeg" slot={"end"} style={{color: "black"}}>
          <IonButton fill="clear" onClick={() => onDismiss()}>Abbrechen</IonButton>
          <IonButton fill="clear" slot={"end"} onClick={() => confirm()}>{uploadButtonText ? uploadButtonText : "Zulassen"}</IonButton>
        </IonButtons>
      </div>
    </div>
  )
}

export default UploadContractFilesDialog;