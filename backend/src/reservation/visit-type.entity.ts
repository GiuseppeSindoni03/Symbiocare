import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VisitTypeEnum } from './types/visit-type.enum';

@Entity()
export class VisitType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: VisitTypeEnum.CONTROL})
  name: string;

  @Column()
  durationMinutes: number;
}
