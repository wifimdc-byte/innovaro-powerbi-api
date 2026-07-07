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



console.time("Dashboard");
const dashboard = await obterDashboard(inicio, fim, loja, fornecedor);
console.timeEnd("Dashboard");

console.time("Horas");
const horas = await obterVendasHora(inicio, fim, loja, fornecedor);
console.timeEnd("Horas");

console.time("Lojas");
const lojas = await obterLojas(inicio, fim, loja, fornecedor);
console.timeEnd("Lojas");

console.time("CNPJs");
const cnpjs = await obterCnpjs(inicio, fim, loja, fornecedor);
console.timeEnd("CNPJs");

console.time("Setores");
const setores = await obterSetores(inicio, fim, loja, fornecedor);
console.timeEnd("Setores");

console.time("Vendedores");
const vendedores = await obterVendedores(inicio, fim, loja, fornecedor);
console.timeEnd("Vendedores");

console.time("Produtos");
const produtos = await obterProdutos(inicio, fim, loja, fornecedor);
console.timeEnd("Produtos");

console.time("ProdutosQuantidade");
const produtosQuantidade = await obterProdutosQuantidade(inicio, fim, loja, fornecedor);
console.timeEnd("ProdutosQuantidade");

console.time("Fornecedores");
const fornecedores = await obterFornecedores(inicio, fim, loja, fornecedor);
console.timeEnd("Fornecedores");

console.time("Status");
const status = await obterStatus();
console.timeEnd("Status");

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