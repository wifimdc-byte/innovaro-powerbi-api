import express from "express";

import { obterDashboard } from "../database/dashboardRepository.js";
import { obterVendasHora } from "../database/horaRepository.js";
import { obterLojas, listarLojas } from "../database/lojasRepository.js";
import { obterSetores } from "../database/setoresRepository.js";
import { obterVendedores } from "../database/vendedoresRepository.js";
import { obterProdutos } from "../database/produtosRepository.js";
import { obterFornecedores } from "../database/fornecedoresRepository.js";
import { obterStatus } from "../database/statusRepository.js";
import { obterCnpjs } from "../database/cnpjRepository.js";
import { obterProdutosQuantidade } from "../database/produtosQuantidadeRepository.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {

    try {

        const hoje = new Date().toISOString().slice(0, 10);

        const inicio = req.query.inicio || hoje;
        const fim = req.query.fim || hoje;
        let loja = req.query.loja || "TODAS";

        if (req.usuario.nivel !== "ADMIN") {
            loja = req.usuario.loja;

        }



        const [

            dashboard,
            horas,
            lojas,
            cnpjs,
            setores,
            vendedores,
            produtos,
            produtosQuantidade,
            fornecedores,
            status

        ] = await Promise.all([

            obterDashboard(inicio, fim, loja),
            obterVendasHora(inicio, fim, loja),
            obterLojas(inicio, fim, loja),
            obterCnpjs(inicio, fim, loja),
            obterSetores(inicio, fim, loja),
            obterVendedores(inicio, fim, loja),
            obterProdutos(inicio, fim, loja),
            obterProdutosQuantidade(inicio, fim, loja),
            obterFornecedores(inicio, fim, loja),
            obterStatus()

        ]);

        res.json({

            sucesso: true,

            atualizado: new Date(),

            periodo: {
                inicio,
                fim
            },

            dashboard,
            horas,
            lojas,
            cnpjs,
            setores,
            vendedores,
            produtos,
            produtosQuantidade,
            fornecedores,
            status

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false,
            erro: erro.message

        });

    }

});

router.get("/lojas", auth, async (req, res) => {

    try {

        const lojas = await listarLojas();

        res.json(lojas);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;