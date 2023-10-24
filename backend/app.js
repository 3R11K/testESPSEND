const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const bodyParser = require('body-parser');

app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.post('/send/:text', (req, res) => {
    // Mudar o texto do JSON salvo na pasta backend
    const text = req.params.text;
    const data = JSON.parse(fs.readFileSync('backend/text.json'));
    data.text = text;
    fs.writeFileSync('backend/text.json', JSON.stringify(data));

    // Enviar o novo texto para todos os clientes WebSocket conectados
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ text }));
        }
    });

    res.send('alterado');
});

app.get('/read', (req, res) => {
    // Ler texto do JSON salvo na pasta backend
    const data = JSON.parse(fs.readFileSync('backend/text.json'));
    res.send(data);
});

// Configuração do WebSocket para a rota /websocket
const wss = new WebSocket.Server({ server, path: '/websocket' });

wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');

    // Enviar o texto atual do JSON para o novo cliente
    const data = JSON.parse(fs.readFileSync('backend/text.json'));
    ws.send(JSON.stringify(data));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
