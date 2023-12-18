import { sql } from "./db.js";

sql`
CREATE TABLE Posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    date TEXT
);

`.then(() => console.log("tabela criada!"));
