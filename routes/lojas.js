import express from "express";
import { obterLojas } from "../database/lojasRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const dados = await obterLojas();

        res.json({
            sucesso: true,
            dados
        });

    } catch (erro) {

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

export default router;