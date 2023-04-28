import {Address} from "./eeg.model";

export interface Metering {
  meteringPoint: string;
  direction: "GENERATOR" | "CONSUMPTION";
  ownValue: number;
  totalValue: number;
  participantId: string;
  equipmentName: string;
  transformer: string;
  inverterId: string;
  tariffId: string;
  street: string;
  streetNumber: string;
  city: string;
  zip: string,
  status: "NEW" | "PENDING" | "ACTIVE" | "INACTIVE"
};

export interface MeteringEnergyGroupType {
  meteringPoint: string;
  allocation: number;
}

export interface MeteringBillType {
  id: string;
  amount: number;
}

export interface ParticipantBillType {
  id: string;
  amount: number;
  meteringPoints: MeteringBillType[]
}