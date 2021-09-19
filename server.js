const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/redirect.html');
});

app.use(express.json());

app.use((req, res) => {
    res.sendFile(__dirname + '/redirect.html');
});

server.listen(port, () => {
    console.log(`listening at port=${port}`);
});