import db from "./database.js";

export function obterLojas() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                codigo_loja,

                nome_loja,

                ROUND(SUM(total_item - desconto), 2) AS faturamento,

                COUNT(DISTINCT codigo_venda) AS pedidos,

                SUM(quantidade) AS itens,

                ROUND(
                    SUM(total_item - desconto) /
                    COUNT(DISTINCT codigo_venda),
                    2
                ) AS ticket_medio

            FROM vendas

            GROUP BY codigo_loja, nome_loja

            ORDER BY faturamento DESC

        `;

        db.all(sql, [], (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

}