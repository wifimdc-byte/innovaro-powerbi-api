import express from "express";

import {
    obterLojas,
    listarLojas
} from "../database/lojasRepository.js";

const router = express.Router();

/*
==========================================
LISTAR LOJAS DO DASHBOARD
==========================================
*/

router.get("/", async (req, res) => {

    try {

        const dados = await listarLojas();

        res.json(dados);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
RANKING DE LOJAS
==========================================
*/

router.get("/ranking", async (req, res) => {

    try {

        const {

            inicio,
            fim,
            loja

        } = req.query;

        const dados = await obterLojas(

            inicio,
            fim,
            loja

        );

        res.json(dados);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;