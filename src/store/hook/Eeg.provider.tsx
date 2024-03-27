import React, {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../index";
import {clearErrorState, eegSelector, fetchEegModel, selectError, selectTenant} from "../eeg";
import {useRoles, useTenants} from "./AuthProvider";
import {fetchRatesModel} from "../rate";
import {fetchParticipantModel} from "../participant";
import {useIonToast} from "@ionic/react";
import {Eeg} from "../../models/eeg.model";
import {SelectedPeriod} from "../../models/energy.model";
import {setSelectedPeriod} from "../energy";
import {Api} from "../../service";
import {useSelector} from "react-redux";


export interface EegState {
  eeg: Eeg | undefined
  isAdmin: () => boolean
  isOwner: () => boolean
  isUser: () => boolean
  setTenant: (tenant: string) => void
  refresh: () => void
}

const initialState: EegState = {
  eeg: undefined,
  isAdmin: () => false,
  isOwner: () => false,
  isUser: () => false,
  setTenant: (tenant: string) => {},
  refresh: () => {},
}


export const EegContext = createContext(initialState)

export const EegProvider: FC<{ children: ReactNode }> = ({children}) => {

  const dispatch = useAppDispatch();
  const hasError = useSelector(selectError)
  const tenants = useTenants();
  const roles = useRoles();
  const [toaster] = useIonToast()

  const eeg = useAppSelector(eegSelector);
  const [activeTenent, setActiveTenant] = useState<string>()

  const errorToast = (message: string | undefined) => {
    toaster({
      message: message,
      duration: 13500,
      position: "bottom",
      color: "danger",
      buttons: [{text: "OK"}],
      onDidDismiss: (e) => dispatch(clearErrorState())
    });
  };

  const activateTenant = (tenant: string) => {
    dispatch(selectTenant(tenant))
    setActiveTenant(tenant)
    localStorage.setItem("tenant", tenant.toUpperCase())
  }

  useEffect(() => {
    if (hasError && hasError.hasError) {
      errorToast(hasError.error?.message)
    }
  }, [hasError]);

  useEffect(() => {
    if (activeTenent) {
      initApplication()
    }
  }, [activeTenent])

  useEffect(() => {
    const storedTenant = localStorage.getItem("tenant")
    if (storedTenant) {
      activateTenant(storedTenant)
    } else {
      if (tenants.length > 0) {
        activateTenant(tenants[0])
      } else {
        console.error("Can not find an active tenant")
      }
    }
  }, [tenants])

  useEffect(() => {
    if (eeg) {
      getCurrentPeroid(eeg)
        .then(p => dispatch(setSelectedPeriod(p)))
        .catch(e => console.log(e))
    }
  }, [eeg]);

  const getCurrentPeroid = async (eeg: Eeg) => {
    const currentDate =  new Date(Date.now())
    let period = "Y"
    let segment = 0
    switch (eeg.settlementInterval) {
      case "MONTHLY":
        period = "YM"
        segment = currentDate.getMonth() + 1
        break;
      case "BIANNUAL":
        period = "YH"
        segment = (currentDate.getMonth() + 1 < 7 ? 1 : 2)
        break;
      case "QUARTER":
        const m = currentDate.getMonth() + 1
        period = "YQ"
        segment = (m < 4 ? 1 : m < 7 ? 2 : m < 10 ? 3 : 4)
        break
    }
    return {type: period, year: currentDate.getFullYear(), segment: segment} as SelectedPeriod
  }

  const fetchCurrentPeroid = async (eeg: Eeg) => {
    return Api.energyService.fetchLastReportEntryDate(activeTenent!).then(lastReportDate => {
      if (lastReportDate && lastReportDate.length > 0) {
        const [date, time] = lastReportDate.split(" ");
        const [day, month, year] = date.split(".");
        let period = "Y"
        let segment = 0
        switch (eeg.settlementInterval) {
          case "MONTHLY":
            period = "YM"
            segment = parseInt(month, 10)
            break;
          case "BIANNUAL":
            period = "YH"
            segment = (parseInt(month, 10) < 7 ? 1 : 2)
            break;
          case "QUARTER":
            const m = parseInt(month, 10)
            period = "YQ"
            segment = (m < 4 ? 1 : m < 7 ? 2 : m < 10 ? 3 : 4)
            break
        }
        return {type: period, year: parseInt(year, 10), segment: segment} as SelectedPeriod
      }
      throw new Error("last report period not exists")
      // return {type: "Y", year: new Date(Date.now()).getFullYear(), segment: 0} as SelectedPeriod
    })

  }

  const initApplication = useCallback( async () => {
    console.log("INIT APP: ", activeTenent)
    if (activeTenent && activeTenent.length > 0) {
      // keycloak.getToken().then((token) => {
        Promise.all([
          dispatch(fetchEegModel({tenant: activeTenent})),
          dispatch(fetchRatesModel({tenant: activeTenent})),
          dispatch(fetchParticipantModel({tenant: activeTenent})),
          // eegService.fetchLastReportEntryDate(initTenant, token).then(lastReportDate => {
          //   if (lastReportDate && lastReportDate.length > 0) {
          //     const [date, time] = lastReportDate.split(" ");
          //     const [day, month, year] = date.split(".")
          //     // dispatch(setSelectedPeriod({type: "MRP", month: Number(month), year: Number(year)}))
          //     dispatch(fetchEnergyReport({tenant: initTenant!, year: parseInt(year, 10), month: parseInt(month, 10), token}))
          //   }
          // }),
        ])
      // })
    }
  }, [activeTenent])

  // const initOne = async () => {
  //   // let initTenant = tenant
  //
  //   if (!initTenant) {
  //     const storedTenant = localStorage.getItem("tenant")
  //     if (storedTenant) {
  //       dispatch(selectTenant(storedTenant))
  //       setInitTenant(storedTenant)
  //     }
  //   }
  //   await initApplication()
  // }

  // useEffect(() => {
  //   console.log("Dispatch / tenant changed")
  //
  // }, [dispatch, tenant])

  const _setTenant = (tenant: string) => {
    setActiveTenant(tenant)
    localStorage.setItem("tenant", tenant.toUpperCase())
    dispatch(selectTenant(tenant))
  }

  const value = {
    eeg: eeg,
    isAdmin: () => roles.findIndex(r => r === "/EEG_ADMIN") >= 0,
    isOwner: () => roles.findIndex(r => r === "/EEG_OWNER") >= 0,
    isUser: () => roles.findIndex(r => r === "/EEG_USER") >= 0,
    setTenant: (tenant: string) => activateTenant(tenant),
    refresh: async () => await initApplication()
  } as EegState

  return (
    <EegContext.Provider value={value}>
      {children}
    </EegContext.Provider>
  )
}

export const useAccessGroups = () => {
  const {isAdmin, isUser, isOwner} = useContext(EegContext);
  return {isAdmin, isUser, isOwner};
}

export const useRefresh = () => {
  const {refresh} = useContext(EegContext);
  return {refresh};
}

export const useOnlineState = () => {
  const context = useContext(EegContext)
  return context.eeg ? context.eeg.online : false
}

export const useEegArea = () => {
  const {eeg} = useContext(EegContext)
  return eeg?.area
}

export const useGridOperator = () => {
  const {eeg} = useContext(EegContext)
  return {gridOperatorId: eeg?.gridOperator, gridOperatorName: eeg?.operatorName}
}

export const useTenantSwitch = () => {
  const {setTenant} = useContext(EegContext)
  return setTenant
}
