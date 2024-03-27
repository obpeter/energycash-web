import {EegService} from "./eeg.service";
import {EnergyService} from "./energy.service";
import {FileService} from "./file.service";
import {ParticipantService} from "./participant.service";
import {TariffService} from "./tariff.service";

interface IApi {
  eegService: EegService
  energyService: EnergyService
  fileService: FileService
  participantService: ParticipantService
  tariffService: TariffService
}

export const Api = {} as IApi