import { randomUUID } from "node:crypto";
import { sql } from "./db.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export class PostsDatabase {
  async create(post) {
    if (!post) return;

    let status = {
      code: "",
      message: "",
    };
    const postId = randomUUID();

    const { id, title, content } = post;

    const publishedDate = format(new Date(), "dd/MM/yyyy", {
      locale: ptBR,
    });

    const userData =
      await sql`SELECT nome, profissao, profilepic FROM users WHERE id = ${id}`;

    const { nome, profissao, profilepic } = userData[0];

    await sql`
    INSERT INTO posts
    (id, creatorid, creatorname, title, content, role, date, profilepic)
    VALUES
    (${postId},${id},${nome},${title},${content},${profissao},${publishedDate},${profilepic})`;
  }

  async update(id, post) {
    if (!id) return;

    let status = {
      code,
      message,
    };

    const { title, content } = post;

    if (title || content === "") {
      status.code = 400;
      status.message = "Não é possivel alterar campos vazios, tente novamente!";

      return status;
    }

    const response =
      await sql`update posts set title = ${title}, content = ${content} where id = ${id}`;

    if (response.length > 0) {
      status.message = "Algo deu errado, tente novamente!";
      status.code = 400;
      return { status, response };
    }

    status.message = "Post atualizado com sucesso!";
    status.code = 200;

    return status;
  }

  async delete(id) {
    await sql`delete from posts where id = ${id}`;
  }

  async getPost(postId) {
    if (!postId) return;

    const response = await sql`SELECT * FROM posts WHERE id = ${postId} `;

    return response;
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
