const fs = require('fs');
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

// Headers para evitar bloqueios dos portais
const headersPadrao = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// --- ROTA DO CONTADOR ---
app.get('/api/contador', (req, res) => {
    const caminho = './contagem.json';
    let dados;

    if (fs.existsSync(caminho)) {
        try {
            dados = JSON.parse(fs.readFileSync(caminho));
        } catch (e) {
            dados = { acessos: 14782 }; // Se o ficheiro estiver corrompido
        }
    } else {
        dados = { acessos: 14782 }; // Valor inicial de segurança
    }

    dados.acessos++;
    fs.writeFileSync(caminho, JSON.stringify(dados));
    res.json({ total: dados.acessos });
});

// --- FUNÇÃO AUXILIAR DE BUSCA ---
async function buscarFeed(url, res) {
    try {
        const response = await axios.get(url, { headers: headersPadrao, timeout: 10000 });
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (e) {
        console.error("Erro ao buscar feed:", url, e.message);
        res.status(500).send("Erro ao carregar feed");
    }
}

// --- ROTAS DOS FEEDS ---
app.get('/rss-google', (req, res) => buscarFeed('https://news.google.com/rss/search?q=criptomoedas&hl=pt-BR&gl=BR&ceid=BR:pt-419', res));
app.get('/rss-portal', (req, res) => buscarFeed('https://portaldobitcoin.uol.com.br/feed/', res));
app.get('/rss-cointelegraph', (req, res) => buscarFeed('https://br.cointelegraph.com/rss', res));
app.get('/rss-financas', (req, res) => buscarFeed('https://www.infomoney.com.br/mercados/feed/', res));
app.get('/rss-mundo', (req, res) => buscarFeed('https://g1.globo.com/rss/g1/mundo/', res));

app.listen(PORT, () => {
    console.log(`🚀 SISTEMA MAC ONLINE: http://localhost:${PORT}`);
});