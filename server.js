import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";

const server = fastify();

const database = new DatabaseMemory();
// testing

server.post("/post", (request, response) => {
  const { title, body, image } = request.body;

  database.create({
    title,
    body,
    image,
  });

  return response.status(201).send();
});

server.get("/posts", () => {
  const posts = database.list();

  return posts;
});

server.put("/post/:id", (request, response) => {
  const postId = request.params.id;

  const { title, body, image } = request.body;

  database.update(postId, {
    title,
    body,
    image,
  });

  return response.status(204).send();
});

server.delete("/post/:id", (request, response) => {
  const postId = request.params.id;

  database.delete(postId);

  return response.status(204).send();
});

server.listen({
  port: 3333,
});
