import db from "./database.js";

export function obterProdutos() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                codigo_produto,

                nome_produto,

                nome_secao,

                nome_grupo,

                nome_subgrupo,

                ROUND(SUM(quantidade), 2) AS quantidade,

                ROUND(SUM(total_item - desconto), 2) AS faturamento,

                COUNT(DISTINCT codigo_venda) AS pedidos,

                ROUND(AVG(unitario), 2) AS preco_medio

            FROM vendas

            GROUP BY codigo_produto, nome_produto

            ORDER BY faturamento DESC

            LIMIT 100

        `;

        db.all(sql, [], (err, rows) => {

            if (err)
                return reject(err);

            resolve(rows);

        });

    });

}