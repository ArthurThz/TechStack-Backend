import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-posts.js";
import { DatabaseUsers } from "./database-users.js";
import cors from "@fastify/cors";

const server = fastify();

const database = new DatabasePostgres();

const users = new DatabaseUsers();

server.register(cors, {
  origin: "*",
});

// Posts Routes

server.post("/post", async (request, response) => {
  const { title, content, creator } = request.body;
  await database.create({
    title,
    content,
    creator,
  });

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

  const verifyUser = await users.verifyIfUserExists(cpf);

  if (verifyUser.length > 0) {
    return response.status(401).send({
      errorMessage: "Usuário já está cadastro em nosso sistema",
    });
  }

  await users.create({
    cpf,
    nome,
    sobrenome,
    email,
    telefone,
    profissao,
    senha,
  });

  return response.status(201).send();
});

server.put("/user/:id", async (request, response) => {
  const userId = request.params.id;

  const { nome, sobrenome, email, telefone, profissao, senha } = request.body;

  await users.update(userId, {
    nome,
    sobrenome,
    email,
    telefone,
    profissao,
    senha,
  });

  return response.status(204).send();
});

server.get("/user/:id", async (request, response) => {
  const userId = request.params.id;

  const userData = await users.list(userId);

  return userData;
});

server.listen({
  port: 3333,
});
