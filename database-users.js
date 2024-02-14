import { sql } from "./db.js";
import { hashSync } from "bcrypt";
import { randomUUID } from "node:crypto";

export class DatabaseUsers {
  async create(user) {
    const { cpf, nome, sobrenome, email, telefone, profissao, senha } = user;

    const encryptedPassword = hashSync(senha, 10);
    const uuid = randomUUID();
    await sql`INSERT INTO users (cpf,id, nome, sobrenome, email, telefone, profissao, senha) 
    SELECT ${cpf},${uuid},${nome},${sobrenome},${email},${telefone},${profissao},${encryptedPassword} 
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

  async verifyIfUserExists(id) {
    const user = sql`SELECT cpf FROM users WHERE cpf = ${id}`;

    return user;
  }
}
