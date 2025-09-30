const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

let tarefas = [];

app.get('/tarefas', (req, res) => {
    res.json(tarefas);
});


app.post('/tarefas', (req, res) => {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ erro: "Texto é obrigatório" });

    tarefas.push(texto);
    res.status(201).json({ sucesso: true, tarefas });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
