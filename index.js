import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { criarTabelas } from "./database/schema.js";
import { sincronizar } from "./services/sincronizador.js";

import vendasRouter from "./routes/vendas.js";
import dashboardRouter from "./routes/dashboard.js";
import horaRouter from "./routes/hora.js";
import setoresRouter from "./routes/setores.js";
import lojasRouter from "./routes/lojas.js";
import vendedoresRouter from "./routes/vendedores.js";
import produtosRouter from "./routes/produtos.js";
import fornecedoresRouter from "./routes/fornecedores.js";
import statusRouter from "./routes/status.js";
import resumoRouter from "./routes/resumo.js";

dotenv.config();

const app = express();

/*
==========================================
MIDDLEWARES
==========================================
*/

app.use(cors());

app.use(express.json());

/*
==========================================
BANCO
==========================================
*/

criarTabelas();

/*
==========================================
PÁGINA INICIAL
==========================================
*/

app.get("/", (req, res) => {

    res.json({

        sistema: "Innovaro Power BI API",

        status: "Online",

        versao: "1.0"

    });

});

/*
==========================================
ROTAS
==========================================
*/

app.use("/vendas", vendasRouter);
app.use("/dashboard", dashboardRouter);
app.use("/vendas-hora", horaRouter);
app.use("/setores", setoresRouter);
app.use("/lojas", lojasRouter);
app.use("/vendedores", vendedoresRouter);
app.use("/produtos", produtosRouter);
app.use("/fornecedores", fornecedoresRouter);
app.use("/status", statusRouter);
app.use("/resumo", resumoRouter);

/*
==========================================
SINCRONIZAÇÃO AUTOMÁTICA
==========================================
*/

let sincronizando = false;

async function executarSincronizacao() {

    if (sincronizando) {

        console.log("⏳ Sincronização já em andamento.");

        return;

    }

    sincronizando = true;

    try {

        console.log("");
        console.log("======================================");
        console.log("🔄 SINCRONIZAÇÃO AUTOMÁTICA");
        console.log("======================================");

        await sincronizar();

        console.log("✅ Sincronização concluída.");

    } catch (erro) {

        console.error("❌ Erro:", erro);

    } finally {

        sincronizando = false;

    }

}

async function loopSincronizacao() {

    // espera 30 segundos após subir a API
    await new Promise(resolve => setTimeout(resolve, 30000));

    while (true) {

        await executarSincronizacao();

        console.log("");
        console.log("⏰ Próxima sincronização em 5 minutos...");
        console.log("");

        await new Promise(resolve =>
            setTimeout(resolve, 5 * 60 * 1000)
        );

    }

}

/*
==========================================
SERVIDOR
==========================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("🚀 Servidor iniciado");
    console.log(`🌐 Porta: ${PORT}`);
    console.log(`🏠 http://localhost:${PORT}`);
    console.log(`📊 http://localhost:${PORT}/resumo`);
    console.log("======================================");
    console.log("");

    loopSincronizacao();

});