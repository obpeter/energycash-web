import React, {FC} from "react";
import {Eeg, EegRegister} from "../../models/eeg.model";
import {Control, FieldErrors} from "react-hook-form";
import InputForm from "../form/InputForm.component";
import {Metering} from "../../models/meteringpoint.model";
import SelectForm from "../form/SelectForm.component";
import CorePageTemplate from "../core/CorePage.template";


interface CommonEegPropertiesComponentProps {
  control: Control<EegRegister, any>
  errors?: FieldErrors<EegRegister>
}

const CommonEegPropertiesComponent: FC<CommonEegPropertiesComponentProps> = ({control, errors}) => {

  return (
    <div style={{padding: "16px"}}>
    {/*<CorePageTemplate>*/}
      <h2>Allgemeine Einstellungen Erneuerbarer Energie Gemeinschaften</h2>
      <InputForm name={"name"} label="Name" control={control} rules={{required: "Name fehlt"}} type="text" error={errors?.name} placeholder="Kurzbezeichnung deiner EEG"/>
      <InputForm name={"rcNumber"} label="RC-Nummer" control={control} rules={{required: "RC-Nummer fehlt"}} type="text" error={errors?.rcNumber}/>
      <InputForm name={"communityId"} label="Gemeinschafts-ID" control={control} rules={{required: "Gemeinschafts-ID fehlt"}} type="text" error={errors?.communityId}/>
      <SelectForm name={"legal"} label="Rechtsform" control={control} options={[
        {key: "verein", value: "Verein"},
        {key: "genossenschaft", value: "Genossenschaft"},
        {key: "gesellschaft", value: "Gesellschaft"}]} placeholder="Rechtsform"/>
      <SelectForm name={"allocationMode"} label="Verteilung" control={control} options={[
        {key: "STATIC", value: "Statisch"},
        {key: "DYNAMIC", value: "Dynamisch"}]} placeholder="Verteilung"/>
      <SelectForm name={"area"} label="Region" control={control} options={[
        {key: "LOCAL", value: "Local"},
        {key: "REGIONAL", value: "Regional"}]} placeholder="Region"/>
    {/*</CorePageTemplate>*/}
    </div>
  )
}

export default CommonEegPropertiesComponent