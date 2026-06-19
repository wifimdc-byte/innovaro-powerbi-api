import db from "./database.js";

export function obterSetores() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                codigo_subgrupo,

                nome_subgrupo,

                ROUND(SUM(total_item - desconto), 2) AS faturamento,

                COUNT(DISTINCT codigo_venda) AS pedidos,

                ROUND(SUM(quantidade), 2) AS itens,

                ROUND(

                    SUM(total_item - desconto) /
                    COUNT(DISTINCT codigo_venda),

                    2

                ) AS ticket_medio

            FROM vendas

            GROUP BY

                codigo_subgrupo,
                nome_subgrupo

            ORDER BY faturamento DESC

        `;

        db.all(sql, [], (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

}