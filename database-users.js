import { sql } from "./db.js";

export class DatabaseUsers {
  async create(user) {
    const { cpf, nome, sobrenome, email, telefone, profissao, senha } = user;

    await sql`INSERT INTO users (cpf, nome, sobrenome, email, telefone, profissao, senha) 
    SELECT ${cpf},${nome},${sobrenome},${email},${telefone},${profissao},${senha} 
    WHERE NOT EXISTS (SELECT cpf FROM users WHERE cpf = ${cpf})`;
  }

  async update(id, user) {
    if (!user) return;

    const { nome, sobrenome, email, telefone, profissao, senha } = user;

    await sql`update users set nome = ${nome}, sobrenome = ${sobrenome}, email = ${email}, telefone = ${telefone}, profissao = ${profissao},
    senha = ${senha} WHERE cpf = ${id} `;
  }

  async list(id) {
    const posts = await sql`SELECT * FROM users WHERE cpf = ${id}`;

    return posts;
  }

  async verifyIfUserExists(id) {
    const user = sql`SELECT cpf FROM users WHERE cpf = ${id}`;

    return user;
  }
}
