import db from "./database.js";

export function obterDashboard() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                COUNT(DISTINCT codigo_venda) AS pedidos,

                ROUND(SUM(quantidade), 2) AS itens,

                ROUND(SUM(total_item - desconto), 2) AS faturamento,

                ROUND(
                    SUM(total_item - desconto) /
                    COUNT(DISTINCT codigo_venda),
                    2
                ) AS ticket_medio,

                ROUND(SUM(desconto), 2) AS desconto_total,

                ROUND(MAX(total_item - desconto), 2) AS maior_venda

            FROM vendas

        `;

        db.get(sql, [], (err, row) => {

            if (err) {
                return reject(err);
            }

            resolve(row);

        });

    });

}