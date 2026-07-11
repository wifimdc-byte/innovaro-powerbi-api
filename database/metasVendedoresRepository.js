import db from "./database.js";

// =====================================================
// LISTAR METAS DOS VENDEDORES
// =====================================================

export function listarMetasVendedores(ano, mes, loja) {

    return new Promise((resolve, reject) => {

        db.all(

            `

            SELECT

                v.codigo_vendedor,

                MAX(v.nome_vendedor) AS nome_vendedor,

                ? AS ano,

                ? AS mes,

                ? AS codigo_loja,

                COALESCE(m.meta,0) AS meta

            FROM vendas v

            LEFT JOIN metas_vendedores m

                ON m.codigo_vendedor = v.codigo_vendedor

                AND m.codigo_loja = ?

                AND m.ano = ?

                AND m.mes = ?

            WHERE

                v.codigo_loja = ?

            GROUP BY

                v.codigo_vendedor

            ORDER BY

                nome_vendedor

            `,

            [

                ano,
                mes,
                loja,

                loja,
                ano,
                mes,

                loja

            ],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

}

// =====================================================
// SALVAR META
// =====================================================

export function salvarMetaVendedor(meta) {

    return new Promise((resolve, reject) => {

        db.run(

            `

            INSERT INTO metas_vendedores(

                ano,
                mes,
                codigo_loja,
                codigo_vendedor,
                nome_vendedor,
                meta

            )

            VALUES(?,?,?,?,?,?)

            ON CONFLICT(

                ano,
                mes,
                codigo_loja,
                codigo_vendedor

            )

            DO UPDATE SET

                nome_vendedor=excluded.nome_vendedor,

                meta=excluded.meta

            `,

            [

                meta.ano,

                meta.mes,

                meta.codigo_loja,

                meta.codigo_vendedor,

                meta.nome_vendedor,

                meta.meta

            ],

            function(err){

                if(err)
                    return reject(err);

                resolve();

            }

        );

    });

}