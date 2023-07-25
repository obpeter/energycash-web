import React, {FC, useEffect, useState} from "react";
import {
  IonCard,
  IonContent,
  IonItem,
  IonPage, IonSelect, IonSelectOption,
  IonToggle, SelectChangeEventDetail, SelectCustomEvent
} from "@ionic/react";
import InputFormComponent from "../components/form/InputForm.component";
import {useAppDispatch, useAppSelector} from "../store";
import {eegSelector, selectedTenant, selectTenant, updateEegModel} from "../store/eeg";
import {Controller, useForm} from "react-hook-form";
import SelectForm from "../components/form/SelectForm.component";

import "./Eeg.page.scss"
import {useTenants} from "../store/hook/AuthProvider";
import {AccountInfo, Address, Contact, Eeg, Optionals} from "../models/eeg.model";
import {eegService} from "../service/eeg.service";
import {IonSelectCustomEvent} from "@ionic/core/dist/types/components";
import {useAccessGroups} from "../store/hook/Eeg.provider";
import {findPartial} from "../util/Helper.util";

const EegPage: FC = () => {

  const eeg = useAppSelector(eegSelector);
  const tenant = useAppSelector(selectedTenant);
  const dispatcher = useAppDispatch();

  const {isAdmin} = useAccessGroups()

  const {handleSubmit, control, formState: {isDirty, dirtyFields}} =
    useForm({
      defaultValues: eeg,
      values: eeg,
      mode: "all",
    })
  const [tenantsState, setTenantsState] = useState<string[]>([])
  const tenants = useTenants()

  useEffect(() => {
    // setTenantState(tenant);
    setTenantsState(tenants.map(t => t.toUpperCase()))
  }, [tenants])

  const onSwitchTenant = (e: SelectCustomEvent<string>) => {
    const tenant = e.detail.value;
    localStorage.setItem("tenant", tenant.toUpperCase())
    dispatcher(selectTenant(tenant))
  }

  const onSubmit = (data: Eeg) => {
    if (Object.keys(dirtyFields).length > 0) {
      if (dirtyFields.address) {
        dispatcher(updateEegModel({
          tenant, eeg: Object.keys(dirtyFields.address)
            .reduce((obj, key) => ({...obj, [key]: (data.address as Address)[key as keyof Address]}), {})
        }))
      } else if (dirtyFields.contact) {
        dispatcher(updateEegModel({
          tenant, eeg: Object.keys(dirtyFields.contact)
            .reduce((obj, key) => ({...obj, [key]: (data.contact as Contact)[key as keyof Contact]}), {})
        }))
      } else if (dirtyFields.accountInfo) {
        dispatcher(updateEegModel({
          tenant, eeg: Object.keys(dirtyFields.accountInfo)
            .reduce((obj, key) => ({...obj, [key]: (data.accountInfo as AccountInfo)[key as keyof AccountInfo]}), {})
        }))
      } else if (dirtyFields.optionals) {
        dispatcher(updateEegModel({
          tenant, eeg: Object.keys(dirtyFields.optionals)
            .reduce((obj, key) => ({...obj, [key]: (data.optionals as Optionals)[key as keyof Optionals]}), {})
        }))
      } else {
        dispatcher(updateEegModel({
          tenant, eeg: Object.keys(dirtyFields)
            .reduce((obj, key) => ({...obj, [key]: (data as Eeg)[key as keyof Eeg]}), {})
        }))
      }
    }
  }

  const onChangeValue = (e: IonSelectCustomEvent<SelectChangeEventDetail>) => {
    dispatcher(updateEegModel({tenant, eeg: {[e.target.name]: e.detail.value}}))
    // eegService.updateEeg(tenant, {[e.target.name]: e.detail.value})
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{flexGrow: "1", background: "#EAE7D9", height: "100vh"}}>
          <div style={{display: "flex", flexDirection: "row"}}>

            <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
              <div className={"eeg-property-card"}>
                <div className={"header"}>Einstellungen</div>
                <IonCard color="eeglight">
                  <div className="form-element">
                    {/*<IonItem fill="outline">*/}
                    {/*<IonLabel position="floating">RC Nummer</IonLabel>*/}
                    <IonSelect fill="outline" label="Auswahl Gemeinschaft" labelPlacement={"floating"} className="select-box"
                               value={tenant}
                               onIonChange={onSwitchTenant}>
                      {tenantsState && tenantsState.map((o, idx) => (
                          <IonSelectOption key={idx} value={o}>{o}</IonSelectOption>
                        )
                      )}
                    </IonSelect>
                    {/*</IonItem>*/}
                  </div>
                  {/*<form>*/}
                  <SelectForm label={"Abrechnungszeitraum"} placeholder={"Abrechnungszeitraum"} control={control}
                              name={"settlementInterval"} options={[
                    {key: "MONTHLY", value: "Monatlich"},
                    {key: "QUARTER", value: "Vierteljährlich"},
                    {key: "BIANNUAL", value: "Halbjährlich"},
                    {key: "ANNUAL", value: "Jährlich"},
                  ]} onIonChange={onChangeValue}></SelectForm>
                  <IonItem lines="none">
                    {/*<IonLabel slot="start">SEPA aktiv</IonLabel>*/}
                    <Controller
                      name={"accountInfo.sepa"}
                      control={control}
                      render={({field}) => {
                        const {onChange, value} = field;
                        return (<IonToggle
                          style={{width: "100%"}}
                          slot="start"
                          labelPlacement="start"
                          checked={value}
                          onIonChange={(e) => {
                            onChange(e.detail.checked);
                          }}>SEPA aktiv</IonToggle>)
                      }
                      }
                    />
                  </IonItem>
                  {/*</form>*/}
                </IonCard>
              </div>
              <div className={"eeg-property-card"}>
                <form onBlur={handleSubmit(onSubmit)}>
                  <div className={"header"}>Allgemeines</div>
                  <IonCard color="eeglight">

                    <InputFormComponent name={"rcNumber"} label="RC Nummer" control={control} rules={{}} type="text"
                                        readonly={true}/>
                    <InputFormComponent name={"communityId"} label="Gemeinschafts-Id" control={control} rules={{}}
                                        type="text"
                                        readonly={true}/>

                    {/*<InputFormComponent name={"legal"} label="Rechtsform" control={control} rules={{}} type="text"*/}
                    {/*                    readonly={true}/>*/}
                    <SelectForm name={"legal"} label="Rechtsform" control={control} options={[
                      {key: "verein", value: "Verein"},
                      {key: "genossenschaft", value: "Genossenschaft"},
                      {key: "gesellschaft", value: "Gesellschaft"}]} placeholder="Rechtsform" disabled={!isAdmin()}/>
                    <InputFormComponent name={"vatNumber"} label="Umsatzsteuer ID" control={control} rules={{}}
                                        type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"taxNumber"} label="Steuernummer" control={control} rules={{}} type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"allocationMode"} label="Verteilung" control={control} rules={{}}
                                        type="text" readonly={true}/>
                    {/*<SelectForm name={"allocationMode"} label="Verteilung" control={control} options={[*/}
                    {/*  {key: "STATIC", value: "Statisch"},*/}
                    {/*  {key: "DYNAMIC", value: "Dynamisch"}]} placeholder="Verteilung" readonly={true}/>*/}
                  </IonCard>
                </form>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>

              <form onBlur={handleSubmit(onSubmit)}>
                <div className={"eeg-property-card"}>
                  <div className={"header"}>Adresse</div>
                  <IonCard color="eeglight">

                    <InputFormComponent name={"address.street"} label="Straße" control={control} rules={{}} type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"address.streetNumber"} label="Hausnummer" control={control} rules={{}}
                                        type="text" readonly={!isAdmin()}/>
                    <InputFormComponent name={"address.zip"} label="Postleitzahl" control={control} rules={{}}
                                        type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"address.city"} label="Ort" control={control} rules={{}} type="text"
                                        readonly={!isAdmin()}/>
                  </IonCard>
                </div>

                <div className={"eeg-property-card"}>
                  <div className={"header"}>Kontakt</div>
                  <IonCard color="eeglight">
                    <InputFormComponent name={"contact.phone"} label="Telefon" control={control} type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"contact.email"} label="E-Mail" control={control}
                                        rules={{regex: /[a-z\.]@[a-z]\.\w{3}/}} type="text" readonly={!isAdmin()}/>
                  </IonCard>
                </div>

                <div className={"eeg-property-card"}>
                  <div className={"header"}>Bankdaten</div>
                  <IonCard color="eeglight">
                    <InputFormComponent name={"accountInfo.iban"} label="IBAN" control={control} rules={{}} type="text"
                                        readonly={!isAdmin()}/>
                    <InputFormComponent name={"accountInfo.owner"} label="Kontoinhaber" control={control}
                                        rules={{regex: /[a-zA-Z\s]*/}} type="text" readonly={!isAdmin()}/>
                  </IonCard>
                </div>

                <div className={"eeg-property-card"}>
                  <div className={"header"}>Optional</div>
                  <IonCard color="eeglight">
                    <InputFormComponent name={"optionals.website"} label="Webseite" control={control}
                                        rules={{regex: /[a-z\.]*\.\w{3}/}} type="text" readonly={!isAdmin()}/>
                  </IonCard>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
export default EegPage;