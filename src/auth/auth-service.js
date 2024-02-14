import { compareSync } from "bcrypt";
import { sql } from "../../db.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export class AuthService {
  async login(userEmail, password) {
    const getUser = await sql`
    SELECT cpf,
    id,
    email,
    nome,
    sobrenome,
    profissao,
    senha
    FROM users WHERE email = ${userEmail}`;

    if (!getUser.length > 0) {
      throw new Error("Não foi possivel encontrar um usuário com esse email");
    }

    const { email, id, cpf, senha, nome, sobrenome, profissao } = getUser[0];

    const checkPassword = compareSync(password, senha);

    if (!checkPassword) throw new Error("Senha incorreta");

    const token = sign({ id: cpf, email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const user = {
      id,
      nome,
      sobrenome,
      profissao,
    };

    return { token, user };
  }
}
