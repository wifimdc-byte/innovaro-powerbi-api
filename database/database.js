import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const bancoOriginal = path.resolve("database", "banco.db");

const caminhoBanco = process.env.DB_PATH
    ? process.env.DB_PATH
    : bancoOriginal;

// ======================================================
// PRIMEIRO DEPLOY
// ======================================================

if (process.env.DB_PATH) {

    const pasta = path.dirname(caminhoBanco);

    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }

    let copiarBanco = false;

    if (!fs.existsSync(caminhoBanco)) {

        copiarBanco = true;

    } else {

        try {

            const stat = fs.statSync(caminhoBanco);

            if (stat.size < 50000) {

                copiarBanco = true;

            }

        } catch {

            copiarBanco = true;

        }

    }

    if (copiarBanco) {

        console.log("📦 Copiando banco inicial...");

        if (fs.existsSync(bancoOriginal)) {

            fs.copyFileSync(bancoOriginal, caminhoBanco);

            console.log("✅ Banco copiado para o Persistent Disk.");

        } else {

            console.log("❌ Banco inicial não encontrado.");

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

        // ======================================================
        // OTIMIZAÇÕES SQLITE
        // ======================================================

        db.serialize(() => {

            db.run("PRAGMA journal_mode = WAL;");
            db.run("PRAGMA synchronous = NORMAL;");
            db.run("PRAGMA temp_store = MEMORY;");
            db.run("PRAGMA cache_size = -50000;");
            db.run("PRAGMA mmap_size = 268435456;");
            db.run("PRAGMA busy_timeout = 30000;");
            db.run("PRAGMA foreign_keys = ON;");
            db.run("PRAGMA optimize;");

        });

        console.log("🚀 SQLite otimizado.");

    }

});

export default db;