import {options} from "ionicons/icons";

export interface Eeg {
  name: string;
  rcNumber: string;
  legal: string;
  salesTax: string;
  taxNumber: string;
  settlement: string;
  settlementInterval: string;
  communityId: string;
  address: Address;
  contact: Contact;
  accountInfo: AccountInfo;
  optionals: Optionals;
}

export interface Address {
  street: string;
  streetNumber: number;
  zip: string;
  city: string;
  type: "BILLING" | "RESIDENCE"
}

export interface Contact {
  phone: string;
  email: string;
}

export interface AccountInfo {
  iban: string;
  owner: string;
  sepa: boolean;
}

export interface Optionals {
  website: string;
}

export interface EegRateItem {
  name: RateTypeEnum;
  value: string;
  unit: string;
  optional: boolean;
}

export interface EegRate {
  id: string;
  name: string;
  vat: number;
  type: "EEG" | "EZP" | "VZP";
  items: EegRateItem[];
}

export enum RateTypeEnum {
  AHEAD = "Vorauszahlung",
  DISCOUNT = "Rabatt",
  CENTPERKWH = "Cent pro kWh",
  INCLUDEKWH = "Inklusive kWh",
  DISCOUNTINPERCENT = "Rabatt in %",
  FIXSUM = "Pauschalbetrag",
  FIXSUM1 = ""
}

export const memberType: EegRateItem[] = [
  {name: RateTypeEnum.AHEAD, value: "", unit: "€", optional: true},
  {name: RateTypeEnum.DISCOUNT, value: "", unit: "%", optional: true},
]

export const vzpType: EegRateItem[] = [
  {name: RateTypeEnum.CENTPERKWH, value: "", unit: "€", optional: false},
  {name: RateTypeEnum.INCLUDEKWH, value: "", unit: "kWh", optional: true},
  {name: RateTypeEnum.DISCOUNTINPERCENT, value: "", unit: "%", optional: true},
]

export const ezpType: EegRateItem[] = [
  {name: RateTypeEnum.FIXSUM, value: "", unit: "€", optional: false},
  {name: RateTypeEnum.CENTPERKWH, value: "", unit: "€" , optional: true},
]

export interface EegTariff {
  id: string;
  name: string;
  type: "EEG" | "EZP" | "VZP" | "AKONTO";
  billingPeriod?: string
  useVat?: boolean
  vatInPercent?: string
  accountNetAmount?: string
  accountGrossAmount?: string
  participantFee?: string
  baseFee?: string
  businessNr?: string
  centPerKWh?: string
  freeKWH?: string
  discount?: string
}

export enum MONTHNAME {
  Januar = 1,
  Februar,
  März,
  April,
  Mai,
  Juni,
  Juli,
  August,
  September,
  Oktober,
  November,
  Dezember
}