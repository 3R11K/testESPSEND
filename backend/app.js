const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('frontend'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.post('/send/:text', (req, res) => {
    //mudar texto do json salvo na pasta backend
    const text = req.params.text;
    const data = JSON.parse(fs.readFileSync('backend/text.json'));
    data.text = text;
    fs.writeFileSync('backend/text.json', JSON.stringify(data));
    res.send('alterado');
});

app.get('/read', (req, res) => {
    //ler texto do json salvo na pasta backend
    const data = JSON.parse(fs.readFileSync('backend/text.json'));
    res.send(data);

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on port 3000'));