import express from "express";
import dotenv from "dotenv";

import { criarTabelas } from "./database/schema.js";

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

app.use(express.json());

// Cria as tabelas caso não existam
criarTabelas();

// Página inicial
app.get("/", (req, res) => {

    res.json({

        sistema: "Innovaro Power BI API",

        status: "Online",

        versao: "1.0"

    });

});

// Rotas
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


// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("Servidor iniciado!");
    console.log(`Porta: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/vendas`);
    console.log("======================================");
    console.log("");

});