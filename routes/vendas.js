import express from "express";
import { consultarVendas } from "../database/vendasRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const filtros = {

            data: req.query.data,
            loja: req.query.loja,
            vendedor: req.query.vendedor,
            produto: req.query.produto,
            fornecedor: req.query.fornecedor,
            secao: req.query.secao,

            pagina: req.query.pagina,
            limite: req.query.limite

        };

        const dados = await consultarVendas(filtros);

        res.json({

            sucesso: true,

            filtros,

            total: dados.length,

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