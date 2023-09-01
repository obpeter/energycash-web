import {EegTariff} from "../models/eeg.model";

const vzpInEuro = (allocated: number, tariff: EegTariff) => {
  let billableEnergy = allocated;
  let amount = 0;
  if (tariff.freeKWh) {
    billableEnergy = Math.max(billableEnergy - Number(tariff.freeKWh), 0)
  }

  if (tariff.centPerKWh) {
    amount = billableEnergy * Number(tariff.centPerKWh)
  }

  if (tariff.discount) {
    let discount = Number(tariff.discount)
    if (discount > 1 && discount <= 100) {
      discount = discount / 100;
    }
    amount = Math.max(amount * discount, 0);
  }
  return (Math.round(amount * 100) / 100)
}

const ezpInEuro = (allocated: number, tariff: EegTariff) => {
  let billableEnergy = allocated;
  let amount = 0;
  if (tariff.freeKWh) {
    billableEnergy = Math.max(billableEnergy - Number(tariff.freeKWh), 0)
  }

  if (tariff.centPerKWh) {
    amount = billableEnergy * Number(tariff.centPerKWh)
  }

  if (tariff.discount) {
    let discount = Number(tariff.discount)
    if (discount > 1 && discount <= 100) {
      discount = discount / 100;
    }
    amount = Math.max(amount * discount, 0);
  }
  return (Math.round(amount * 100) / 100)
}

const eegInEuro = (tariff: EegTariff) => {
  if (tariff && tariff.baseFee) {
    return Number(tariff.baseFee)
  }
  return 0
}

export const amountInEuro = (allocated: number, tariff: EegTariff) => {
  switch (tariff.type) {
    case 'VZP': return vzpInEuro(allocated, tariff);
    case 'EZP': return ezpInEuro(allocated, tariff);
    default: return eegInEuro(tariff)
  }
}