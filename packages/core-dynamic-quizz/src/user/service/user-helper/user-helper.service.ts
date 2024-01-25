import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
  /**
   * Convertit un objet `createUserDto` en un objet `UserInterface`.
   *
   * @param {CreateUserDto} createUserDto - L'objet de transfert de données contenant les informations sur l'utilisateur à créer.
   * @return {UserInterface} L'objet utilisateur avec les données fournies.
   */
  createUserDtoToEntity(createUserDto: CreateUserDto): UserInterface {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    };
  }

  /**
   * Convertit un objet LoginUserDto en un objet UserInterface.
   *
   * @param {LoginUserDto} loginUserDto - L'objet LoginUserDto à convertir.
   * @return {UserInterface} L'objet UserInterface converti.
   */
  loginUserDtoToEntity(loginUserDto: LoginUserDto): UserInterface {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };
  }
}
