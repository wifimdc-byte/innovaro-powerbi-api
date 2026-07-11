import express from "express";
import auth from "../middleware/auth.js";

import {
    listarVendedores
} from "../database/vendedoresRepository.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {

    try {

        let loja = req.query.loja || "TODAS";

        if (req.usuario.nivel !== "ADMIN") {

            loja = req.usuario.loja;

        }

        const dados = await listarVendedores(loja);

        res.json(dados);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;