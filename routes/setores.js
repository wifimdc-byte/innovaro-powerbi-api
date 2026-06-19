import express from "express";
import { obterSetores } from "../database/setoresRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const dados = await obterSetores();

        res.json({

            sucesso:true,

            dados

        });

    }

    catch(erro){

        res.status(500).json({

            sucesso:false,

            erro:erro.message

        });

    }

});

export default router;