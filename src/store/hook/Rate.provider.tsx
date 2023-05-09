import {createContext, FC, ReactNode, useContext, useState} from "react";

type RateType = "EEG" | "VZP" | "EZP" | "AKONTO"

interface RateState {
  currentRateType: RateType;
  setRateType: (r: RateType) => void;
}

const initialState: RateState = {
  currentRateType: 'EEG',
  setRateType: (r: RateType) => {}
}

export const RateContext = createContext(initialState)


const RateProvider: FC<{children: ReactNode}> = ({children}) => {

  const [rateType, setRateType] = useState<RateType>('EEG')

  const value = {
    currentRateType: rateType,
    setRateType: setRateType,
  } as RateState

  return (
    <RateContext.Provider value={value}>
      {children}
    </RateContext.Provider>
  )
}

export default RateProvider

export const useRateType = () => {
  const {currentRateType, setRateType} = useContext(RateContext)
  return {currentRateType, setRateType}
}