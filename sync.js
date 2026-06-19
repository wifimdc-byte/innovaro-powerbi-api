import { sincronizar } from "./services/sincronizador.js";

(async () => {

    try {

        // Data passada no terminal (opcional)
        const data = process.argv[2];

        await sincronizar(data);

    } catch (erro) {

        console.error(erro);

    }

})();