import React, {createContext, FC, ReactNode, useState} from "react";

interface MemberViewContextState {
  hideMember: boolean
  hideMeter: boolean
  hideProducers: boolean
  hideConsumers: boolean

  showAmount: boolean
  toggleMembersMeter: (state: number) => void
  toggleMetering: (state: number) => void
  toggleShowAmount: (state: boolean) => void
}

 // const initialState: MemberViewContextState = {
 //   hideMember: false,
 //   hideMeter: false,
 //   hideConsumers: false,
 //   hideProducers: false,
 //   showAmount: false,
 // }

export const MemberViewContext = createContext({} as MemberViewContextState)

const MemberViewProvider: FC<{children: ReactNode}> = ({children}) => {

  const [hideMembers, setHideMembers] = useState(false)
  const [hideCounterPoints, setHideCounterPoints] = useState(false)

  const [hideProducers, setHideProducers] = useState(false)
  const [hideConsumers, setHideConsumers] = useState(false)

  const [showAmount, setShowAmount] = useState(false)

  const toggleMembers = (index: number) => {

    if (index === 0) {
      setHideMembers(false);
      setHideCounterPoints(false);
    } else if (index === 1) {
      setHideMembers(false);
      setHideCounterPoints(true);
    } else {
      setHideMembers(true);
      setHideCounterPoints(false);
    }
  }

  const toggleCounterPoints = (index: number) => {
    if (index === 0) {
      setHideProducers(false);
      setHideConsumers(false);
    } else if (index === 1) {
      setHideProducers(false);
      setHideConsumers(true);
    } else {
      setHideProducers(true);
      setHideConsumers(false);
    }
  }


  const value: MemberViewContextState = {
    hideMember: hideMembers,
    hideMeter: hideCounterPoints,
    hideConsumers: hideConsumers,
    hideProducers: hideProducers,
    showAmount: showAmount,
    toggleMembersMeter: toggleMembers,
    toggleMetering: toggleCounterPoints,
    toggleShowAmount: setShowAmount
  }

  return (
    <MemberViewContext.Provider value={value}>
      {children}
    </MemberViewContext.Provider>
  )
}

export default MemberViewProvider;