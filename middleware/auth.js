import jwt from "jsonwebtoken";

const CHAVE = process.env.JWT_SECRET || "innovaro-dashboard";

export default function auth(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {

        return res.status(401).json({

            sucesso: false,
            mensagem: "Token não informado."

        });

    }

    const token = header.replace("Bearer ", "");

    try {

        const usuario = jwt.verify(token, CHAVE);

        req.usuario = usuario;

        next();

    } catch {

        return res.status(401).json({

            sucesso: false,
            mensagem: "Token inválido."

        });

    }

}