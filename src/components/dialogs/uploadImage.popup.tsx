import React, {ChangeEvent, FC, useState} from "react";
import {IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonRow} from "@ionic/react";
import {searchOutline} from "ionicons/icons";
import "./upload.popover.scss"

const UploadImagePopup: FC<{
  tenant: string
  imageType : 'logo' | 'footer'
  onDismiss: (data: [files: FileList | null | undefined, imageType : 'logo' | 'footer'], role: string) => void
}> = ({tenant, imageType, onDismiss}) => {

  const [file, setFile] = useState<FileList | null>();

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setFile(evt.target.files);
    // onUpdate(evt.target.files)
  }

  return (
    <IonContent className="ion-padding" color="eeglight">
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <b>Bild für {imageType.toUpperCase()}</b>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <div style={{fontSize: "12px"}}>Max. Größe: 256KB, Erlaubte Dateitypen: PNG, JPG, GIF</div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <label htmlFor="btn-upload">
              <div><IonIcon slot="icon-only" icon={searchOutline}></IonIcon> DATEI AUSWÄHLEN</div>
              <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{display: 'none'}}
                  type="file"
                  onChange={onChange}/>
            </label>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <div>
              {
                (file && file.length > 0) ? file[0].name : null
              }
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonButton expand="block" onClick={() => onDismiss([file, imageType],"confirm")}>SPEICHERN</IonButton>

    </IonContent>
  )
}

export default UploadImagePopup;