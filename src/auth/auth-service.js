import { compareSync } from "bcrypt";
import { sql } from "../../db.js";

export class AuthService {
  async login(email, password) {
    const getUser =
      await sql`SELECT email, senha FROM users WHERE email = ${email}`;

    if (!getUser.length > 0) {
      throw new Error("Não foi possivel encontrar um usuário com esse email");
    }

    const { senha } = getUser[0];

    const checkPassword = compareSync(password, senha);

    if (!checkPassword) {
      throw new Error("Senha incorreta");
    }
  }
}
