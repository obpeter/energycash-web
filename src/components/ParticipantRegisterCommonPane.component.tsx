import React, {FC, useState} from "react";
import InputForm from "./form/InputForm.component";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import ToggleButtonComponent from "./ToggleButton.component";
import {people} from "ionicons/icons";
import {eegBusiness} from "../eegIcons";
import {EegParticipant} from "../models/members.model";
import {useFormContext} from "react-hook-form";
import {useMaskito} from "@maskito/react";
import {IbanInputForm} from "./form/IbanInputForm";

interface ParticipantRegisterCommonPaneComponentProps {
  participant: EegParticipant;
  submitId: string
  onAdd: (participant: EegParticipant) => void;
}

const ParticipantRegisterCommonPaneComponent: FC<ParticipantRegisterCommonPaneComponentProps> = ({
                                                                                                   participant
                                                                                                 }) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)
  const {control, setValue, formState: {errors}} = useFormContext<EegParticipant>();

  const ibanMask = useMaskito({
    options: {
      mask: [
        'A', 'T',
        ...Array(2).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
        ' ',
        ...Array(4).fill(/\d/),
      ],
    },
  });
  const onChangeBusinessType = (s: number) => {
    setSelectedBusinessType(s)
    setValue("businessRole", s === 0 ? "EEG_PRIVATE" : "EEG_BUSINESS")
  }

  const editable = () => {
    return participant.status === "NEW"
  }

  return (
    <div style={{
      background: "var(--ion-color-eeglight, #fff)",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
      borderRadius: "4px"
    }}>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              value={selectedBusinessType}
              changeable={editable()}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{flexGrow: "1", height: "100%", width: "50%"}}>
          <IonList>
            <IonListHeader>Kontakt</IonListHeader>
            <InputForm name={"participantNumber"} label="Mitglieds-Nr" control={control} type="text"/>
            {selectedBusinessType === 0 ? (
                <>
                  <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                    <InputForm name={"titleBefore"} label="Titel (Vor)" control={control} type="text"/>
                    <InputForm name={"titleAfter"} label="Titel (Nach)" control={control} type="text"/>
                  </div>
                  <InputForm name={"firstname"} label="Vorname" control={control}
                             rules={{required: "Vorname fehlt"}} type="text" error={errors.firstname} />
                  <InputForm name={"lastname"} label="Nachname" control={control} rules={{required: "Vorname fehlt"}}
                             type="text" error={errors.lastname} />
                </>
              ) :
              (
                <InputForm name={"firstname"} label="Firmenname" control={control}
                           rules={{required: "Firmenname fehlt"}} type="text" error={errors.firstname}/>
              )
            }
            <InputForm name={"billingAddress.street"} label="Straße" control={control}
                       rules={{required: "Straße fehlt"}} type="text" error={errors.billingAddress?.street}/>
            <InputForm name={"billingAddress.streetNumber"} label="Hausnummer" control={control}
                       rules={{required: "Hausnummer fehlt"}}
                       type="text" error={errors.billingAddress?.streetNumber}/>
            <InputForm name={"billingAddress.zip"} label="Postleitzahl" control={control}
                       rules={{required: "PLZ fehlt"}} type="text" error={errors.billingAddress?.zip}/>
            <InputForm name={"billingAddress.city"} label="Ort" control={control} rules={{required: "Ort fehlt"}}
                       type="text" error={errors.billingAddress?.city}/>
            <InputForm name={"contact.phone"} label="Telefon" control={control} type="text"/>
            <InputForm name={"contact.email"} label="E-Mail" control={control} type="text"
                       rules={{required: "Email Adresse fehlt"}} error={errors.contact?.email}/>
          </IonList>

        </div>

        <div style={{flexGrow: "1", height: "100%", width: "50%"}}>
          <IonList>
            <IonListHeader>Bankdaten</IonListHeader>
            <IbanInputForm name={"accountInfo.iban"} control={control} error={errors.accountInfo?.iban}/>
            <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control}
                       rules={{required: "Kontoinhaber fehlt"}} type="text" error={errors.accountInfo?.owner}/>
          </IonList>
          <IonList>
            <IonListHeader>Optional</IonListHeader>
            <InputForm name={"optionals.website"} label="Webseite" control={control} type="text"/>
          </IonList>

        </div>
      </div>
    </div>
  )
}

export default ParticipantRegisterCommonPaneComponent;