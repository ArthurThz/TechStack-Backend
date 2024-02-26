import { randomUUID } from "node:crypto";
import { sql } from "./db.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export class PostsDatabase {
  async create(post) {
    const postId = randomUUID();

    const { id, title, content } = post;

    const publishedDate = format(new Date(), "dd/MM/yyyy", {
      locale: ptBR,
    });

    const userData =
      await sql`SELECT nome, sobrenome, profissao FROM users WHERE id = ${id}`;

    const { nome, sobrenome, profissao } = userData[0];

    const creatorName = `${nome} ${sobrenome}`;

    await sql`
    INSERT INTO posts
    (id, creatorId, creatorName, title, content, role, date)
    VALUES
    (${postId},${id},${creatorName},${title},${content},${profissao},${publishedDate})`;
  }

  async update(id, post) {
    const { title, content } = post;

    await sql`update posts set title = ${title}, content = ${content} where id = ${id}`;
  }

  async delete(id) {
    await sql`delete from posts where id = ${id}`;
  }

  async list(search) {
    let posts;

    if (search) {
      posts = await sql`SELECT * FROM posts WHERE title ILIKE ${
        "%" + search + "%"
      } `;
    } else {
      posts = await sql`SELECT * FROM posts`;
    }

    return posts;
  }
}
