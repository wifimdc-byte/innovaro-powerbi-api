import { buscarVendas } from "./innovaro.js";
import { salvarVendas, apagarDia } from "../database/vendasRepository.js";
import { salvarLog } from "../database/logRepository.js";

export async function sincronizar(data = null) {

    const dia = data || new Date().toISOString().split("T")[0];

    console.log("");
    console.log("======================================");
    console.log("SINCRONIZANDO VENDAS");
    console.log("======================================");
    console.log("");

    console.log(`Data: ${dia}`);

    const resultado = await buscarVendas(dia);

    // Se a API falhar, NÃO apaga nada
    if (!resultado.sucesso) {

        await salvarLog(
            dia,
            0,
            resultado.tempo || 0,
            "ERRO",
            resultado.mensagem || "Falha ao consultar API"
        );

        console.log("");
        console.log("❌ Falha ao consultar a API.");
        console.log(resultado.mensagem);

        return;

    }

    // Se a API retornar vazio, NÃO apaga nada
    if (!resultado.vendas || resultado.vendas.length === 0) {

        await salvarLog(
            dia,
            0,
            resultado.tempo || 0,
            "ERRO",
            "API retornou zero registros"
        );

        console.log("");
        console.log("⚠ API retornou zero registros.");
        console.log("Nenhum dado foi removido do banco.");

        return;

    }

    console.log("");
    console.log(`Recebidos ${resultado.registros} registros`);

    // Só apaga depois de validar os dados
    console.log("Removendo registros antigos...");
    await apagarDia(dia);

    console.log("Gravando SQLite...");
    await salvarVendas(resultado.vendas);

    await salvarLog(
        dia,
        resultado.registros,
        resultado.tempo,
        "OK",
        ""
    );

    console.log("");
    console.log("======================================");
    console.log("SINCRONIZAÇÃO CONCLUÍDA");
    console.log("======================================");
    console.log(`Tempo: ${resultado.tempo}s`);
    console.log(`Registros: ${resultado.registros}`);

}