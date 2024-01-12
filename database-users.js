import { sql } from "./db.js";

export class DatabaseUsers {
  async create(user) {
    const { cpf, nome, sobrenome, email, telefone, profissao, senha } = user;

    await sql`INSERT INTO users (cpf, nome, sobrenome, email, telefone, profissao, senha) 
    SELECT ${cpf},${nome},${sobrenome},${email},${telefone},${profissao},${senha} 
    WHERE NOT EXISTS (SELECT cpf FROM users WHERE cpf = ${cpf})`;
  }

  async update(id, post) {}

  async list(search) {}
}
