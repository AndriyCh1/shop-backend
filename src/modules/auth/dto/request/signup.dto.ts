import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserRole } from '#shared/constants/user-role.enum';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
