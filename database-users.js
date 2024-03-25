import { sql } from "./db.js";
import { hashSync } from "bcrypt";
import { randomUUID } from "node:crypto";

export class DatabaseUsers {
  async create(user) {
    const { nome, email, profissao, github, profilepic, senha } = user;

    const encryptedPassword = hashSync(senha, 10);
    const uuid = randomUUID();

    await sql`INSERT INTO users 
    (id, nome, email, profissao,senha, profilepic,github ) SELECT 
    ${uuid},${nome},${email},${profissao},${encryptedPassword},${profilepic} , ${github},  
    WHERE NOT EXISTS (SELECT cpf FROM users WHERE cpf = ${cpf})`;
  }

  async update(id, user) {
    if (!user) return;

    const { nome, sobrenome, email, telefone, profissao, senha } = user;

    await sql`
    update users set nome = ${nome},
    sobrenome = ${sobrenome},
    email = ${email},
    telefone = ${telefone},
    profissao = ${profissao},
    senha = ${senha} WHERE cpf = ${id} `;
  }

  async userPosts(id) {
    const posts = await sql`
      SELECT * FROM posts WHERE creatorId = ${id}`;

    return posts;
  }

  async listUserData(id) {
    const user = sql`SELECT cpf, nome, sobrenome, email, telefone, profissao,senha FROM users WHERE id = ${id}`;

    return user;
  }

  async getUserProfileData(id) {
    const userInfo =
      await sql`SELECT nome, profissao, profilepic FROM users WHERE id = ${id}`;
    const userPosts = await sql`SELECT * FROM posts WHERE creatorid = ${id}`;

    return { userInfo, userPosts };
  }

  async verifyIfUserExists(id) {
    const user = sql`SELECT cpf FROM users WHERE cpf = ${id}`;

    return user;
  }
}
