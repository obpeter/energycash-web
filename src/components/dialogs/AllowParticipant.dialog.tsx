import React, {ChangeEvent, ChangeEventHandler, FC, useRef, useState} from "react";
import {IonButton, IonButtons, IonIcon, IonModal} from "@ionic/react";
import {EegParticipant} from "../../models/members.model";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import {eegPdfDoc} from "../../eegIcons";
import {trash} from "ionicons/icons";

import "./AllowParticipant.dialog.scss"


interface AllowParticipantDialogProps {
  trigger: string;
  participant: EegParticipant;
  onDismiss: (participant: EegParticipant, ev: CustomEvent<OverlayEventDetail>) => void;
}

const AllowParticipantDialog: FC<AllowParticipantDialogProps> = ({trigger, participant, onDismiss}) => {
  const modal = useRef<HTMLIonModalElement>(null);
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
    modal.current?.dismiss(formData, 'confirm');
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
    <IonModal id="doc-upload-modal" className="ion-padding" ref={modal} trigger={trigger} onWillDismiss={(ev) => onDismiss(participant, ev)}>
      <div className="wrapper">
        <h6>{participant.firstname} {participant.lastname} zulassen</h6>
        <p>Bitte lade die Anmeldedokumente von {participant.firstname} {participant.lastname} hoch</p>
        <input type="file" id="file" ref={inputFile} style={{display: "none"}} onChange={onFileChange}/>
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
        <IonButton fill="clear" onClick={() => modal.current?.dismiss()}>Abbrechen</IonButton>
        <IonButton fill="clear" slot={"end"} onClick={() => confirm()}>Zulassen</IonButton>
      </IonButtons>
      </div>
    </IonModal>
  )
}

export default AllowParticipantDialog;