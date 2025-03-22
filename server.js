require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requestIp = require("request-ip");

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestIp.mw());

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 🗂 Criar o modelo de dados
const VotoSchema = new mongoose.Schema({
    nome: { type: String, unique: true, required: true },
    grupo: { type: String, required: true },
    ip: { type: String, unique: true, required: true }
});
const Voto = mongoose.model("Voto", VotoSchema);

// 🔥 Rota para registrar um voto
app.post("/votar", async (req, res) => {
    const { nome, grupo } = req.body;
    const ip = req.clientIp; // Captura o IP do usuário

    try {
        // Verifica se o nome OU o IP já votaram
        const votoExistente = await Voto.findOne({ $or: [{ nome }, { ip }] });

        if (votoExistente) {
            return res.status(400).send("Este nome ou IP já votou.");
        }

        // Se não existe, salva o voto
        const novoVoto = new Voto({ nome, grupo, ip });
        await novoVoto.save();
        res.status(201).send("Voto registrado com sucesso!");

    } catch (error) {
        res.status(400).send("Erro ao registrar o voto.");
    }
});

// 🔥 Rota para obter os resultados com imagens
app.get("/resultados", async (req, res) => {
    try {
        const votos = await Voto.aggregate([
            { $group: { _id: "$grupo", total: { $sum: 1 } } }
        ]);

        // Mapeamento das imagens das bandeiras
        const bandeiras = {
            culinaria: "imagems/grupos/1.png",
            feijoada: "imagems/grupos/2.png",
            doces: "imagems/grupos/3.jpg"
        };

        // Adiciona a URL da bandeira ao resultado
        const resultadosComBandeiras = votos.map(voto => ({
            grupo: voto._id,
            total: voto.total,
            imagem: bandeiras[voto._id] || "imagens/default.png" // Imagem padrão se não houver
        }));

        res.json(resultadosComBandeiras);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar resultados" });
    }
});

// 🔥 Rota para zerar a votação (caso precise resetar os votos)
app.delete("/resetar", async (req, res) => {
    try {
        await Voto.deleteMany({});
        res.status(200).send("Votação resetada com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao resetar a votação.");
    }
});

// Iniciar o servidor usando variável de ambiente
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
