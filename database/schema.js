import db from "./database.js";

export function criarTabelas() {

    db.serialize(() => {

        // =====================================================
        // TABELA DE CONTROLE
        // =====================================================

        db.run(`
            CREATE TABLE IF NOT EXISTS controle (

                id INTEGER PRIMARY KEY,

                ultima_data TEXT

            );
        `);

        // =====================================================
        // TABELA DE USUÁRIOS
        // =====================================================

         db.run(`
             CREATE TABLE IF NOT EXISTS usuarios (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                usuario TEXT NOT NULL UNIQUE,

                senha TEXT NOT NULL,

                nivel TEXT NOT NULL DEFAULT 'ADMIN',

                loja TEXT NOT NULL DEFAULT 'TODAS',

                ativo INTEGER NOT NULL DEFAULT 1,

                criado_em TEXT DEFAULT CURRENT_TIMESTAMP

            );
        `);

        // =====================================================
// TABELA DE METAS
// =====================================================

db.run(`
CREATE TABLE IF NOT EXISTS metas (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    loja TEXT NOT NULL,

    ano INTEGER NOT NULL,

    mes INTEGER NOT NULL,

    meta_mensal REAL NOT NULL DEFAULT 0,

    abre_sabado INTEGER NOT NULL DEFAULT 1,

    abre_domingo INTEGER NOT NULL DEFAULT 1,

    feriados INTEGER NOT NULL DEFAULT 0,

    UNIQUE(loja, ano, mes)

     );
`);

        db.get(

    "SELECT COUNT(*) AS total FROM usuarios",

    (err, row) => {

        if (err) {

            console.error(err);
            return;

        }

        if (row.total === 0) {

            db.run(

                `INSERT INTO usuarios
                (usuario, senha, nivel, loja)
                VALUES (?,?,?)`,

                [

                    "admin",

                    "admin123",

                    "ADMIN",

                    "TODAS"

                ]

            );

            console.log("👤 Usuário administrador criado.");
            console.log("Usuário: admin");
            console.log("Senha: admin123");

        }

    }

);

        // =====================================================
        // TABELA DE VENDAS
        // =====================================================

        db.run(`
            CREATE TABLE IF NOT EXISTS vendas (

                codigo_venda INTEGER,
                codigo_produto INTEGER,

                data_venda TEXT,
                hora_venda INTEGER,

                numero_venda TEXT,

                codigo_loja INTEGER,
                nome_loja TEXT,

                codigo_checkout TEXT,

                codigo_vendedor INTEGER,
                nome_vendedor TEXT,

                codigo_supervisor INTEGER,
                nome_supervisor TEXT,

                codigo_fornecedor INTEGER,
                nome_fornecedor TEXT,

                codigo_grupo INTEGER,
                nome_grupo TEXT,

                codigo_subgrupo INTEGER,
                nome_subgrupo TEXT,

                codigo_secao INTEGER,
                nome_secao TEXT,

                nome_produto TEXT,

                cfop TEXT,

                quantidade REAL,
                unitario REAL,

                desconto REAL,
                acrescimo REAL,

                impostos REAL,
                custo_item REAL,
                custo_total REAL,

                total_item REAL,

                chave_cfe TEXT,

                PRIMARY KEY (

                    codigo_venda,
                    codigo_produto

                )

            );
        `);

        // =====================================================
        // LOG DE SINCRONIZAÇÃO
        // =====================================================

        db.run(`
            CREATE TABLE IF NOT EXISTS log_sincronizacao (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                data_hora TEXT,

                data_sincronizada TEXT,

                registros INTEGER,

                tempo REAL,

                status TEXT,

                mensagem TEXT

            );
        `);

        // =====================================================
        // VIEW PRINCIPAL
        // =====================================================

        db.run(`
            CREATE VIEW IF NOT EXISTS vw_vendas AS

            SELECT

                codigo_venda,
                codigo_produto,

                data_venda,
                hora_venda,

                numero_venda,

                codigo_loja,
                nome_loja,

                codigo_checkout,

                codigo_vendedor,
                nome_vendedor,

                codigo_supervisor,
                nome_supervisor,

                codigo_fornecedor,
                nome_fornecedor,

                codigo_grupo,
                nome_grupo,

                codigo_subgrupo,
                nome_subgrupo,

                codigo_secao,
                nome_secao,

                nome_produto,

                cfop,

                quantidade,
                unitario,

                desconto,
                acrescimo,

                impostos,
                custo_item,
                custo_total,

                total_item,

                chave_cfe

            FROM vendas;
        `);

        // =====================================================
        // ÍNDICES
        // =====================================================

        db.run(`CREATE INDEX IF NOT EXISTS idx_data_venda ON vendas(data_venda);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_hora_venda ON vendas(hora_venda);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_loja ON vendas(codigo_loja);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_loja ON vendas(nome_loja);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_produto ON vendas(codigo_produto);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_produto ON vendas(nome_produto);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_vendedor ON vendas(codigo_vendedor);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_vendedor ON vendas(nome_vendedor);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_fornecedor ON vendas(codigo_fornecedor);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_fornecedor ON vendas(nome_fornecedor);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_secao ON vendas(codigo_secao);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_secao ON vendas(nome_secao);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_grupo ON vendas(codigo_grupo);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_grupo ON vendas(nome_grupo);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_codigo_subgrupo ON vendas(codigo_subgrupo);`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_nome_subgrupo ON vendas(nome_subgrupo);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_numero_venda ON vendas(numero_venda);`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_checkout ON vendas(codigo_checkout);`);
        

        console.log("✅ Banco SQLite inicializado.");
        console.log("✅ Tabelas verificadas.");
        console.log("✅ Índices criados.");
        console.log("✅ View vw_vendas criada.");

    });

}

