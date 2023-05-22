
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

const UploadEneryMutation = (tenant: string, sheet: string) => `{
  singleUpload(tenant: "${tenant}", sheet: "${sheet}", file: $energyData)
}`; // graphQl Query

export const uploadEnergyGraphqlMutation = async (tenant: string, sheet: string, data: File) => {

  const fileToBlob = async (file: File) => new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type });

  const formData = new FormData();

  formData.append("operations", JSON.stringify({
    operationName: null,
    query: `mutation ($energyData: Upload!) ${UploadEneryMutation(tenant.toLowerCase(), sheet)}`,
    variables: {"energyData": null},
  }))
  formData.append("map", JSON.stringify({"0": ["variables.energyData"]}))
  formData.append("0", data)

  return formData;
};
