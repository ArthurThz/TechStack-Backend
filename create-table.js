import { sql } from "./db.js";

sql`
CREATE TABLE Users (
    cpf TEXT PRIMARY KEY,
    nome TEXT,
    sobrenome TEXT,
    email TEXT,
    telefone TEXT,
    profissao TEXT,
    senha TEXT
)



`.then(() => console.log("tabela criada!"));
