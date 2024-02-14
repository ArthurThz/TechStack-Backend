import { sql } from "./db.js";

sql`
CREATE TABLE Posts (
    id TEXT PRIMARY KEY,
    creatorId TEXT,
    creatorName TEXT,
    title TEXT,
    content TEXT,
    date TEXT
)



`.then(() => console.log("tabela criada!"));
