import jwt from "jsonwebtoken";
import crypto from "crypto";

const CHAVE = process.env.JWT_SECRET || "innovaro-dashboard";


export function gerarAccessToken(usuario){

    return jwt.sign(

        usuario,

        CHAVE,

        {

            expiresIn:"15m"

        }

    );

}

export function gerarRefreshToken(){

    return crypto.randomUUID();

}