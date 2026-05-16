import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { ServiceBusService } from './service-bus.service';
import { Reservation } from '../reservation/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  providers: [NotificationService, ServiceBusService],
  exports: [NotificationService],
})
export class NotificationModule {}
