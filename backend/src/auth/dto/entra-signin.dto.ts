import { IsNotEmpty, IsString } from 'class-validator';

export class EntraSignInDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
