import db from "./database.js";

export function obterVendasHora() {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT

                hora_venda,

                ROUND(SUM(total_item),2) AS faturamento,

                COUNT(DISTINCT codigo_venda) AS pedidos,

                SUM(quantidade) AS itens

            FROM vendas

            GROUP BY hora_venda

            ORDER BY hora_venda
        `;

        db.all(sql, [], (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

}