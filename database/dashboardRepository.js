import db from "./database.js";

export function obterDashboard() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                COUNT(DISTINCT codigo_venda) AS pedidos,

                ROUND(SUM(quantidade), 2) AS itens,

                ROUND(SUM(total_item), 2) AS faturamento,

                ROUND(

                    SUM(total_item) /
                    COUNT(DISTINCT codigo_venda),

                    2

                ) AS ticket_medio

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