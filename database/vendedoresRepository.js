import db from "./database.js";
import { montarFiltroLoja } from "./filtroLoja.js";
import { montarFiltroFornecedor } from "./filtroFornecedor.js";

export function obterVendedores(inicio, fim, loja, fornecedor) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);
        const filtroFornecedor = montarFiltroFornecedor(fornecedor);

        const sql = `

            SELECT

                codigo_vendedor,

                nome_vendedor,

                ROUND(SUM(total_item - desconto),2) AS faturamento,

                COUNT(DISTINCT numero_venda) AS pedidos,

                SUM(quantidade) AS itens,

                ROUND(
                    SUM(total_item - desconto) /
                    COUNT(DISTINCT numero_venda),
                    2
                ) AS ticket_medio

            FROM vendas

            WHERE data_venda BETWEEN ? AND ?

            ${filtro.sql}
            ${filtroFornecedor.sql}

            GROUP BY codigo_vendedor, nome_vendedor

            ORDER BY faturamento DESC

        `;

        db.all(

            sql,

            [

                inicio,
                fim,
                ...filtro.params,
                ...filtroFornecedor.params

            ],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

}

export function listarVendedores(loja) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);

        db.all(

            `

            SELECT

                codigo_vendedor,

                MAX(nome_vendedor) AS nome_vendedor

            FROM vendas

            WHERE 1=1

            ${filtro.sql}

            GROUP BY

                codigo_vendedor

            ORDER BY

                nome_vendedor

            `,

            [

                ...filtro.params

            ],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

}