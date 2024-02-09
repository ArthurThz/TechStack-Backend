import { compareSync } from "bcrypt";
import { sql } from "../../db.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
export class AuthService {
  async login(userEmail, password) {
    const getUser =
      await sql`SELECT cpf,email, senha FROM users WHERE email = ${userEmail}`;

    if (!getUser.length > 0) {
      throw new Error("Não foi possivel encontrar um usuário com esse email");
    }

    const { senha, cpf, email } = getUser[0];

    const checkPassword = compareSync(password, senha);

    if (!checkPassword) throw new Error("Senha incorreta");

    const token = sign({ id: cpf, email: email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, email };
  }
}
