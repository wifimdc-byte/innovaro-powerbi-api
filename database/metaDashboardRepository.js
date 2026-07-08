import db from "./database.js";

function calcularDiasUteis(ano, mes, abreSabado, abreDomingo, feriados) {

    const ultimoDia = new Date(ano, mes, 0).getDate();

    let dias = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const data = new Date(ano, mes - 1, dia);

        const semana = data.getDay();

        // Domingo
        if (semana === 0 && !abreDomingo)
            continue;

        // Sábado
        if (semana === 6 && !abreSabado)
            continue;

        dias++;

    }

    dias -= feriados;

    if (dias < 0)
        dias = 0;

    return dias;

}

function calcularDiasDecorridos(inicio, abreSabado, abreDomingo, feriados) {

    const hoje = new Date();

    const dataInicio = new Date(inicio);

    let ultimoDia = hoje;

    // Se o período não for o mês atual,
    // considera o último dia do mês informado.
    if (

        hoje.getFullYear() !== dataInicio.getFullYear() ||

        hoje.getMonth() !== dataInicio.getMonth()

    ) {

        ultimoDia = new Date(

            dataInicio.getFullYear(),

            dataInicio.getMonth() + 1,

            0

        );

    }

    let dias = 0;

    for (

        let data = new Date(dataInicio);

        data <= ultimoDia;

        data.setDate(data.getDate() + 1)

    ) {

        const semana = data.getDay();

        if (semana === 0 && !abreDomingo)
            continue;

        if (semana === 6 && !abreSabado)
            continue;

        dias++;

    }

    dias -= feriados;

    if (dias < 0)
        dias = 0;

    return dias;

}

export function obterMetaDashboard(inicio, fim, loja) {

    return new Promise((resolve, reject) => {

        const data = new Date(inicio);

        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;

        let sql;
        let params;

        // =====================================================
        // TODAS AS LOJAS
        // =====================================================

        if (loja === "TODAS") {

            sql = `

                SELECT

                    ROUND(SUM(meta_mensal),2) AS meta_mensal,

                    SUM(abre_sabado) AS abre_sabado,

                    SUM(abre_domingo) AS abre_domingo,

                    SUM(feriados) AS feriados

                FROM metas

                WHERE

                    ano = ?

                    AND mes = ?

            `;

            params = [

                ano,
                mes

            ];

        }

        // =====================================================
        // UMA LOJA
        // =====================================================

        else {

            sql = `

                SELECT

                    meta_mensal,

                    abre_sabado,

                    abre_domingo,

                    feriados

                FROM metas

                WHERE

                    loja = ?

                    AND ano = ?

                    AND mes = ?

            `;

            params = [

                loja,
                ano,
                mes

            ];

        }

        db.get(

            sql,

            params,

            (err, meta) => {

                if (err)
                    return reject(err);

                if (!meta || !meta.meta_mensal) {

                    return resolve({

                        meta_mensal: 0,

                        meta_diaria: 0,

                        dias_uteis: 0,

                        dias_decorridos: 0,

                        meta_esperada: 0,

                        atingimento: 0,

                        faltante: 0,

                        necessario_por_dia: 0,

                        abre_sabado: 0,

                        abre_domingo: 0,

                        feriados: 0

                    });

                }

                const abreSabado = Number(meta.abre_sabado);
                const abreDomingo = Number(meta.abre_domingo);
                const feriados = Number(meta.feriados);

                const diasUteis = calcularDiasUteis(

                    ano,
                    mes,
                    abreSabado,
                    abreDomingo,
                    feriados

                );

                const diasDecorridos = calcularDiasDecorridos(

                    inicio,
                    abreSabado,
                    abreDomingo,
                    feriados

                );

                const metaMensal = Number(meta.meta_mensal);

                const metaDiaria = diasUteis > 0

                    ? metaMensal / diasUteis

                    : 0;

                resolve({

                    meta_mensal: metaMensal,

                    abre_sabado: abreSabado,

                    abre_domingo: abreDomingo,

                    feriados,

                    dias_uteis: diasUteis,

                    dias_decorridos: diasDecorridos,

                    meta_diaria: Number(metaDiaria.toFixed(2)),

                    meta_esperada: 0,

                    atingimento: 0,

                    faltante: 0,

                    necessario_por_dia: 0

                });

            }

        );

    });

}