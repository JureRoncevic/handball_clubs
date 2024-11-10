
const express = require('express');
const path = require('path');
const routes = require('./routes');


const app = express();
// Definiranje port-a na kojem će server slušati
const PORT = 3000;

// Middleware za parsiranje JSON podataka u tijelu HTTP zahtjeva
app.use(express.json());

// Definiranje osnovne rute za API zahtjeve, koja koristi rute iz ./routes modula
app.use('/api', routes);


app.use(express.static(path.join(__dirname, '../')));


// Middleware za omogućavanje pristupa knjižnicama koje su instalirane u node_modules direktoriju.

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// Middleware za omogućavanje pristupa datotekama u 'data' direktoriju.

app.use('/data', express.static(path.join(__dirname, '../')));

// Definicija glavne rute koja učitava index.html stranicu kada se posjeti početna stranica ('/')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Pokretanje servera na definiranom portu (3000)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});