import { Injectable } from '@nestjs/common';
import * as appInsights from 'applicationinsights';

@Injectable()
export class MonitoringService {
  private client: appInsights.TelemetryClient | null = null;

  constructor() {
    if (appInsights.defaultClient) {
      this.client = appInsights.defaultClient;
    }
  }

  /**
   * Registra un evento personalizzato in Application Insights
   */
  trackEvent(name: string, properties?: { [key: string]: string | number }) {
    if (this.client) {
      this.client.trackEvent({ name, properties: properties as any });
    }
  }

  /**
   * Registra un'eccezione
   */
  trackException(exception: Error, properties?: { [key: string]: string }) {
    if (this.client) {
      this.client.trackException({ exception, properties });
    }
  }

  /**
   * Registra una metrica personalizzata
   */
  trackMetric(name: string, value: number) {
    if (this.client) {
      this.client.trackMetric({ name, value });
    }
  }
}
