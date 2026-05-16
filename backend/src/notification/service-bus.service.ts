import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import { NotificationEvent } from './types/notification-event.interface';

@Injectable()
export class ServiceBusService implements OnModuleDestroy {
  private readonly logger = new Logger(ServiceBusService.name);
  private client: ServiceBusClient | null = null;
  private sender: ServiceBusSender | null = null;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_SERVICE_BUS_CONNECTION_STRING',
    );
    const queueName = this.configService.get<string>(
      'AZURE_SERVICE_BUS_QUEUE_NAME',
    );

    if (connectionString && queueName) {
      try {
        this.client = new ServiceBusClient(connectionString);
        this.sender = this.client.createSender(queueName);
        this.logger.log(
          `Service Bus connesso alla coda "${queueName}"`,
        );
      } catch (error) {
        this.logger.error(
          'Errore nella connessione ad Azure Service Bus:',
          error,
        );
      }
    } else {
      this.logger.warn(
        'Azure Service Bus non configurato: AZURE_SERVICE_BUS_CONNECTION_STRING o AZURE_SERVICE_BUS_QUEUE_NAME mancanti. ' +
          'Le notifiche verranno solo loggate in console.',
      );
    }
  }

  /**
   * Invia un evento di notifica ad Azure Service Bus.
   * Se Service Bus non è configurato, logga l'evento in console.
   */
  async sendNotificationEvent(event: NotificationEvent): Promise<void> {
    this.logger.log(
      `Invio evento [${event.eventType}] per ${event.patientEmail}`,
    );

    if (!this.sender) {
      this.logger.warn(
        `[FALLBACK] Service Bus non disponibile. Evento: ${JSON.stringify(event, null, 2)}`,
      );
      return;
    }

    try {
      await this.sender.sendMessages({
        body: event,
        contentType: 'application/json',
        subject: event.eventType,
        applicationProperties: {
          eventType: event.eventType,
          patientEmail: event.patientEmail,
          reservationId: event.reservationId,
        },
      });

      this.logger.log(
        `Evento [${event.eventType}] inviato con successo per la prenotazione ${event.reservationId}`,
      );
    } catch (error) {
      this.logger.error(
        `Errore nell'invio dell'evento [${event.eventType}]:`,
        error,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.sender) {
        await this.sender.close();
      }
      if (this.client) {
        await this.client.close();
      }
      this.logger.log('Connessione ad Azure Service Bus chiusa');
    } catch (error) {
      this.logger.error(
        'Errore nella chiusura della connessione Service Bus:',
        error,
      );
    }
  }
}
