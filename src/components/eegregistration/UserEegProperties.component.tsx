import React, {FC, useState} from "react";
import {Eeg, EegRegister} from "../../models/eeg.model";
import {Control, Controller, FieldErrors, UseFormWatch} from "react-hook-form";
import InputForm from "../form/InputForm.component";
import {Metering} from "../../models/meteringpoint.model";
import SelectForm from "../form/SelectForm.component";
import CorePageTemplate from "../core/CorePage.template";
import {IonItem, IonToggle} from "@ionic/react";
import CheckboxComponent from "../form/Checkbox.component";


interface UserEegPropertiesComponentProps {
  control: Control<EegRegister, any>
  errors?: FieldErrors<EegRegister>
  watch?: UseFormWatch<EegRegister>
}

const UserEegPropertiesComponent: FC<UserEegPropertiesComponentProps> = ({control, errors, watch}) => {

  const [eegOnline, setEegOnline] = useState<boolean>(false)

  return (
    <div style={{padding: "16px"}}>
    {/*<CorePageTemplate>*/}
      <h2>EEG Besitzer</h2>
      <InputForm name={"firstname"} label="Vorname" control={control} type="text" rules={{required: "Vorname fehlt"}} error={errors?.firstname}/>
      <InputForm name={"lastname"} label="Nachname" control={control} type="text" rules={{required: "Nachname fehlt"}} error={errors?.lastname}/>
      <InputForm name={"email"} label="E-Mail" control={control} type="text" rules={{required: "E-Mail fehlt"}} error={errors?.email}/>
      <InputForm name={"username"} label="User Name" control={control} type="text" rules={{required: "Benutzername fehlt"}} error={errors?.username}/>
      <InputForm name={"password"} label="Passwort" control={control} type="password" rules={{required: "Passwort fehlt"}} error={errors?.password}/>
      <InputForm name={"confirmPassword"} label="Passwort bestätigen" control={control} type="password" rules={{validate: (value:string) => (watch ? value === watch("password") : false) || "Passwords do not match"}} error={errors?.confirmPassword}/>

      <h6>Ponton Verbindung</h6>

      <CheckboxComponent label="Wechselrichter anlegen" setChecked={setEegOnline}
                         checked={eegOnline} style={{paddingTop: "0px"}}></CheckboxComponent>
      <InputForm name={"smtpHost"} label="Ponton SMTP Hostname" control={control} type="text" rules={{required: "Hostname fehlt"}} error={errors?.smtpHost} disabled={eegOnline}/>
      <InputForm name={"smtpPort"} label="Ponton SMTP Portnummer" control={control} type="text" rules={{required: "Portnummer fehlt"}} error={errors?.smtpPort} disabled={eegOnline}/>
      <InputForm name={"smtpUsername"} label="Ponton SMTP Username" control={control} type="text" rules={{required: "User fehlt"}} error={errors?.smtpUsername} disabled={eegOnline}/>
      <InputForm name={"smtpPassword"} label="Passwort" control={control} type="password" rules={{required: "Passwort fehlt"}} disabled={eegOnline}/>
      <InputForm name={"smtpConfirmPassword"} label="Passwort bestätigen" control={control} type="password" rules={{validate: (value:string) => (watch ? value === watch("password") : false) || "Passwords do not match"}} error={errors?.smtpConfirmPassword}/>
    </div>
  )
}

export default UserEegPropertiesComponent