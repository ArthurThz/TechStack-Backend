import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-posts.js";
import { DatabaseUsers } from "./database-users.js";

const server = fastify();

const database = new DatabasePostgres();

const users = new DatabaseUsers();

// Posts Routes

server.post("/post", async (request, response) => {
  const { title, content, creator } = request.body;
  await database.create({
    title,
    content,
    creator,
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

// Users Routes

server.post("/user", async (request, response) => {
  const { cpf, nome, sobrenome, email, telefone, profissao, senha } =
    request.body;

  await users.create({
    cpf,
    nome,
    sobrenome,
    email,
    telefone,
    profissao,
    senha,
  });

  console.log(cpf);

  return response.status(201).send();
});

server.listen({
  port: 3333,
});
