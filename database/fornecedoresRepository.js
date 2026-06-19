import db from "./database.js";

export function obterFornecedores() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                codigo_fornecedor,

                nome_fornecedor,

                ROUND(SUM(total_item),2) AS faturamento,

                COUNT(DISTINCT codigo_venda) AS pedidos,

                SUM(quantidade) AS itens,

                COUNT(DISTINCT codigo_produto) AS produtos,

                ROUND(
                    SUM(total_item) /
                    COUNT(DISTINCT codigo_venda),
                    2
                ) AS ticket_medio

            FROM vendas

            GROUP BY codigo_fornecedor, nome_fornecedor

            ORDER BY faturamento DESC

        `;

        db.all(sql, [], (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

}