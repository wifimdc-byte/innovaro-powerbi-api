import sqlite3 from "sqlite3";
import path from "path";

const caminhoBanco = process.env.DB_PATH
    ? process.env.DB_PATH
    : path.resolve("database", "banco.db");

console.log("📁 Banco:", caminhoBanco);

const db = new sqlite3.Database(caminhoBanco, (err) => {

    if (err) {

        console.error("Erro ao abrir banco:", err.message);

    } else {

        console.log("✅ Banco SQLite conectado.");

    }

});

export default db;