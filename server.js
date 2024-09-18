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

const preHandler = {
  preHandler: (request, response, done) => {
    const token = request.headers.authorization?.replace(/^Bearer /, "");

    if (!token) {
      response
        .code(401)
        .send({ message: "Unauthorized: user is not authenticated" });
    }

    const user = auth.verifyToken(token);

    if (!user) {
      response.code(401).send({ message: "Unauthorized: User not founded!" });
    }

    request.user = user;
    done();
  },
};
// POST ROUTES

server.post("/post", async (request, response) => {
  const newPost = request.body;

  const createPostResponse = await posts.create(newPost);

  const { code, message } = createPostResponse;

  return response.status(code).send(message);
});

server.get("/posts/general", preHandler, async (request) => {
  const search = request.query.search;

  const getPosts = await posts.list(search);

  return getPosts;
});

server.get("/posts/:id", async (request, response) => {
  const postId = request.params.id;

  const getPosts = await posts.getPost(postId);

  const { status, content } = getPosts;

  return response.status(status).send(content);
});

server.get("/posts/user/:id", async (request, response) => {
  const userId = request.params.id;

  const posts = await users.userPosts(userId);

  return posts;
});

server.put("/post/:id", async (request, response) => {
  const postId = request.params.id;

  const post = request.body;

  const updatePostResponse = await posts.update(postId, post);

  const { code, message } = updatePostResponse;

  return response.status(code).send(message);
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

server.get("/user/profile/:id", preHandler, async (request, response) => {
  const userId = request.params.id;

  const userData = await users.getUserProfileData(userId);

  return userData;
});

// Update User Data
server.put("/user/:id", preHandler, async (request, response) => {
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
