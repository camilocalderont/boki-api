import { IsString, IsOptional, Length, IsEmail, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Número de identificación del cliente (DNI, cédula, etc.)',
    example: '12345678A',
    type: String,
    minLength: 5,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @IsString({ message: 'El número de identificación debe ser una cadena de texto' })
  @Length(5, 50, { message: 'El número de identificación debe tener entre 5 y 50 caracteres' })
  VcIdentificationNumber: string;

  @ApiProperty({
    description: 'Número de teléfono del cliente',
    example: '+573001234567',
    required: false,
    type: String,
    minLength: 5,
    maxLength: 20
  })
  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto' })
  @Length(5, 20, { message: 'El número de teléfono debe tener entre 5 y 20 caracteres' })
  @Matches(/^[+]?[0-9\s-()]+$/, { message: 'Formato de teléfono inválido. Use solo números, espacios, guiones, paréntesis y el símbolo +' })
  VcPhone?: string;

  @ApiProperty({
    description: 'Apodo o nombre preferido del cliente',
    example: 'Johnny',
    required: false,
    type: String,
    minLength: 1,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El apodo debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El apodo debe tener entre 1 y 50 caracteres' })
  vcNickName?: string;

  @ApiProperty({
    description: 'Primer nombre del cliente',
    example: 'Juan',
    type: String,
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'El primer nombre es requerido' })
  @IsString({ message: 'El primer nombre debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El primer nombre debe tener entre 1 y 50 caracteres' })
  VcFirstName: string;

  @ApiProperty({
    description: 'Segundo nombre del cliente (opcional)',
    example: 'Carlos',
    required: false,
    type: String,
    minLength: 1,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El segundo nombre debe tener entre 1 y 50 caracteres' })
  VcSecondName?: string;

  @ApiProperty({
    description: 'Primer apellido del cliente',
    example: 'Pérez',
    type: String,
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'El primer apellido es requerido' })
  @IsString({ message: 'El primer apellido debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El primer apellido debe tener entre 1 y 50 caracteres' })
  VcFirstLastName: string;

  @ApiProperty({
    description: 'Segundo apellido del cliente (opcional)',
    example: 'Gómez',
    required: false,
    type: String,
    minLength: 1,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El segundo apellido debe ser una cadena de texto' })
  @Length(1, 50, { message: 'El segundo apellido debe tener entre 1 y 50 caracteres' })
  VcSecondLastName?: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente (único)',
    example: 'juan.perez@example.com',
    type: String,
    minLength: 5,
    maxLength: 100
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @Length(5, 100, { message: 'El correo electrónico debe tener entre 5 y 100 caracteres' })
  VcEmail: string;

  @ApiProperty({
    description: 'Contraseña del cliente',
    example: 'Password123!',
    type: String,
    minLength: 6,
    maxLength: 255,
    writeOnly: true
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(6, 255, { message: 'La contraseña debe tener entre 6 y 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
  })
  VcPassword: string;
}
