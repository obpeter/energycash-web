import {FC, useState} from "react";
import InputForm from "./form/InputForm.component";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import ToggleButtonComponent from "./ToggleButton.component";
import {people} from "ionicons/icons";
import {eegBusiness} from "../eegIcons";
import {EegParticipant} from "../models/members.model";
import {Control, useForm, useFormContext, useWatch} from "react-hook-form";

interface ParticipantRegisterCommonPaneComponentProps {
  participant: EegParticipant;
  submitId: string
  onAdd: (participant: EegParticipant) => void;
}

const ParticipantRegisterCommonPaneComponent: FC<ParticipantRegisterCommonPaneComponentProps> = ({
                                                                                                   participant,
                                                                                                   submitId,
                                                                                                   onAdd
                                                                                                 }) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)
  // const {handleSubmit, control, register, setValue} = useForm({defaultValues: participant});

  const { control, setValue } = useFormContext();
  const onSubmit = (data: EegParticipant) => {
    onAdd(data)
  }

  const onChangeBusinessType = (s: number) => {
    setSelectedBusinessType(s)
    setValue("businessRole", s === 0 ? "EEG_PRIVATE" : "EEG_BUSINESS")
  }

  const editable = () => {
    return participant.status !== "NEW"
  }

  return (
    <div style={{background: "var(--ion-item-background, #fff)", boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)", borderRadius: "4px"}}>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              initalType={selectedBusinessType}
              changeable={editable()}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {/*<form id={submitId} onSubmit={handleSubmit(onSubmit)}>*/}
        <div style={{display: "flex", flexDirection: "row"}}>
          <div style={{flexGrow: "1", height: "100%"}}>
            <IonList>
              <IonListHeader>Kontakt</IonListHeader>
              <InputForm name={"firstname"} label="Vorname" control={control} rules={{}} type="text"/>
              <InputForm name={"lastname"} label="Nachname" control={control} rules={{}} type="text"/>
              <InputForm name={"residentAddress.street"} label="Straße" control={control} rules={{}} type="text"/>
              <InputForm name={"residentAddress.streetNumber"} label="Hausnummer" control={control} rules={{}}
                         type="number"/>
              <InputForm name={"residentAddress.zip"} label="Postleitzahl" control={control} rules={{}} type="text"/>
              <InputForm name={"residentAddress.city"} label="Ort" control={control} rules={{}} type="text"/>
              <InputForm name={"contact.phone"} label="Telefon" control={control} rules={{}} type="text"/>
              <InputForm name={"contact.email"} label="E-Mail" control={control} rules={{}} type="text"/>
            </IonList>

          </div>

          <div style={{flexGrow: "1", height: "100%"}}>
            <IonList>
              <IonListHeader>Bankdaten</IonListHeader>
              <InputForm name={"accountInfo.iban"} label="IBAN" control={control} rules={{}} type="text"/>
              <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control} rules={{}} type="text"/>
            </IonList>
            <IonList>
              <IonListHeader>Optional</IonListHeader>
              <InputForm name={"optionals.website"} label="Webseite" control={control} rules={{}} type="text"/>
            </IonList>

          </div>
        </div>

      {/*</form>*/}
    </div>
  )
}

export default ParticipantRegisterCommonPaneComponent;