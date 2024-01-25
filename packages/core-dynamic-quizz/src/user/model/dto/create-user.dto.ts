import { IsNotEmpty, IsString } from 'class-validator';

import { LoginUserDto } from 'src/user/model/dto/login-user.dto';

/**
 * La classe CreateUserDto est une sous-classe de la classe LoginUserDto et représente l'objet de transfert de données pour la création d'un nouvel utilisateur.
 */
export class CreateUserDto extends LoginUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
