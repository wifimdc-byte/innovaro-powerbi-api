import db from "./database.js";
import { montarFiltroLoja } from "./filtroLoja.js";

export function obterProdutos(inicio, fim, loja) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);

        const sql = `

            SELECT

                codigo_produto,

                nome_produto,

                nome_secao,

                nome_grupo,

                nome_subgrupo,

                ROUND(SUM(quantidade),2) AS quantidade,

                ROUND(SUM(total_item - desconto),2) AS faturamento,

                COUNT(DISTINCT numero_venda) AS pedidos,

                ROUND(AVG(unitario),2) AS preco_medio

            FROM vendas

            WHERE data_venda BETWEEN ? AND ?

            ${filtro.sql}

            GROUP BY codigo_produto, nome_produto

            ORDER BY faturamento DESC

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