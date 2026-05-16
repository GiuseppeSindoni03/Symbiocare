import { NotificationEventType } from './notification-event-type.enum';

export interface NotificationEvent {
  /** Tipo di evento */
  eventType: NotificationEventType;

  /** Email del paziente destinatario */
  patientEmail: string;

  /** Nome completo del paziente */
  patientName: string;

  /** Nome completo del dottore */
  doctorName: string;

  /** Data e ora dell'appuntamento (ISO 8601) */
  appointmentDate: string;

  /** Data e ora di fine appuntamento (ISO 8601) */
  appointmentEndDate: string;

  /** Tipo di visita (es. "Prima Visita", "Controllo") */
  visitType: string;

  /** ID della prenotazione */
  reservationId: string;

  /** Timestamp dell'invio dell'evento (ISO 8601) */
  sentAt: string;
}
