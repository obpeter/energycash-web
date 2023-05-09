import React, {FC, useState} from "react";
import {Metering} from "../models/meteringpoint.model";
import {IonButton, IonCol, IonFooter, IonGrid, IonList, IonListHeader, IonRow, IonToolbar} from "@ionic/react";
import ToggleButtonComponent from "./ToggleButton.component";
import {eegPlug} from "../eegIcons";
import {star} from "ionicons/icons";
import SelectFormNative from "./form/SelectFormNative.component";
import SelectForm from "./form/SelectForm.component";
import InputForm from "./form/InputForm.component";
import CheckboxComponent from "./form/Checkbox.component";
import {Control, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {useAppSelector} from "../store";
import {ratesSelector} from "../store/rate";
import {EegParticipant} from "../models/members.model";
import {Address} from "../models/eeg.model";

interface RegisterMeterPaneComponentProps {
  meter: Metering
  onAdd: (meter: Metering) => void
  onChancel: () => void
}

const RegisterMeterPaneComponent: FC<RegisterMeterPaneComponentProps> = ({meter, onAdd, onChancel}) => {

  const rates = useAppSelector(ratesSelector);
  const [selectedDirection, setSelectedDirection] = useState(0);
  const [withWechselrichter, setWithWechselrichter] = useState(false);
  const [withOwner, setWithOwner] = useState(false);

  const meteringPoint = {direction: "CONSUMPTION", status: "NEW", meteringPoint: ""} as Metering;

  const participantControl = useFormContext();
  const address = participantControl.watch("residentAddress", {} as Address)

  const {handleSubmit, setValue, control, formState: {errors:counterPointErrors}} = useForm({defaultValues: meter});
  // const control = participantControl.control

  const onChangeDirection = (s: number) => {
    setSelectedDirection(s)
    setValue(`direction`, s === 0 ? "CONSUMPTION" : "GENERATOR");
  }

  const getRatesOption = () => {
    return rates.map((r) => {
      return {key: r.id, value: r.name}
    });
  }

  const takeOverAddress = (ok: boolean) => {
    if (address) {
      if (ok) {
        setValue(`street`, address.street);
        setValue(`streetNumber`, "" + address.streetNumber);
        setValue(`city`, address.city);
        setValue(`zip`, address.zip);
      }

      setWithOwner(ok);
    }
  }

  const editable = () => meteringPoint.status === "NEW";

  const onAppend = () => {
    console.log("Onappend")
    handleSubmit( (d) => {
      console.log("onAppend: ", d)

      onAdd(d)
    })
  }

  // const onCancel = () => {
  //   remove(index);
  // }

  const forwardSave = (data: any) => {
    console.info("Submit ModalForm", data);
    onAdd(data);
  };

  const handleSubmitWithoutPropagation = (e: any) => {
    e.preventDefault();
    handleSubmit(forwardSave)(e);
    // e.stopPropagation();
  };

  return (
    <>
      <form onSubmit={ handleSubmitWithoutPropagation} action={undefined} >
        <div style={{display: "grid", gridTemplateColumns: "50% 50%", justifyContent: "space-between"}}>
          <div style={{flexGrow: "1", height: "100%"}}>
            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  {address.street+"s"}
                  <ToggleButtonComponent
                    buttons={[{label: 'Verbraucher', icon: eegPlug}, {label: 'Erzeuger', icon: star}]}
                    onChange={onChangeDirection}
                    value={selectedDirection}
                    changeable={editable()}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonList>
              <SelectForm name={`tariffId`} label="Tarif" control={control} options={getRatesOption()}
                          placeholder="Tarif" disabled={false} rules={{required: "Tarif fehlt"}} error={counterPointErrors.tariffId}/>
              <InputForm name={`meteringPoint`} label="Zählpunkt" control={control} rules={{required: "Zählpunktnummer fehlt", min: 33, regex: /AT[0-9]{32}/}}
                         type="text" error={counterPointErrors.meteringPoint}/>
              <CheckboxComponent label="Wechselrichter anlegen" setChecked={setWithWechselrichter}
                                 checked={withWechselrichter}></CheckboxComponent>
              {withWechselrichter && (
                <InputForm name={`inverterId`} label="Wechselrichternummer" control={control}
                           type="text"/>
              )}
              <InputForm name={`transformer`} label="Transformator" control={control} type="text"/>
              <InputForm name={`equipmentName`} label="Anlagename" control={control} type="text"/>
            </IonList>
          </div>
          <div style={{flexGrow: "1", height: "100%"}}>
            <IonList>
              <IonListHeader>Adresse</IonListHeader>
              <CheckboxComponent label="Adresse vom Besitzer übernehmen" setChecked={takeOverAddress}
                                 checked={withOwner}></CheckboxComponent>
              <InputForm name={`street`} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text"/>
              <InputForm name={`streetNumber`} label="Hausnummer" control={control} rules={{required: "Straße fehlt"}} type="text"/>
              <InputForm name={`zip`} label="Postleitzahl" control={control} rules={{required: "Straße fehlt"}} type="text"/>
              <InputForm name={`city`} label="Ort" control={control} rules={{required: "Straße fehlt"}} type="text"/>
            </IonList>
          </div>
          <div style={{gridColumnStart: "1", gridColumnEnd: "2", display: "grid"}}>
            <IonFooter>
              <IonToolbar className={"ion-padding-horizontal"}>
                <IonButton fill="clear" slot="start" onClick={() => onChancel()}>Abbrechen</IonButton>
                <IonButton slot="end" type="submit">Hinzufügen</IonButton>
              </IonToolbar>
            </IonFooter>
          </div>
        </div>
      </form>
    </>
  )
}

export default RegisterMeterPaneComponent;