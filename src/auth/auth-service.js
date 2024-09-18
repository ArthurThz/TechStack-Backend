import { compareSync } from "bcrypt";
import { sql } from "../../db.js";
import jwt from "jsonwebtoken";
import { DatabaseUsers } from "../../database-users.js";
const { sign } = jwt;

export class AuthService {
  async login(userEmail, password) {
    const getUser = await sql`
    SELECT id, email, senha FROM users WHERE email = ${userEmail}`;

    if (!getUser.length > 0) {
      return {
        error: {
          status: 404,
          message:
            "Não foi possivel encontrar este usuário, verifique os dados!",
        },
      };
    }

    const { id, email, senha } = getUser[0];

    const checkPassword = compareSync(password, senha);

    if (!checkPassword) {
      return {
        error: {
          status: 404,
          message: "Senha incorreta, verifique e tente novamente!",
        },
      };
    }

    const token = sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const user = {
      id,
    };

    return { token, user };
  }

  verifyToken(token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = new DatabaseUsers();

    const verifyedUser = user.verifyIfUserExists(decodedToken.id);

    return verifyedUser;
  }
}
