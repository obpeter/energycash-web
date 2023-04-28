import {createContext, FC, ReactNode, useState} from "react";
import {useAppSelector} from "../index";
import {meteringEnergyGroup} from "../energy";
import {MeteringEnergyGroupType} from "../../models/meteringpoint.model";

type ParticipantRateType = "EEG" | "VZP" | "EZP"

export interface ParticipantsRateState {
  participantRates: Record<string, Record<ParticipantRateType, number>>
  setParticipantRate: (participantId: string, type: ParticipantRateType, value: number) => void
  energyMeterGroup: MeteringEnergyGroupType[]
  // updateBillPreview: () => void
}

const initialState: ParticipantsRateState = {
  participantRates: {},
  setParticipantRate: (participantId: string, type: ParticipantRateType, value: number) => {},
  energyMeterGroup: []
}

export const ParticipantRateContext = createContext(initialState)


const ParticipantRateProvider: FC<{children: ReactNode}> = ({children}) => {

  const [participantsRate, setParticipantsRate] = useState<Record<string, Record<ParticipantRateType, number>>>({})

  const energyMeterGroup = useAppSelector(meteringEnergyGroup)

  const value = {
    participantRates: participantsRate,
    setParticipantRate: (participantId: string, type: ParticipantRateType, value: number) => {
      setParticipantsRate((state) => {
        const newState = {...state}
        newState[participantId][type] = value
        return newState
      })
    },
    energyMeterGroup: energyMeterGroup,
  } as ParticipantsRateState

  return (
    <ParticipantRateContext.Provider value={value}>
      {children}
    </ParticipantRateContext.Provider>
  )
}

export default ParticipantRateProvider