export interface EdaHistory {
  date: Date
  protocol: string
  processType: string
  message: Record<string, any>
  responseCode?: string
  meteringPoint?: string
  meteringPoints?: string[]
  meteringFrom?: Date
  meteringTo?: Date
}

export class EdaResponseCode {
  static getMessage(code: number): string {
    switch(code) {
      case 99:
        return "Meldung erhalten"
      case 182:
        return "Noch kein fernauslesbarer Zähler eingebaut"
      case 183:
        return "Summe der gemeldeten Aufteilungsschlüssel übersteigt 100%"

      case 175:
        return "Zustimmung erteilt"

      case 56:
        return "Zählpunkt nicht gefunden"
      case 184:
        return "Kunde hat optiert"
      case 177:
        return "Keine Datenfreigabe vorhanden"
      case 160:
        return "Verteilmodell entspricht nicht der Vereinbarung"
      case 159:
        return "Zu Prozessdatum ZP inaktiv bzw. noch kein Gerät eingebaut"
      case 158:
        return "ZP ist nicht teilnahmeberechtigt"
      case 157:
        return "ZP bereits einem Betreiber zugeordnet"
      case 156:
        return "ZP bereits zugeordnet"
      case 86:
        return "konkurrierende Prozesse"
      case 181:
        return "Gemeinschafts-ID nicht vorhanden"
      case 178:
        return "Consent existiert bereits"
      case 174:
        return "Angefragte Daten nicht lieferbar"
      case 173:
        return "Kunde hat auf Datenfreigabe nicht reagiert (Timeout)"
      case 172:
        return "Kunde hat Datenfreigabe abgelehnt"
      case 76:
        return "Ungültige Anforderungsdaten"
      case 57:
        return "Zählpunkt nicht versorgt"
      case 185:
        return "Zählpunkt befindet sich nicht im Bereich der Energiegemeinschaft"
      case 37:
        return "Stornierung nicht möglich"

      case 55:
        return "Zählpunkt nicht dem Lieferanten zugeordnet"
      case 70:
        return "Änderung/Anforderung akzeptiert"
      case 82:
        return "Prozessdatum falsch"
      case 90:
        return "Kein Smart Meter"
      case 94:
        return "Keine Daten im angeforderten Zeitraum vorhanden"
    }
    return code.toString()
  }

}