import express from "express";
import { obterStatus } from "../database/statusRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const dados = await obterStatus();

        res.json({

            sucesso: true,

            api: "ONLINE",

            horario: new Date(),

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