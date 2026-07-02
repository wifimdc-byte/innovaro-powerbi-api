import db from "./database.js";

// ===========================================
// BUSCAR USUÁRIO
// ===========================================

export function buscarUsuario(usuario) {

    return new Promise((resolve, reject) => {

        db.get(

            `
            SELECT
                id,
                usuario,
                senha,
                nivel,
                ativo
            FROM usuarios
            WHERE usuario = ?
            `,

            [usuario],

            (err, row) => {

                if (err)
                    return reject(err);

                resolve(row);

            }

        );

    });

}

// ===========================================
// LISTAR USUÁRIOS
// ===========================================

export function listarUsuarios() {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT
                id,
                usuario,
                nivel,
                ativo
            FROM usuarios
            ORDER BY usuario
            `,

            [],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

}

// ===========================================
// CRIAR USUÁRIO
// ===========================================

export function criarUsuario(usuario, senha, nivel = "CONSULTA") {

    return new Promise((resolve, reject) => {

        db.run(

            `
            INSERT INTO usuarios
            (
                usuario,
                senha,
                nivel
            )
            VALUES (?,?,?)
            `,

            [

                usuario,
                senha,
                nivel

            ],

            function (err) {

                if (err)
                    return reject(err);

                resolve(this.lastID);

            }

        );

    });

}

// ===========================================
// ALTERAR SENHA
// ===========================================

export function alterarSenha(id, senha) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE usuarios
            SET senha = ?
            WHERE id = ?
            `,

            [

                senha,
                id

            ],

            function (err) {

                if (err)
                    return reject(err);

                resolve(this.changes);

            }

        );

    });

}

// ===========================================
// ATIVAR / DESATIVAR
// ===========================================

export function alterarStatus(id, ativo) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE usuarios
            SET ativo = ?
            WHERE id = ?
            `,

            [

                ativo,
                id

            ],

            function (err) {

                if (err)
                    return reject(err);

                resolve(this.changes);

            }

        );

    });

}

// ===========================================
// EXCLUIR USUÁRIO
// ===========================================

export function excluirUsuario(id) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            DELETE FROM usuarios
            WHERE id = ?
            `,

            [id],

            function (err) {

                if (err)
                    return reject(err);

                resolve(this.changes);

            }

        );

    });

}

// ===========================================
// LISTAR LOJAS DO USUÁRIO
// ===========================================

export function listarLojasUsuario(usuarioId) {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT loja_id
            FROM usuarios_lojas
            WHERE usuario_id = ?
            ORDER BY loja_id
            `,

            [usuarioId],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows.map(x => x.loja_id));

            }

        );

    });

}

// ===========================================
// REMOVER TODAS AS LOJAS DO USUÁRIO
// ===========================================

export function removerLojasUsuario(usuarioId) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            DELETE FROM usuarios_lojas
            WHERE usuario_id = ?
            `,

            [usuarioId],

            function(err){

                if(err)
                    return reject(err);

                resolve();

            }

        );

    });

}

// ===========================================
// SALVAR LOJAS DO USUÁRIO
// ===========================================

export async function salvarLojasUsuario(usuarioId, lojas) {

    await removerLojasUsuario(usuarioId);

    if(!lojas || lojas.length === 0)
        return;

    for(const loja of lojas){

        await new Promise((resolve, reject)=>{

            db.run(

                `
                INSERT INTO usuarios_lojas
                (
                    usuario_id,
                    loja_id
                )
                VALUES (?,?)
                `,

                [

                    usuarioId,

                    loja

                ],

                function(err){

                    if(err)
                        return reject(err);

                    resolve();

                }

            );

        });

    }

}