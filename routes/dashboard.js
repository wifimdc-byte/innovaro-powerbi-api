import express from "express";
import { obterDashboard } from "../database/dashboardRepository.js";

console.log("✅ Arquivo dashboard.js carregado");

const router = express.Router();

router.get("/", async (req, res) => {

    console.log("📊 Requisição recebida em /dashboard");

    try {

        const dados = await obterDashboard();

        return res.status(200).json({
            sucesso: true,
            dados
        });

    } catch (erro) {

        console.error("Erro no dashboard:", erro);

        return res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

export default router;