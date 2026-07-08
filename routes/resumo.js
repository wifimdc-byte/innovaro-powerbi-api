import express from "express";

import { obterDashboard } from "../database/dashboardRepository.js";
import { obterVendasHora } from "../database/horaRepository.js";
import { obterLojas, listarLojas } from "../database/lojasRepository.js";
import { obterSetores } from "../database/setoresRepository.js";
import { obterVendedores } from "../database/vendedoresRepository.js";
import { obterProdutos } from "../database/produtosRepository.js";
import {
    obterFornecedores,
    listarFornecedores
} from "../database/fornecedoresRepository.js";
import { obterStatus } from "../database/statusRepository.js";
import { obterCnpjs } from "../database/cnpjRepository.js";
import { obterProdutosQuantidade } from "../database/produtosQuantidadeRepository.js";
import { obterMetaDashboard } from "../database/metaDashboardRepository.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {

    try {

        const hoje = new Date().toISOString().slice(0, 10);

        const inicio = req.query.inicio || hoje;
        const fim = req.query.fim || hoje;
        let loja = req.query.loja || "TODAS";
        const fornecedor = req.query.fornecedor || "TODOS";

        if (req.usuario.nivel !== "ADMIN") {
            loja = req.usuario.loja;

        }



        const [

            dashboard,
            metaDashboard,
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

            obterDashboard(inicio, fim, loja, fornecedor),
            obterMetaDashboard(

               inicio,
               fim,
               loja

            ),
            obterVendasHora(inicio, fim, loja, fornecedor),
            obterLojas(inicio, fim, loja, fornecedor),
            obterCnpjs(inicio, fim, loja, fornecedor),
            obterSetores(inicio, fim, loja, fornecedor),
            obterVendedores(inicio, fim, loja, fornecedor),
            obterProdutos(inicio, fim, loja, fornecedor),
            obterProdutosQuantidade(inicio, fim, loja, fornecedor),
            obterFornecedores(inicio, fim, loja, fornecedor),
            obterStatus()

        ]);

        const faturamento = Number(dashboard.faturamento || 0);

metaDashboard.faturamento = faturamento;

metaDashboard.atingimento =

    metaDashboard.meta_mensal > 0

        ? Number(

            (

                faturamento /

                metaDashboard.meta_mensal

            ).toFixed(4)

        )

        : 0;

metaDashboard.faltante =

    Math.max(

        0,

        metaDashboard.meta_mensal - faturamento

    );

metaDashboard.meta_esperada = Number(

    (

        metaDashboard.meta_diaria *

        metaDashboard.dias_decorridos

    ).toFixed(2)

);

const diasRestantes =

    Math.max(

        1,

        metaDashboard.dias_uteis -

        metaDashboard.dias_decorridos

    );

metaDashboard.necessario_por_dia = Number(

    (

        metaDashboard.faltante /

        diasRestantes

    ).toFixed(2)

);

        res.json({

            sucesso: true,

            atualizado: new Date(),

            periodo: {
                inicio,
                fim
            },

            dashboard,
            metaDashboard,
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

router.get("/fornecedores", auth, async (req, res) => {

    try {

        const fornecedores = await listarFornecedores();

        res.json(fornecedores);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;