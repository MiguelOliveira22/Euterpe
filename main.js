// main.js

const mssql = require("mssql");
const express = require("express");
const bodyparser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const prompt = require("prompt-sync")({sigint: true});
const ffmpeg = require("ffmpeg");
const fs = require("fs");

let app = express();

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

try{
    var config = require(__dirname + "/config/config.json");
    main(config);
}

catch{
    console.error("Arquivo de configuração Não Encontrado!");
    let cont = prompt("Gerar Arquivo (Ele poderá ser alterado no futuro!)? (S/n) ");

    if(cont != "n"){
        console.log();

        let nomebd = prompt("Insira O User: ");
        let passbd = prompt("Insira A Senha: ");
        let serverbd = prompt("Insira O Servidor: ");
        let dbbd = prompt("Insira O Banco De Dados: ");

        config = '{"user": "' + nomebd + '", "password": "' + passbd + '", "server": "' + serverbd + '", "database": "' + dbbd + '", "options": {"encrypt": true, "trustServerCertificate": true}}';
        if(!fs.existsSync("/config")){
            fs.mkdirSync(__dirname + "/config")
        }
        fs.writeFileSync(__dirname + "/config/config.json", config);

        process.stdout.write('\x1Bc');

        var config = require(__dirname + "/config/config.json");
        main(config);
    }
}

var returnedInUse = [];
var urlusado = [];
var votosUso = [0, 0];

async function SetOponents() {
    let returned = await GetSQL();
    let max = returned.length;
    let numbs = Math.floor(Math.random() * (max));
    let numbso = Math.floor(Math.random() * (max));

    returnedInUse[0] = returned[numbs].id;
    urlusado[0] = returned[numbs].songpath;
    do {
        numbso = Math.floor(Math.random() * (max));
    }
    while(numbs == numbso);
    returnedInUse[1] = returned[numbso].id;
    urlusado[1] = returned[numbso].songpath;
    votosUso = [0, 0];
}

function GetSQL() {
    return new Promise((res) => {
        new mssql.Request().query("SELECT id, songpath FROM Versoss.Main;", (err, result) => {
            if(err){
                throw err;
            }
            res(result.recordset);
        });
    });
}

function main(){
    mssql.connect(config, (err) => {
        if(err){
            throw err;
        }
        console.log("Funfou Login");
        SetOponents();
    });

    // Server Sends Files

    app.get("/", (req, res) => {
        res.sendFile("C:/Users/Miguel/Documents/Banana/BananaProject/site-files/euterpe.html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/about/", (req, res) => {
        res.sendFile("C:/Users/Miguel/Documents/Banana/BananaProject/site-files/euterpe.html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/cdn/:fileName", (req, res) => {
        var file = req.params.fileName;
        res.sendFile("C:/Users/Miguel/Documents/Banana/BananaProject/site/" + file, (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/images/:fileName", (req, res) => {
        var file = req.params.fileName;
        res.sendFile("C:/Users/Miguel/Documents/Banana/BananaProject/images/" + file, (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/music/:idMusga", (req, res) => {
        let mus = Number(req.params.idMusga)
        fs.readFile("C:/Users/Miguel/Documents/Banana/BananaProject/music/" + returnedInUse[mus] + ".webm", (err) => {
            if(err){
                console.log("Downloading...")
                youtubedl(urlusado[mus], {
                    extractAudio: true,
                    audioFormat: "mp3",
                    audioQuality: 0,
                    output: 'C:/Users/Miguel/Documents/Banana/BananaProject/music/' + returnedInUse[mus] + '.%(ext)s',
                    ffmpegLocation: "C:/Users/Miguel/Documents/Banana/BananaProject/node_modules/ffmpeg/lib/ffmpeg.js",
                    noWarnings: true,
                    addHeader: ['referer:youtube.com', 'user-agent:googlebot']
                });
                console.log("Downloaded!")
            }
        })
        res.sendFile("C:/Users/Miguel/Documents/Banana/BananaProject/music/" + returnedInUse[mus] + ".webm", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    // Acess Database

    app.get("/acesso/", (req, res) => {
        let useCase = [];
        for(let i = 0; i < 2; i ++){
            new mssql.Request().query("SELECT * FROM Versoss.Main WHERE id = " + returnedInUse[i] + ";", (err, result) => {
                if (err) {
                    console.log("SQL Deu Rui");
                    res.status(404).end();
                }
                useCase.push(result.recordset);
            });
        }
        setTimeout(() => {
            res.send(useCase);
        }, 3 * 1000)
    });

    app.get("/todos/", (req, res) => {
        new mssql.Request().query("SELECT nome, votes FROM Versoss.Main;", (err, result) => {
            if (err) {
                console.log("SQL Deu Rui");
                res.status(404).end();
            }
            res.send(result.recordset);
        });
    });

    app.get("/votes/", (req, res) => {
        res.send({main: votosUso});
    });

    app.post("/", (req, res) => {
        let a = Number(req.body.Banana);
        votosUso[req.body.Selection] += 1;
        new mssql.Request().query("SELECT votes FROM Versoss.Main WHERE id = " + a +";", (err, result) => {
            if (err) {
                console.log("SQL Deu Rui");
                res.status(404).end();
            }
            let num = Number(result.recordset[0].votes) + 1;
            new mssql.Request().query("UPDATE Versoss.Main SET votes = " + num + " WHERE id = " + a +";", (err) => {
                if (err) {
                    console.log("SQL Deu Rui");
                    res.status(404).end();
                }
            });
            res.status(200).end();
        });
    });

    app.listen(80, "127.0.0.1", () => {
        console.log("start");
    });
}