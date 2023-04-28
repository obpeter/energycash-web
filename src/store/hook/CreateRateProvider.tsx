import React, {createContext, FC, ReactNode, useState} from "react";
import {EegRate} from "../../models/eeg.model";

interface RateContextState {
  rate: EegRate
  updateRate: (rate: EegRate) => void
}

const initialState: RateContextState = {rate: {} as EegRate, updateRate: (r: EegRate)=>{}}

export const RateContext = createContext(initialState)

export const CreateRateProvider: FC<{children: ReactNode}> = ({children}) => {

  const updateRateFn = (rate: EegRate) => {
    newState((state) => (
      {rate: rate, updateRate: updateRateFn}
    ))
  }

  const [state, newState] = useState<RateContextState>({rate: {} as EegRate, updateRate: updateRateFn})

  return (
    <RateContext.Provider value={state}>
      {children}
    </RateContext.Provider>
  )
}

