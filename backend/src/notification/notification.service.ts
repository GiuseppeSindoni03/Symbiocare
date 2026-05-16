import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ServiceBusService } from './service-bus.service';
import { Reservation } from '../reservation/reservation.entity';
import { ReservationStatus } from '../reservation/types/reservation-status-enum';
import { NotificationEventType } from './types/notification-event-type.enum';
import { NotificationEvent } from './types/notification-event.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly serviceBusService: ServiceBusService,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  /**
   * Invia notifica quando il dottore crea un appuntamento per il paziente.
   */
  async notifyAppointmentCreated(reservation: Reservation): Promise<void> {
    const event = await this.buildNotificationEvent(
      NotificationEventType.APPOINTMENT_CREATED,
      reservation,
    );

    if (event) {
      await this.serviceBusService.sendNotificationEvent(event);
    }
  }

  /**
   * Invia notifica quando la richiesta di prenotazione del paziente viene accettata.
   */
  async notifyReservationAccepted(reservation: Reservation): Promise<void> {
    const event = await this.buildNotificationEvent(
      NotificationEventType.RESERVATION_ACCEPTED,
      reservation,
    );

    if (event) {
      await this.serviceBusService.sendNotificationEvent(event);
    }
  }

  /**
   * Invia notifica quando la richiesta di prenotazione del paziente viene rifiutata.
   */
  async notifyReservationDeclined(reservation: Reservation): Promise<void> {
    const event = await this.buildNotificationEvent(
      NotificationEventType.RESERVATION_DECLINED,
      reservation,
    );

    if (event) {
      await this.serviceBusService.sendNotificationEvent(event);
    }
  }

  /**
   * Cron job: ogni ora controlla se ci sono appuntamenti nelle prossime 24 ore
   * e invia un promemoria al paziente.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders(): Promise<void> {
    this.logger.log('Avvio controllo promemoria appuntamenti 24h...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Trova gli appuntamenti confermati che iniziano nelle prossime 24 ore
    const upcomingReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.CONFIRMED,
        startDate: Between(now, in24Hours),
        reminderSent: false,
      },
      relations: ['patient', 'patient.user', 'doctor', 'doctor.user', 'visitType'],
    });

    this.logger.log(
      `Trovati ${upcomingReservations.length} appuntamenti per promemoria`,
    );

    for (const reservation of upcomingReservations) {
      try {
        const event = this.buildEventFromLoadedReservation(
          NotificationEventType.APPOINTMENT_REMINDER_24H,
          reservation,
        );

        if (event) {
          await this.serviceBusService.sendNotificationEvent(event);

          // Segna il promemoria come inviato per evitare duplicati
          reservation.reminderSent = true;
          await this.reservationRepository.save(reservation);

          this.logger.log(
            `Promemoria inviato per prenotazione ${reservation.id}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Errore nell'invio del promemoria per la prenotazione ${reservation.id}:`,
          error,
        );
      }
    }

    this.logger.log('Controllo promemoria completato.');
  }

  /**
   * Costruisce l'evento di notifica caricando le relazioni necessarie.
   */
  private async buildNotificationEvent(
    eventType: NotificationEventType,
    reservation: Reservation,
  ): Promise<NotificationEvent | null> {
    // Carica la reservation con tutte le relazioni necessarie
    const fullReservation = await this.reservationRepository.findOne({
      where: { id: reservation.id },
      relations: ['patient', 'patient.user', 'doctor', 'doctor.user', 'visitType'],
    });

    if (!fullReservation) {
      this.logger.error(
        `Prenotazione ${reservation.id} non trovata per la notifica`,
      );
      return null;
    }

    return this.buildEventFromLoadedReservation(eventType, fullReservation);
  }

  /**
   * Costruisce l'evento di notifica da una reservation con le relazioni già caricate.
   */
  private buildEventFromLoadedReservation(
    eventType: NotificationEventType,
    reservation: Reservation,
  ): NotificationEvent | null {
    const patientUser = reservation.patient?.user;
    const doctorUser = reservation.doctor?.user;

    if (!patientUser) {
      this.logger.warn(
        `Paziente senza utente associato per la prenotazione ${reservation.id}. Notifica non inviata.`,
      );
      return null;
    }

    if (!doctorUser) {
      this.logger.warn(
        `Dottore senza utente associato per la prenotazione ${reservation.id}. Notifica non inviata.`,
      );
      return null;
    }

    return {
      eventType,
      patientEmail: patientUser.email,
      patientName: `${patientUser.name} ${patientUser.surname}`,
      doctorName: `${doctorUser.name} ${doctorUser.surname}`,
      appointmentDate: reservation.startDate.toISOString(),
      appointmentEndDate: reservation.endDate.toISOString(),
      visitType: reservation.visitType?.name || 'N/A',
      reservationId: reservation.id,
      sentAt: new Date().toISOString(),
    };
  }
}
