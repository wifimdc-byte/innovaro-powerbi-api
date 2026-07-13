import db from "./database.js";
import { montarFiltroLoja } from "./filtroLoja.js";
import { montarFiltroFornecedor } from "./filtroFornecedor.js";

export function obterVendedores(inicio, fim, loja, fornecedor) {

    return new Promise((resolve, reject) => {

        const filtro = montarFiltroLoja(loja);
        const filtroFornecedor = montarFiltroFornecedor(fornecedor);

        const data = new Date(inicio);

        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;

        const sql = `

            SELECT

                v.codigo_vendedor,

                v.nome_vendedor,

                ROUND(SUM(v.total_item - v.desconto),2) AS faturamento,

                COUNT(DISTINCT v.numero_venda) AS pedidos,

                SUM(v.quantidade) AS itens,

                ROUND(

                    SUM(v.total_item - v.desconto) /

                    COUNT(DISTINCT v.numero_venda),

                    2

                ) AS ticket_medio,

                COALESCE(MAX(m.meta),0) AS meta

            FROM vendas v

            LEFT JOIN metas_vendedores m

                ON m.codigo_vendedor = v.codigo_vendedor

                AND m.codigo_loja = ?

                AND m.ano = ?

                AND m.mes = ?

            WHERE

                v.data_venda BETWEEN ? AND ?

                ${filtro.sql}

                ${filtroFornecedor.sql}

            GROUP BY

                v.codigo_vendedor,

                v.nome_vendedor

            ORDER BY

                faturamento DESC

        `;

        db.all(

            sql,

            [

                loja,

                ano,

                mes,

                inicio,

                fim,

                ...filtro.params,

                ...filtroFornecedor.params

            ],

            (err, rows) => {

                if (err)
                    return reject(err);

                resolve(rows.map(v => ({

                    ...v,

                    percentual_meta:

                        Number(v.meta) > 0

                            ? Number(

                                (

                                    Number(v.faturamento) * 100 /

                                    Number(v.meta)

                                ).toFixed(2)

                            )

                            : 0

                })));

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