import express from "express";
import { obterFornecedores } from "../database/fornecedoresRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const dados = await obterFornecedores();

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