import {createContext, FC, ReactNode, useCallback, useState} from "react";
import {EegParticipant} from "../../models/members.model";
import {useAppDispatch} from "../index";
import {selectParticipant} from "../participant";
import {EegTariff, RateTypeEnum} from "../../models/eeg.model";


export interface ParicipantState {
  // participants: EegParticipant[]
  // selectedParticipant: EegParticipant | undefined
  // selectedParticipants: string[]
  // rates: EegTariff[]
  createNewRate: () => void
  selectRate: (rate: EegTariff | undefined) => void
  createNewParticipant?: () => void
  selectedRate?: EegTariff
  detailsPageOpen: boolean
  showDetailsPage: (participant: EegParticipant) => void
  closeDetailPage: (open: boolean) => void
  enableBilling: boolean
  setEnableBilling: (enabled: boolean) => void
  checkedParticipant: Record<string, boolean>
  setCheckedParticipant: (participantId: string, checked: boolean) => void
}

const initialState: ParicipantState = {
  // participants: [],
  // selectedParticipant: undefined,
  // selectedParticipants: [],
  // rates: [],
  createNewRate: () => {},
  selectRate: (e:EegTariff | undefined) => {},
  detailsPageOpen: false,
  showDetailsPage: (p: EegParticipant) => {},
  closeDetailPage: (open: boolean) => {},
  enableBilling: false,
  setEnableBilling: (enabled: boolean) => {},
  checkedParticipant: {},
  setCheckedParticipant: (participantId: string, checked: boolean) => {}
}

export const ParticipantContext = createContext(initialState)

const ParticipantProvider: FC<{children: ReactNode}> = ({children}) => {

  const dispatch = useAppDispatch();
  // const participants = useAppSelector(participantsSelector);
  // const rates = useAppSelector(ratesSelector);

  const [state, setState] = useState<ParicipantState>(initialState);
  const [detailOpen, setDetailOpen] = useState(false);
  const [enableBilling, setEnableBilling] = useState<boolean>(false)
  const [checkedParticipants, setCheckedParticipants] = useState<Record<string, boolean>>({})

  const newRateFn = () => {
    setState({
      ...state,
      selectedRate: {name: RateTypeEnum.AHEAD} as EegTariff
    });
  }

  const selectRateFn = (rate: EegTariff | undefined) => {
    setState( {
      ...state,
      selectedRate: rate
    })
  }

  const showDetailPageFn = (participant: EegParticipant) => {
    dispatch(selectParticipant(participant.id))
    // setState({
    //   ...state,
    //   // selectedParticipant: participant
    // });
    setDetailOpen(true);
  }

  const closeDetailPageFn = (state: boolean) => {
    setDetailOpen(state);
  }

  const value = {
    // participants: participants,
    // selectedParticipant: state.selectedParticipant,
    // selectedParticipants: [],
    // rates: rates,
    selectedRate: undefined,
    detailsPageOpen: detailOpen,
    createNewRate: useCallback<()=>void>(newRateFn, []),
    selectRate: selectRateFn,
    showDetailsPage: showDetailPageFn,
    closeDetailPage: closeDetailPageFn,
    enableBilling: enableBilling,
    setEnableBilling: setEnableBilling,
    checkedParticipant: checkedParticipants,
    setCheckedParticipant: (participantId: string, checked: boolean) => { setCheckedParticipants((s) => {
      const newS = {...s}
      if (!checked) {
        delete newS[participantId];
      } else {
        newS[participantId] = checked
      }
      return newS;
      }
    )}
  } as ParicipantState

  // useEffect(() => {
  //   Promise.all([
  //     dispatch(fetchParticipantModel({tenant: "RC130100"}))
  //     // dispatch(fetchRatesModel({tenant: "RC130100"}))
  //     ]
  //   )
  // }, [])

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  )
}

export default ParticipantProvider;


// export const useParticipants = () => {
//   const {participants} = useContext(ParticipantContext)
//   return participants;
// }
// export const useRates = () => {
//   const {rates} = useContext(ParticipantContext);
//   return rates;
// }