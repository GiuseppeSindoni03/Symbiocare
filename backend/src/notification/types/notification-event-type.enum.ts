export enum NotificationEventType {
  /** Appuntamento creato dal dottore per il paziente */
  APPOINTMENT_CREATED = 'appointment_created',

  /** Richiesta di prenotazione del paziente accettata dal dottore */
  RESERVATION_ACCEPTED = 'reservation_accepted',

  /** Richiesta di prenotazione del paziente rifiutata dal dottore */
  RESERVATION_DECLINED = 'reservation_declined',

  /** Promemoria 24 ore prima dell'appuntamento */
  APPOINTMENT_REMINDER_24H = 'appointment_reminder_24h',
}
