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
  status: "NEW" | "PENDING" | "APPROVED" | "ACTIVE" | "INACTIVE" | "REJECTED"
};

export interface ClearingPreviewRequest {
  tenantId: string;
  clearingPeriodType: string;
  clearingPeriodIdentifier: string;
  allocations: MeteringEnergyGroupType[];
  preview: boolean;
}

export interface ClearingPreviewResponse {
  participantAmounts: ParticipantBillType[];
}

export interface InvoiceDocumentResponse {
  name: string;
  mimeType: string;
  tenantId: string;
  fileDataId: string;
  billingDocumentId: string;
  participantId: string;
}

export interface MeteringEnergyGroupType {
  meteringPoint: string;
  allocationKWh: number;
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