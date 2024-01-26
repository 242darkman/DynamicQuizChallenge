import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { UserInterface } from 'src/user/model/user.interface';
import { AuthService } from 'src/auth/service/auth.service';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  /**
   * Crée un nouvel utilisateur.
   *
   * @param {UserInterface} newUser - L'objet utilisateur à créer.
   * @return {Promise<UserInterface>} L'objet utilisateur créé.
   */
  async create(newUser: UserInterface): Promise<UserInterface> {
    try {
      const exists: boolean = await this.checkEmailExists(newUser.email);

      if (exists) {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }

      const newUserPassword = get(newUser, 'password');
      const passwordHash: string = await this.hashPassword(newUserPassword);
      const userToCreate = { ...newUser, password: passwordHash };
      const user = await this.userRepository.save(
        this.userRepository.create(userToCreate),
      );
      const userId = get(user, 'id');
      const createdUser = this.findOne(userId);

      return createdUser;
    } catch (error) {
      throw new HttpException(
        `Email is already in use : ${error}`,
        HttpStatus.CONFLICT,
      );
    }
  }

  /**
   * Connecte un utilisateur avec les identifiants fournis.
   *
   * @param {UserInterface} user - L'objet utilisateur contenant l'email et le mot de passe.
   * @return {Promise<string>} Une promesse qui renvoie une chaîne de caractères représentant le jeton d'authentification.
   */
  async login(user: UserInterface): Promise<string> {
    try {
      const userEmail = get(user, 'email');
      const userPassword = get(user, 'password');
      const foundUser: UserInterface = await this.findByEmail(
        userEmail.toLowerCase(),
      );
      const foundUserPassword = get(foundUser, 'password');

      if (isEmpty(foundUser)) {
        throw new HttpException(
          'Login was not successful, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const matches: boolean = await this.validatePassword(
        userPassword,
        foundUserPassword,
      );

      if (!matches) {
        throw new HttpException(
          'Login was not successful, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const foundUserId = get(foundUser, 'id');
      const payload: UserInterface = await this.findOne(foundUserId);

      return this.authService.generateJwt(payload);
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Vérifie si un email donné existe dans la base de données des utilisateurs.
   *
   * @param {string} email - L'email à vérifier.
   * @return {Promise<boolean>} Un booléen indiquant si l'email existe ou non.
   */
  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user != null;
  }

  /**
   * Cherche et récupère un utilisateur par son identifiant.
   *
   * @param {number} id - L'ID de l'utilisateur à trouver.
   * @return {Promise<UserInterface>} Une promesse qui se résout à l'objet utilisateur.
   */
  private async findOne(id: number): Promise<UserInterface> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Récupère un utilisateur unique en utilisant son ID.
   *
   * @param {number} id - L'ID de l'utilisateur à récupérer.
   * @return {Promise<UserInterface>} Une Promise qui se résout à l'objet utilisateur.
   */
  public getOne(id: number): Promise<UserInterface> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  /**
   * Trouve un utilisateur en fonction de son adresse e-mail.
   *
   * @param {string} email - L'adresse e-mail de l'utilisateur à trouver.
   * @return {Promise<UserInterface>} Une promesse qui se résout avec l'objet utilisateur s'il est trouvé, ou undefined s'il n'est pas trouvé.
   */
  private async findByEmail(email: string): Promise<UserInterface> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * Hache un mot de passe de manière asynchrone.
   *
   * @param {string} password - Le mot de passe à hacher.
   * @return {Promise<string>} - Une promesse qui renvoie le mot de passe haché.
   */
  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  /**
   * Valide un mot de passe par rapport à un hachage de mot de passe stocké.
   *
   * @param {string} password - Le mot de passe à valider.
   * @param {string} storedPasswordHash - Le hachage de mot de passe stocké.
   * @return {Promise<any>} - Une promesse qui se résout avec le résultat de la comparaison des mots de passe.
   */
  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  /**
   * Récupère tous les utilisateurs en fonction des options de pagination fournies.
   *
   * @param {IPaginationOptions} options - Les options de pagination.
   * @return {Promise<Pagination<UserInterface>>} Une promesse qui se résout en un objet Pagination contenant les utilisateurs.
   */
  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<UserInterface>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  /**
   * Trouve tous les utilisateurs par nom d'utilisateur.
   *
   * @param {string} username - Le nom d'utilisateur à rechercher.
   * @return {Promise<UserInterface[]>} Une promesse qui renvoie un tableau d'utilisateurs correspondant au nom d'utilisateur donné.
   */
  async findAllByUsername(username: string): Promise<UserInterface[]> {
    return this.userRepository.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }
}
