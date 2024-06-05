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

// POST ROUTES

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

server.get("/posts/:id", async (request) => {
  const postId = request.params.id;

  const getPosts = await posts.update(postId);

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

// USERS ROUTES

server.post("/users/register", async (request, reply) => {
  const newUser = request.body;

  const dbResponse = await users.create(newUser);

  const { code, message } = dbResponse;

  return reply.status(code).send(message);
});

server.get("/user/profile/:id", async (request, response) => {
  const userId = request.params.id;

  const userData = await users.getUserProfileData(userId);

  return userData;
});

// Update User Data
server.put("/user/:id", async (request, response) => {
  const userId = request.params.id;

  const userData = request.body;

  const databaseCallResponse = await users.update(userId, userData);

  const { code, message } = databaseCallResponse;

  return response.status(code).send(message);
});

server.get("/user/:id", async (request, response) => {
  const userId = request.params.id;

  const userData = await users.listUserData(userId);

  return userData;
});

// User Auth
server.post("/users/login", async (request, response) => {
  const { email, password } = request.body;

  const res = await auth.login(email, password);

  return response.status(201).send(res);
});

// TESTING

server.get("/teste/:id", async (request, reply) => {
  const id = request.params.id;

  const teste = await users.listUserData(id);

  console.log(teste);
});
server.listen({
  port: 3333,
});
