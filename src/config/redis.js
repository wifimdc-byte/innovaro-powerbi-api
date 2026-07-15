import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

console.log("REDIS_URL =", process.env.REDIS_URL);

const redis = createClient({

    url: process.env.REDIS_URL

});

redis.on("error", (err) => {

    console.error("❌ Erro Redis:", err);

});

redis.on("connect", () => {

    console.log("✅ Redis conectado");

});

await redis.connect();

console.log(await redis.get("Teste do REDIS"));

export default redis;