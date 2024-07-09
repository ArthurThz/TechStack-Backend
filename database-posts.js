import { randomUUID } from "node:crypto";
import { sql } from "./db.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { dbGetCall } from "./src/hooks/sqlGet.js";

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

    try {
      const userData =
        await sql`SELECT nome, profissao, profilepic FROM users WHERE id = ${id}`;

      if (userData.length < 1) {
        status.code = 400;
        status.message = "Não foi possivel encontrar os dados do usuário!";
        return status;
      }
      const { nome, profissao, profilepic } = userData[0];

      try {
        const createPostResponse = await sql`
      INSERT INTO posts
      (id, creatorid, creatorname, title, content, role, date, profilepic)
      VALUES
      (${postId},${id},${nome},${title},${content},${profissao},${publishedDate},${profilepic})`;

        if (createPostResponse.length > 0) {
          status.code = 400;
          status.message = "Não foi possivel criar a publicação!";
          return status;
        }

        status.code = 201;
        status.message = "Publicação criada com sucesso!";

        return status;
      } catch (error) {
        return new Error(error);
      }
    } catch (error) {
      return new Error(error);
    }
  }

  async update(id, post) {
    if (!id) return;

    let status = {
      code: "",
      message: "",
    };

    const { title, content } = post;

    if (title === "" || content === "") {
      status.code = 400;
      status.message = "Não é possivel alterar campos vazios, tente novamente!";

      return status;
    }

    try {
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
    } catch (error) {
      return new Error(error);
    }
  }

  async delete(id) {
    if (!id) return;
    try {
      const response = await sql`delete from posts where id = ${id}`;
      if (response.length !== 0) {
        return { status: 201, message: "Não possível excluir o post!" };
      }
      return { status: 201, message: "OK" };
    } catch (err) {
      return { status: 500, message: new Error(err) };
    }
  }

  async getPost(postId) {
    if (!postId) return;

    try {
      const response = await sql`SELECT * FROM posts WHERE id = ${postId} `;

      console.log(response);
      if (response.length === 0) {
        return { status: 401, message: "Não foi possivel encontrar o post!" };
      }

      return { status: 201, content: response };
    } catch (err) {
      return new Error(err);
    }
  }
  async list() {
    try {
      const getAllPosts = await sql`SELECT * FROM posts`;
      return getAllPosts;
    } catch (err) {
      return new Error(err);
    }
  }
}
