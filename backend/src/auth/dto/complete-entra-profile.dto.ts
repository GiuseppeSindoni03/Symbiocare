import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender } from './gender-enum';
import { Type } from 'class-transformer';
import { IsCodiceFiscale } from '../validators/codiceFiscale.validator';

export class CompleteEntraProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsCodiceFiscale({ message: "Il Codice Fiscale non e' valido." })
  cf: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string;

  @IsEnum(Gender, { message: 'Il genere deve essere Uomo, Donna o Altro' })
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  cap: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  medicalOffice: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  orderProvince: string;

  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @IsString()
  @IsNotEmpty()
  orderType: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;
}
