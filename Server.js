var http = require('http');
var url = require('url');
const fs = require('fs');
const express = require ('express');
const path  = require('path');
const { urlencoded } = require('body-parser');

var app=express();
const port = 3001;

const bioPath = path.join(__dirname, 'biologia.json')
const quiPath = path.join(__dirname, 'quimica.json')
const fisPath = path.join(__dirname, 'fisica.json')

let bioData = fs.readFileSync(bioPath,'utf8');
let quiData = fs.readFileSync(quiPath,'utf8');
let fisData = fs.readFileSync(fisPath,'utf8');
let biologia = JSON.parse(bioData);
let quimica =  JSON.parse(quiData);
let fisica = JSON.parse(fisData);

app.use(express.json())
app.use(urlencoded ({extended: true}))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/addbio', (req, res) => {
    res.sendFile(path.join(__dirname + '/addbio.html'));
});
app.get('/addqui', (req, res) => {
    res.sendFile(path.join(__dirname + '/addqui.html'));
});
app.get('/addfis', (req, res) => {
    res.sendFile(path.join(__dirname + '/addfis.html'));
});
app.get('/biologia', (req, res) => {
    res.sendFile(path.join(__dirname + '/biologia.json'));
});
app.get('/quimica', (req, res) => {
    res.sendFile(path.join(__dirname + '/quimica.json'));
});
app.get('/fisica', (req, res) => {
    res.sendFile(path.join(__dirname + '/fisica.json'));
});
app.get('/BuscarAssunto', (req, res) => {
    res.sendFile(path.join(__dirname + '/buscarAssunto.html'));
});
app.get('/buscarAssunto/:titulo', (req,res) => {
    const tituloAssuntoBuscado = req.params.titulo;

    const AssuntoEncontradoB = BuscarAssuntoBiologia(tituloAssuntoBuscado);
    const AssuntoEncontradoQ = BuscarAssuntoQuimica(tituloAssuntoBuscado);
    const AssuntoEncontradoF = BuscarAssuntoFisica(tituloAssuntoBuscado);

    if (AssuntoEncontradoB || AssuntoEncontradoQ || AssuntoEncontradoF) {
        const DadosPath = path.join(__dirname, 'dados.html');
        const DadosData = fs.readFileSync(DadosPath, 'utf-8');

        const html = DadosData
        .replace('{{titulo}}', AssuntoEncontradoQ ? AssuntoEncontradoQ.titulo : (AssuntoEncontradoB ? AssuntoEncontradoB.titulo : AssuntoEncontradoF.titulo))
        .replace('{{desc}}', AssuntoEncontradoQ ? AssuntoEncontradoQ.desc : (AssuntoEncontradoB ? AssuntoEncontradoB.desc : AssuntoEncontradoF.desc))
        .replace('{{url_info}}', AssuntoEncontradoQ ? AssuntoEncontradoQ.url_info : (AssuntoEncontradoB ? AssuntoEncontradoB.url_info : AssuntoEncontradoF.url_info))
        .replace('{{url_foto}}', AssuntoEncontradoQ ? AssuntoEncontradoQ.url_foto : (AssuntoEncontradoB ? AssuntoEncontradoB.url_foto : AssuntoEncontradoF.url_foto));

        res.send(html);
    } else {
        res.send(`<h1>Assunto não encontrado</h1>`);
    }
});


function BuscarAssuntoBiologia(titulo) {
    return biologia.find(biologia => biologia.titulo.toLowerCase() === titulo.toLowerCase());
}
function BuscarAssuntoQuimica(titulo) {
    return quimica.find(quimica => quimica.titulo.toLowerCase() === titulo.toLowerCase());
}
function BuscarAssuntoFisica(titulo) {
    return fisica.find(fisica => fisica.titulo.toLowerCase() === titulo.toLowerCase());
}

function SalvarB() {
    fs.writeFileSync(bioPath ,JSON.stringify(biologia, null, 2))
}
function SalvarQ() {
    fs.writeFileSync(quiPath ,JSON.stringify(quimica, null, 2))
}
function SalvarF() {
    fs.writeFileSync(fisPath ,JSON.stringify(fisica, null, 2))
}

app.post('/addbio', (req, res) => {
    console.log(req.body)
    const novoAssuntoB  = req.body;

    if (biologia.find(biologia => biologia.titulo.toLowerCase() === novoAssuntoB.titulo.toLowerCase())) {
        res.send("<h1>Este assunto já existe!</h1>");
        return;
    }

    biologia.push(novoAssuntoB);

    SalvarB();

    res.send("<h1>Assunto adicionado com sucesso!</h1>");

});

app.get('/buscarAssunto', (req, res) => {
    var tituloURL
    const ArtigoBuscado = req.query.tituloURL;
    res.send("<h1>TESTE</h1>")
    console.log(ArtigoBuscado)
})

app.get('/excluir-Assunto', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirassunto'));
});

app.post('/excluir-Assunto', (req, res) => {
    const {titulo} = req.body;

    const BIn = biologia.findIndex(biologia => biologia.titulo.toLowerCase() === NOMEM.toLowerCase());

    if (BIn === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
        return;
    }

    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir o artigo ${titulo}?')) {
                window.location.href = '/excluir-Assunto-confirmado?nome=${titulo}';
            } else {
                window.location.href = '/excluir-Assunto';
            }
        </script>`);
});

app.get('/excluir-Assunto-confirmado', (req, res) => {
    const titulo = req.query.titulo;

    const BIn = biologia.findIndex(biologia => biologia.titulo.toLowerCase() === titulo.toLowerCase())

    biologia.splice(BIn, 1);

    SalvarB(biologia);

    res.send(`<h1> O assunto ${titulo} foi excluido com sucesso! </h1>`)
})

app.post('/addqui', (req, res) => {
    const novoAssuntoQ = req.body;
    if (quimica.find(quimica => quimica.titulo.toLowerCase() === novoAssuntoQ.titulo.toLowerCase())) {
        res.send("<h1>Este assunto já existe!</h1>");
        return;
    }

    quimica.push(novoAssuntoQ);
    SalvarQ();
    res.send("<h1>Assunto adicionado com sucesso!</h1>");
});



app.post('/addfis', (req, res) => {
    const novoAssuntoF  = req.body;

    if (fisica.find(fisica => fisica.titulo.toLowerCase() === novoAssuntoF.titulo.toLowerCase())) {
        res.send("<h1>Este assunto já existe!</h1>");
        return;
    }

    fisica.push(novoAssuntoF);

    SalvarF();

    res.send("<h1>Assunto adicionado com sucesso!</h1>");

});

app.listen(port, () => {
console.log(`servidor iniciado em http://localhost:${port}`)
});