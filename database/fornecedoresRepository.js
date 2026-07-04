import db from "./database.js";
import { montarFiltroLoja } from "./filtroLoja.js";

export function obterFornecedores(inicio, fim, loja) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);

        const sql = `

            SELECT

                codigo_fornecedor,

                nome_fornecedor,

                ROUND(SUM(total_item - desconto),2) AS faturamento,

                COUNT(DISTINCT numero_venda) AS pedidos,

                SUM(quantidade) AS itens,

                COUNT(DISTINCT codigo_produto) AS produtos,

                ROUND(
                    SUM(total_item - desconto) /
                    COUNT(DISTINCT numero_venda),
                    2
                ) AS ticket_medio

            FROM vendas

            WHERE data_venda BETWEEN ? AND ?

            ${filtro.sql}

            GROUP BY codigo_fornecedor, nome_fornecedor

            ORDER BY faturamento DESC

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