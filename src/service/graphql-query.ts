
const EegQuery = `{
  eeg()
}`;

export const eegGraphqlQuery = {
    operationName: null,
    query: `query EegInfo ${EegQuery}`,
    variables: {},
};


const EnergyQuery = (tenant: string, year: number, month: number) => `{
  eeg(name:"${tenant}", year:${year}, month: ${month})
}`; // graphQl Query

export const energyGraphqlQuery = (tenant: string, year: number, month: number) => {
  return {
    operationName: null,
    query: `query EnergyInfo ${EnergyQuery(tenant.toLowerCase(), year, month)}`,
    variables: {},
  }
};

const ReportDateQuery = (tenant: string) => `{
  lastEnergyDate(tenant:"${tenant}")
}`; // graphQl Query

export const reportDateGraphqlQuery = (tenant: string) => {
  return {
    operationName: null,
    query: `query ReportDate ${ReportDateQuery(tenant.toLowerCase())}`,
    variables: {},
  }
};
