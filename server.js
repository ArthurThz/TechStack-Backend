import { fastify } from "fastify";
import { PostsDatabase } from "./database-posts.js";
import { DatabaseUsers } from "./database-users.js";
import { AuthService } from "./src/auth/auth-service.js";
import cors from "@fastify/cors";

const server = fastify();

const posts = new PostsDatabase();

const users = new DatabaseUsers();

const auth = new AuthService();

server.register(cors, {
  origin: "*",
});

// Posts Routes

server.post("/post", async (request, response) => {
  const newPost = request.body;
  await posts.create(newPost);

  return response.status(201).send();
});

server.get("/posts/general", async (request) => {
  const search = request.query.search;

  const getPosts = await posts.list(search);

  return getPosts;
});

server.get("/posts/user/:id", async (request, response) => {
  const userId = request.params.id;

  const posts = await users.userPosts(userId);

  return posts;
});

server.put("/post/:id", async (request, response) => {
  const postId = request.params.id;

  const post = request.body;

  await posts.update(postId, post);

  return response.status(204).send();
});

server.delete("/post/:id", async (request, response) => {
  const postId = request.params.id;

  await posts.delete(postId);

  return response.status(204).send();
});

// Users Routes

server.post("/users/register", async (request, response) => {
  const { cpf } = request.body;

  const verifyUser = await users.verifyIfUserExists(cpf);

  if (verifyUser.length > 0) {
    return response.status(401).send({
      errorMessage: "Usuário já está cadastro em nosso sistema",
    });
  }

  const newUser = request.body;

  await users.create(newUser);

  return response.status(201).send();
});
server.post("/users/login", async (request, response) => {
  const { email, password } = request.body;

  const res = await auth.login(email, password);

  return response.status(201).send(res);
});

server.get("/user/profile/:id", async (request, response) => {
  const userId = request.params.id;

  const userData = await users.getUserProfileData(userId);
  return userData;
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

  const userData = await users.listUserData(userId);

  return userData;
});

// Criar rota de auth do usuario com jwt e busca de credenciais de usuário para login

server.listen({
  port: 3333,
});
