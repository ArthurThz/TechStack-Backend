import { randomUUID } from "node:crypto";

export class DatabaseMemory {
  #posts = new Map();

  create(post) {
    const postId = randomUUID();
    this.#posts.set(postId, post);
  }

  update(id, post) {
    this.#posts.set(id, post);
  }

  delete(id) {
    this.#posts.delete(id);
  }

  list() {
    return Array.from(this.#posts.entries()).map((postArr) => {
      const id = postArr[0];

      const data = postArr[1];

      return {
        id,
        ...data,
      };
    });
  }
}
