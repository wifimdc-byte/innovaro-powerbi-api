import db from "./database.js";
import { montarFiltroLoja } from "./filtroLoja.js";

export function obterProdutosQuantidade(inicio, fim, loja) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);

        const sql = `

            SELECT

                codigo_produto,

                nome_produto,

                ROUND(SUM(quantidade),2) AS quantidade,

                ROUND(SUM(total_item - desconto),2) AS faturamento,

                COUNT(DISTINCT numero_venda) AS pedidos

            FROM vendas

            WHERE data_venda BETWEEN ? AND ?

            ${filtro.sql}

            GROUP BY codigo_produto, nome_produto

            ORDER BY quantidade DESC

            LIMIT 50

        `;

        db.all(

            sql,

            [inicio, fim, ...filtro.params],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

}