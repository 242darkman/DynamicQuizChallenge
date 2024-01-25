import { IsEmail, IsNotEmpty } from 'class-validator';
/**
 * Définition un objet de transfert de données (DTO) pour l'endpoint de connexion
 */
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
