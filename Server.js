//importações
var http = require('http');
var url = require('url');
const fs = require('fs');
const express = require ('express');
const path  = require('path');
const { urlencoded } = require('body-parser');

//express
var app=express();
const port = 3001;

//PATHS
const bioPath = path.join(__dirname, 'biologia.json')
const quiPath = path.join(__dirname, 'quimica.json')
const fisPath = path.join(__dirname, 'fisica.json')

//leitura e parse
let bioData = fs.readFileSync(bioPath,'utf8');
let quiData = fs.readFileSync(quiPath,'utf8');
let fisData = fs.readFileSync(fisPath,'utf8');
let biologia = JSON.parse(bioData);
let quimica =  JSON.parse(quiData);
let fisica = JSON.parse(fisData);

//iomportação dentro do express
app.use(express.json())
app.use(urlencoded ({extended: true}))

//rotas simples
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

//rota buscar

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

//funções
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

//SALVAR EM JSON

//salvar biologia

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

//salvar quimica

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

//salvar fisica

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


//ATUALIZAR JSON

//biologia

app.get('/atualizarbiologia', (req, res) => {
    res.sendFile(path.join(__dirname, 'alterarbiologia.html'));
});

app.post('/atualizarbiologia', (req, res) => {
    const { titulo, novaDesc, novaUrlInfo, novaUrlFoto} = req.body

    const BIndex = biologia.findIndex(biologia => biologia.titulo.toLowerCase() === titulo.toLowerCase());

    if (BIndex === -1) {
        res.send('<h1>Assunto não encontrado</h1>')
        return
    }

    console.log(req.body)
    console.log(novaDesc)
    console.log(novaUrlInfo)
    console.log(novaUrlFoto)
    console.log(titulo)


    biologia[BIndex].desc = novaDesc
    biologia[BIndex].url_foto = novaUrlInfo
    biologia[BIndex].url_info = novaUrlFoto

    SalvarB()

    res.send('<h1>Artigo atualizado com sucesso</h1>')
})

//quimica

app.get('/atualizarquimica', (req, res) => {
    res.sendFile(path.join(__dirname, 'alterarquimica.html'));
});

app.post('/atualizarquimica', (req, res) => {
    const { titulo, novaDesc, novaUrlInfo, novaUrlFoto} = req.body

    const QIndex = quimica.findIndex(quimica => quimica.titulo.toLowerCase() === titulo.toLowerCase());

    if (QIndex === -1) {
        res.send('<h1>Assunto não encontrado</h1>')
        return
    }

    console.log(req.body)
    console.log(novaDesc)
    console.log(novaUrlInfo)
    console.log(novaUrlFoto)
    console.log(titulo)


    quimica[QIndex].desc = novaDesc
    quimica[QIndex].url_foto = novaUrlInfo
    quimica[QIndex].url_info = novaUrlFoto

    SalvarQ()

    res.send('<h1>Artigo atualizado com sucesso</h1>')
})

//fisica

app.get('/atualizarfisica', (req, res) => {
    res.sendFile(path.join(__dirname, 'alterarfisica.html'));
});

app.post('/atualizarfisica', (req, res) => {
    const { titulo, novaDesc, novaUrlInfo, novaUrlFoto} = req.body

    const FIndex = fisica.findIndex(fisica => fisica.titulo.toLowerCase() === titulo.toLowerCase());

    if (FIndex === -1) {
        res.send('<h1>Assunto não encontrado</h1>')
        return
    }

    console.log(req.body)
    console.log(novaDesc)
    console.log(novaUrlInfo)
    console.log(novaUrlFoto)
    console.log(titulo)


    fisica[FIndex].desc = novaDesc
    fisica[FIndex].url_foto = novaUrlInfo
    fisica[FIndex].url_info = novaUrlFoto

    SalvarF()

    res.send('<h1>Artigo atualizado com sucesso</h1>')
})


//ROTAS EXCLUSÃO

//bio

app.get('/excluir-Assunto-Biologia', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirassunto.html'));
});

app.post('/excluir-Assunto-Biologia', (req, res) => {
    const  titulo  = req.body.titulo;

    let bioData = fs.readFileSync(bioPath,'utf8');
    let biologia = JSON.parse(bioData);

    const BIndex = biologia.findIndex(b => b.titulo.toLowerCase() === titulo.toLowerCase());

    if (BIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
    }

    console.log("teste");
    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir o artigo ${titulo}?')) {
                window.location.href = '/excluir-Assunto-confirmado-Biologia?titulo=${titulo}';
            } else {
                window.location.href = '/excluir-Assunto-Biologia';
            }
        </script>
        `);
});

app.get('/excluir-Assunto-confirmado-Biologia', (req, res) => {
    const titulo = req.query.titulo;

    const BIndex = biologia.findIndex(b => b.titulo.toLowerCase() === titulo.toLowerCase());
    if (BIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
        return;
    }

    biologia.splice(BIndex, 1);
    SalvarB();

    res.send(`<h1> O assunto ${titulo} foi excluido com sucesso! </h1>`)
});

//quimica
app.get('/excluir-Assunto-quimica', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirassunto.html'));
});

app.post('/excluir-Assunto-quimica', (req, res) => {
    const titulo = req.body.titulo;

    let quiData = fs.readFileSync(quiPath, 'utf8');
    let quimica = JSON.parse(quiData);

    const QIndex = quimica.findIndex(q => q.titulo.toLowerCase() === titulo.toLowerCase());

    if (QIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
        return;
    }

    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir o artigo ${titulo}?')) {
                window.location.href = '/excluir-Assunto-confirmado-quimica?titulo=${titulo}';
            } else {
                window.location.href = '/excluir-Assunto-quimica';
            }
        </script>
        `);
});

app.get('/excluir-Assunto-confirmado-quimica', (req, res) => {
    const titulo = req.query.titulo;

    const QIndex = quimica.findIndex(q => q.titulo.toLowerCase() === titulo.toLowerCase());
    if (QIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
    }

    quimica.splice(QIndex, 1);
    SalvarQ();

    res.send(`<h1> O assunto ${titulo} foi excluido com sucesso! </h1>`)
});

//fisica
app.get('/excluir-Assunto-fisica', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirassunto.html'));
});

app.post('/excluir-Assunto-fisica', (req, res) => {
    const titulo = req.body.titulo;

    let fisData = fs.readFileSync(fisPath, 'utf8');
    let fisica = JSON.parse(fisData);

    const FIndex = fisica.findIndex(f => f.titulo.toLowerCase() === titulo.toLowerCase());

    if (FIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
        return;
    }

    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir o artigo ${titulo}?')) {
                window.location.href = '/excluir-Assunto-confirmado-fisica?titulo=${titulo}';
            } else {
                window.location.href = '/excluir-Assunto-fisica';
            }
        </script>
        `);
});

app.get('/excluir-Assunto-confirmado-fisica', (req, res) => {
    const titulo = req.query.titulo;

    const FIndex = fisica.findIndex(f => f.titulo.toLowerCase() === titulo.toLowerCase());
    if (FIndex === -1) {
        res.send('<h1>Assunto não encontrado.</h1>');
        return;
    }

    fisica.splice(FIndex, 1);
    SalvarF();

    res.send(`<h1> O assunto ${titulo} foi excluido com sucesso! </h1>`)
});


app.listen(port, () => {
console.log(`servidor iniciado em http://localhost:${port}`)
});