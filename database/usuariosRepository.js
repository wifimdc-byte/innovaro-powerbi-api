import db from "./database.js";

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