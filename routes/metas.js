import express from "express";
import auth from "../middleware/auth.js";

import {
    listarMetas,
    salvarMeta
} from "../database/metasRepository.js";

const router = express.Router();

// ======================================================
// LISTAR METAS
// ======================================================

router.get("/", auth, async (req, res) => {

    try {

        const hoje = new Date();

        const ano = Number(req.query.ano || hoje.getFullYear());
        const mes = Number(req.query.mes || (hoje.getMonth() + 1));

        const metas = await listarMetas(ano, mes);

        res.json(metas);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: erro.message

        });

    }

});

// ======================================================
// SALVAR META
// ======================================================

router.post("/", auth, async (req, res) => {

    try {

        await salvarMeta(req.body);

        res.json({

            sucesso: true

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;