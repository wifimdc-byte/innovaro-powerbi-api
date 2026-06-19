import axios from "axios";
import config from "../config.js";

function formatarData(data) {

    const [ano, mes, dia] = data.split("-");

    return `${dia}-${mes}-${ano}`;

}

export async function buscarVendas(data) {

    const dataFormatada = formatarData(data);

    const url = `${config.baseUrl}/vendas?ini=${dataFormatada}&fim=${dataFormatada}`;

    console.log("");
    console.log("========================================");
    console.log("CONSULTANDO API INNOVARO");
    console.log("========================================");
    console.log("Data:", dataFormatada);
    console.log("URL:", url);
    console.log("");

    const inicio = Date.now();

    try {

        console.log("Enviando requisição...");

        const response = await axios.get(url, {

            headers: {
                Authorization: `Bearer ${config.token}`,
                Accept: "application/json"
            },

            timeout: 120000 // 2 minutos

        });

        console.log("Resposta recebida.");

        const tempo = Number(
            ((Date.now() - inicio) / 1000).toFixed(1)
        );

        console.log("");
        console.log(`✅ API respondeu em ${tempo} segundos`);
        console.log(`✅ ${response.data.length} registros encontrados`);

        return {

            sucesso: true,

            vendas: response.data,

            registros: response.data.length,

            tempo,

            mensagem: "OK"

        };

    } catch (erro) {

        const tempo = Number(
            ((Date.now() - inicio) / 1000).toFixed(1)
        );

        console.log("");

        // Timeout
        if (erro.code === "ECONNABORTED") {

            console.log("❌ Timeout após 120 segundos.");

            return {

                sucesso: false,

                vendas: [],

                registros: 0,

                tempo,

                status: 408,

                mensagem: "Timeout ao consultar Innovaro"

            };

        }

        // Erro HTTP
        if (erro.response) {

            console.log(`❌ HTTP ${erro.response.status}`);

            console.log(erro.response.data);

            return {

                sucesso: false,

                vendas: [],

                registros: 0,

                tempo,

                status: erro.response.status,

                mensagem: JSON.stringify(erro.response.data)

            };

        }

        // Outros erros
        console.log("❌ Erro:");
        console.log(erro.message);

        return {

            sucesso: false,

            vendas: [],

            registros: 0,

            tempo,

            status: 0,

            mensagem: erro.message

        };

    }

}