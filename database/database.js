import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const bancoOriginal = path.resolve("database", "banco.db");

const caminhoBanco = process.env.DB_PATH
    ? process.env.DB_PATH
    : bancoOriginal;

// Se estiver usando o Persistent Disk e o banco ainda não existir,
// copia o banco inicial apenas uma vez.
if (process.env.DB_PATH) {

    const pasta = path.dirname(caminhoBanco);

    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }

    if (!fs.existsSync(caminhoBanco)) {

        console.log("📦 Primeiro deploy detectado.");

        if (fs.existsSync(bancoOriginal)) {

            fs.copyFileSync(bancoOriginal, caminhoBanco);

            console.log("✅ Banco inicial copiado para o Persistent Disk.");

        } else {

            console.log("⚠ Banco inicial não encontrado.");

        }

    } else {

        console.log("✅ Banco persistente encontrado.");

    }

}

console.log("📁 Banco:", caminhoBanco);

const db = new sqlite3.Database(caminhoBanco, (err) => {

    if (err) {

        console.error("Erro ao abrir banco:", err.message);

    } else {

        console.log("✅ Banco SQLite conectado.");

    }

});

export default db;