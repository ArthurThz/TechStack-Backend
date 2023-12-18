import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

const database = new DatabasePostgres();

server.post("/post", async (request, response) => {
  const { title, content } = request.body;
  await database.create({
    title,
    content,
  });

  console.log(title, content);
  return response.status(201).send();
});

server.get("/posts", async (request) => {
  const search = request.query.search;

  const posts = await database.list(search);

  return posts;
});

server.put("/post/:id", async (request, response) => {
  const postId = request.params.id;

  const { title, content } = request.body;

  await database.update(postId, {
    title,
    content,
  });

  return response.status(204).send();
});

server.delete("/post/:id", async (request, response) => {
  const postId = request.params.id;

  await database.delete(postId);

  return response.status(204).send();
});

server.listen({
  port: 3333,
});
