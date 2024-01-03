

export type InvestigatorCP = {
  meteringPoint: string
  direction: string
  name: string
}

export type ExcelReportRequest = {
  start: number;
  end: number;
  communityId: string;
  cps: InvestigatorCP[];
}

export type CpPeriodType = {
  begin: string;
  end: string;
}