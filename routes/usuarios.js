import express from "express";

import {

    listarUsuarios,
    criarUsuario,
    alterarSenha,
    alterarStatus,
    excluirUsuario,
    listarLojasUsuario,
    salvarLojasUsuario


} from "../database/usuariosRepository.js";

const router = express.Router();

/*
==========================================
LISTAR
==========================================
*/

router.get("/", async (req, res) => {

    try {

        const usuarios = await listarUsuarios();

        res.json(usuarios);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
CRIAR
==========================================
*/

router.post("/", async (req, res) => {

    try {

        const {

            usuario,
            senha,
            nivel

        } = req.body;

        const id = await criarUsuario(

            usuario,

            senha,

            nivel

        );

        res.json({

            sucesso: true,

            id

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
ALTERAR SENHA
==========================================
*/

router.put("/:id/senha", async (req, res) => {

    try {

        await alterarSenha(

            req.params.id,

            req.body.senha

        );

        res.json({

            sucesso: true

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
ATIVAR / DESATIVAR
==========================================
*/

router.put("/:id/status", async (req, res) => {

    try {

        await alterarStatus(

            req.params.id,

            req.body.ativo

        );

        res.json({

            sucesso: true

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
EXCLUIR
==========================================
*/

router.delete("/:id", async (req, res) => {

    try {

        await excluirUsuario(

            req.params.id

        );

        res.json({

            sucesso: true

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
LISTAR LOJAS DO USUÁRIO
==========================================
*/

router.get("/:id/lojas", async (req, res) => {

    try {

        const lojas = await listarLojasUsuario(

            req.params.id

        );

        res.json(lojas);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

/*
==========================================
SALVAR LOJAS DO USUÁRIO
==========================================
*/

router.put("/:id/lojas", async (req, res) => {

    try {

        const { lojas } = req.body;

        await salvarLojasUsuario(

            req.params.id,

            lojas

        );

        res.json({

            sucesso: true

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

});

export default router;