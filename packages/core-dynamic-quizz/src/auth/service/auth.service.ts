import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Génère un jeton JWT pour l'utilisateur donné.
   *
   * @param {UserInterface} user - L'objet utilisateur.
   * @return {Promise<string>} Le jeton JWT généré.
   */
  async generateJwt(user: UserInterface): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  /**
   * Hache un mot de passe en utilisant bcrypt.
   *
   * @param {string} password - Le mot de passe à hacher.
   * @return {Promise<string>} Le mot de passe haché.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare un mot de passe donné avec un hachage de mot de passe stocké.
   *
   * @param {string} password - Le mot de passe à comparer.
   * @param {string} storedPasswordHash - Le hachage de mot de passe stocké avec lequel comparer.
   * @return {Promise<any>} Une promesse qui se résout avec le résultat de la comparaison.
   */
  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  /**
   * Vérifie un JSON Web Token (JWT).
   *
   * @param {string} jwt - Le JWT à vérifier.
   * @return {Promise<any>} Une promesse qui se résout avec le payload vérifié du JWT.
   */
  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
