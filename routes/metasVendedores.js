import express from "express";

import auth from "../middleware/auth.js";

import {

    listarMetasVendedores,

    salvarMetaVendedor

} from "../database/metasVendedoresRepository.js";

const router = express.Router();

// ======================================================
// LISTAR
// ======================================================

router.get("/", auth, async (req, res) => {

    try {

        const hoje = new Date();

        const ano = Number(req.query.ano || hoje.getFullYear());

        const mes = Number(req.query.mes || (hoje.getMonth() + 1));

        const loja = req.query.loja;

        if (!loja) {

            return res.status(400).json({

                erro: "Informe a loja."

            });

        }

        const dados = await listarMetasVendedores(

            ano,

            mes,

            loja

        );

        res.json(dados);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: erro.message

        });

    }

});

// ======================================================
// SALVAR
// ======================================================

router.post("/", auth, async (req, res) => {

    try {

        const lista = req.body;

        for (const meta of lista) {

            await salvarMetaVendedor(meta);

        }

        res.json({

            sucesso: true

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;