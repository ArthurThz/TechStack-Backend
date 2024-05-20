import { sql } from "./db.js";
import { hashSync } from "bcrypt";
import { randomUUID } from "node:crypto";

export class DatabaseUsers {
  async create(user) {
    const { nome, email, profissao, github, profilepic, senha } = user;
    const status = {
      code: "",
      message: "",
    };

    console.log(user);
    const encryptedPassword = hashSync(senha, 10);

    const uuid = randomUUID();

    const userExists = await this.verifyIfUserExists(email);

    if (userExists.length > 0) {
      const response = { code: 200, message: "Este email já está cadastrado!" };
      return response;
    }

    const query = await sql`INSERT INTO users 
    (id, nome, email, profissao, senha, profilepic, github) 
    SELECT ${uuid},${nome},${email},${profissao},${encryptedPassword},${profilepic}, ${github}  
    WHERE NOT EXISTS (SELECT email FROM users WHERE email = ${email})`;

    if (query.length > 0) {
      const response = {
        code: 400,
        message: "Não foi possivel cadastrar o usuário tente novamente!",
      };

      return response;
    }

    const response = { code: 201, message: "Usuário cadastrado com sucesso!" };
    return response;
  }

  async update(id, user) {
    if (!user) return;

    const status = {
      code: "",
      message: "",
    };

    let emptyValues = [];

    for (const key in user) {
      if (user[key] === "") {
        emptyValues.push(key);
      }
    }

    if (emptyValues.length > 0) {
      status.code = 400;
      status.message = `os campos ${emptyValues} estão vazios!`;
      return status;
    }

    const { nome, email, profissao, senha, github } = user;

    const response = await sql`
    update users set nome = ${nome},
    email = ${email},
    profissao = ${profissao},
    senha = ${senha},
    github = ${github} WHERE id = ${id} `;

    if (response.length > 0) {
      status.message = "Algo deu errado, tente novamente!";
      status.code = 400;
      return { status, response };
    }

    status.message = "Usuário atualizado com sucesso!";
    status.code = 200;

    return status;
  }

  async userPosts(id) {
    const posts = await sql`
      SELECT * FROM posts WHERE creatorId = ${id}`;

    return posts;
  }

  async listUserData(id) {
    const user =
      await sql`SELECT nome, email, profissao, senha, github FROM users WHERE id = ${id}`;

    return user;
  }

  async getUserProfileData(id) {
    const userInfo =
      await sql`SELECT nome, profissao, profilepic FROM users WHERE id = ${id}`;
    const userPosts = await sql`SELECT * FROM posts WHERE creatorid = ${id}`;

    return { userInfo, userPosts };
  }

  async verifyIfUserExists(email) {
    const user = sql`SELECT email FROM users WHERE email = ${email}`;

    return user;
  }
}
