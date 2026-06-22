import express from "express";
import jwt from "jsonwebtoken";

import { buscarUsuario } from "../database/usuariosRepository.js";

const router = express.Router();

const CHAVE = process.env.JWT_SECRET || "innovaro-dashboard";

router.post("/login", async (req, res) => {

    try {

        const { usuario, senha } = req.body;

        if (!usuario || !senha) {

            return res.status(400).json({

                sucesso: false,
                mensagem: "Informe usuário e senha."

            });

        }

        const dados = await buscarUsuario(usuario);

        if (!dados) {

            return res.status(401).json({

                sucesso: false,
                mensagem: "Usuário ou senha inválidos."

            });

        }

        if (dados.ativo !== 1) {

            return res.status(403).json({

                sucesso: false,
                mensagem: "Usuário desativado."

            });

        }

        if (dados.senha !== senha) {

            return res.status(401).json({

                sucesso: false,
                mensagem: "Usuário ou senha inválidos."

            });

        }

        const token = jwt.sign(

            {

                id: dados.id,
                usuario: dados.usuario,
                nivel: dados.nivel

            },

            CHAVE,

            {

                expiresIn: "8h"

            }

        );

        res.json({

            sucesso: true,

            token,

            usuario: {

                id: dados.id,
                usuario: dados.usuario,
                nivel: dados.nivel

            }

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            sucesso: false,
            mensagem: erro.message

        });

    }

});

export default router;