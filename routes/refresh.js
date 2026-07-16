import express from "express";




import redis from "../src/config/redis.js";
import { gerarAccessToken } from "../services/tokenService.js";

const router = express.Router();

router.post("/refresh", async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Refresh Token não informado."

            });

        }

        const dados = await redis.get(

            `refresh:${refreshToken}`

        );

        if (!dados) {

            return res.status(401).json({

                sucesso: false,
                mensagem: "Refresh Token inválido ou expirado."

            });

        }

        const usuario = JSON.parse(dados);

        const accessToken = gerarAccessToken(usuario);

        return res.json({

            sucesso: true,

            accessToken

        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({

            sucesso: false,
            mensagem: erro.message

        });

    }

});

export default router;