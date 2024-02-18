/**
 * Interface utilisateur qui définit les propriétés d'un utilisateur, telles que l'id, le nom d'utilisateur, l'e-mail et le mot de passe. L'interface inclut également des propriétés optionnelles indiquées par le symbole "?".
 */
export interface UserInterface {
  id?: string;
  username?: string;
  email: string;
  password?: string;
}
