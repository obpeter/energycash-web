import {AccountInfo, Address, Contact, Optionals} from "./eeg.model";
import {Metering} from "./meteringpoint.model";

export interface EegParticipant {
  id: string;
  participantNumber:string,
  firstname: string;
  lastname: string;
  residentAddress: Address;
  billingAddress: Address;
  contact: Contact;
  titleBefore: string;
  titleAfter: string;
  taxNumber: string;
  accountInfo: AccountInfo;
  optionals: Optionals;
  meters: Metering[];
  status: 'NEW' | 'PENDING' | 'ACTIVE' | 'DISUSED'
  role: 'EEG_ADMIN' | 'EEG_USER'
  businessRole: 'EEG_PRIVATE' | 'EEG_BUSINESS'
  tariffId: string
}