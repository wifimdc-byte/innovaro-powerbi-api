import express from "express";

import { obterDashboard } from "../database/dashboardRepository.js";
import { obterVendasHora } from "../database/horaRepository.js";
import { obterLojas } from "../database/lojasRepository.js";
import { obterSetores } from "../database/setoresRepository.js";
import { obterVendedores } from "../database/vendedoresRepository.js";
import { obterProdutos } from "../database/produtosRepository.js";
import { obterFornecedores } from "../database/fornecedoresRepository.js";
import { obterStatus } from "../database/statusRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const [

            dashboard,

            horas,

            lojas,

            setores,

            vendedores,

            produtos,

            fornecedores,

            status

        ] = await Promise.all([

            obterDashboard(),

            obterVendasHora(),

            obterLojas(),

            obterSetores(),

            obterVendedores(),

            obterProdutos(),

            obterFornecedores(),

            obterStatus()

        ]);

        res.json({

            sucesso: true,

            atualizado: new Date(),

            dashboard,

            horas,

            lojas,

            setores,

            vendedores,

            produtos,

            fornecedores,

            status

        });

    } catch (erro) {

        res.status(500).json({

            sucesso: false,

            erro: erro.message

        });

    }

});

export default router;