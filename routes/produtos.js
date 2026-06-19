import express from "express";
import { obterProdutos } from "../database/produtosRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const dados = await obterProdutos();

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