import { sql } from "./db.js";
import { hashSync } from "bcrypt";
import { randomUUID } from "node:crypto";
import { checkNullValues } from "./src/hooks/checkNullValues.js";

export class DatabaseUsers {
  async create(user) {
    if (!user) return;

    let status = {
      code: "",
      message: "",
    };

    const uuid = randomUUID();

    const userNullValues = checkNullValues(user);

    if (userNullValues.length > 0) {
      status.code = 400;
      status.message = `Os campos ${userNullValues} estão vazios!`;
      return status;
    }

    const { nome, email, profissao, github, profilepic, senha } = user;

    try {
      const userExists = await this.verifyIfUserExists(email);

      if (userExists.length > 0) {
        status.code = 200;
        status.message = "Este email já está cadastrado!";

        return status;
      }
    } catch (err) {
      return new Error(err);
    }

    const encryptedPassword = hashSync(senha, 10);

    try {
      const query = await sql`INSERT INTO users 
    (id, nome, email, profissao, senha, profilepic, github) 
    SELECT ${uuid},${nome},${email},${profissao},${encryptedPassword},${profilepic}, ${github}  
    WHERE NOT EXISTS (SELECT email FROM users WHERE email = ${email})`;

      if (query.length > 0) {
        status.code = 400;
        status.message =
          "Não foi possivel cadastrar o usuário, tente novamente!";

        return { status, query };
      }

      status.code = 200;
      status.message = "Usuário cadastrado com sucesso!";

      return status;
    } catch (err) {
      return new Error(err);
    }
  }

  async update(id, user) {
    if (!user || !id) return;

    let status = {
      code: "",
      message: "",
    };

    const nullValues = checkNullValues(user);

    if (nullValues.length > 0) {
      status.code = 400;
      status.message = `Os campos ${nullValues} estão vazios!`;
      return status;
    }

    const { nome, email, profissao, senha, github } = user;

    try {
      const updateUserResponse = await sql`
      update users set nome = ${nome},
      email = ${email},
      profissao = ${profissao},
      senha = ${senha},
      github = ${github} WHERE id = ${id} `;

      const updatePostsResponse =
        await sql`UPDATE posts SET creatorname = ${nome} WHERE creatorid = ${id}`;

      if (updateUserResponse.length || updatePostsResponse > 0) {
        status.message = "Algo deu errado, tente novamente!";
        status.code = 400;
        return { status, updateUserResponse };
      }

      status.message = "Usuário atualizado com sucesso!";
      status.code = 200;

      return status;
    } catch (err) {
      return new Error(err);
    }
  }

  async userPosts(id) {
    if (!id) return;

    try {
      const posts = await sql`
      SELECT * FROM posts WHERE creatorId = ${id}`;

      return posts;
    } catch (err) {
      return new Error(err);
    }
  }

  async listUserData(id) {
    if (!id) return;

    try {
      const user =
        await sql`SELECT nome, email, profissao, senha, github FROM users WHERE id = ${id}`;

      if (user.length === 0) {
        return "Não foi possivel encontrar este usuário!";
      }

      return user;
    } catch (err) {
      return new Error(err);
    }
  }

  async getUserProfileData(id) {
    if (!id) return;

    let status = {
      message: "",
      code: "",
    };

    try {
      const userInfo =
        await sql`SELECT nome, profissao, profilepic FROM users WHERE id = ${id}`;

      if (userInfo.length === 0) {
        status.code = 400;
        status.message =
          "Não foi possivel encontrar os dados deste usuário, tente novamente!";

        return status;
      }

      try {
        const userPosts =
          await sql`SELECT * FROM posts WHERE creatorid = ${id}`;

        if (userPosts.length === 0) {
          status.code = 200;
          return { status, userInfo };
        }
        status.code = 200;
        return { status, userInfo, userPosts };
      } catch (err) {
        return new Error(err);
      }
    } catch (err) {
      return new Error(err);
    }
  }

  async verifyIfUserExists(email) {
    if (!email) return;

    const user = sql`SELECT email FROM users WHERE email = ${email}`;

    return user;
  }
}
