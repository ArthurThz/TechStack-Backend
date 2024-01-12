import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DatabasePostgres {
  async create(post) {
    const postId = randomUUID();

    const unfortmatedDate = new Date();

    const formatedDate = `${unfortmatedDate.getDate()}/${
      unfortmatedDate.getMonth() + 1
    }/${unfortmatedDate.getFullYear()}`;

    const { title, content, creator } = post;

    await sql`INSERT INTO posts (id, title, content, creator, date) VALUES (${postId},${title},${content},${creator},${formatedDate})`;

    console.log(post);
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
