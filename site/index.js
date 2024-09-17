addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1/acesso").then((val) => {
        return val.json();
    })
    .then((valor) => {
        const temp = document.head.querySelector("#base").content.children[0];
        const butn = document.head.querySelector("#btnbase").content.children[0];
        for(let i = 0; i < 2; i ++){
            let template = temp.cloneNode(true);
            let btntemplate = butn.cloneNode(true);
            let div = document.createElement("div");
            template.querySelector("#item").setAttribute("src", "http://127.0.0.1/images/" + valor[i][0].imagepath);
            template.querySelector("#nomecontainer #nome").textContent = valor[i][0].nome;
            template.querySelector("#nomecontainer #musga").setAttribute("onclick", "playSound(" + i + ")");
            btntemplate.id = i;
            btntemplate.setAttribute("onclick", "Vote(" + i + ")")
            div.className = "flex center col selection";
            div.append(template);
            div.append(btntemplate);
            document.querySelector("#Menu").append(div);
        }
    });
});

function Vote(i){
    fetch("http://127.0.0.1/acesso").then((val) => {
        return val.json();
    })
    .then((valor) => {
        const access = new Request("/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Banana: valor[i][0].id, Selection: i})
        });
        fetch(access);
    });
}

function sound(trackname){
    let audio = new Audio(trackname.detail);
    return audio;
}

function playSound(id){
    new AudioRequest("http://127.0.0.1/music/" + id);
}

var au = new Audio();
addEventListener("audiocall", (trackname) => {
    if(!au.paused){
        au.pause();
    }
    au = sound(trackname);
    au.volume = 0.1;
    au.play();
});

addEventListener("tablecall", tabela);
var requester = new TabelaRequest("tablecall");
requester.send();

function tabela(){
    fetch("http://127.0.0.1/todos").then((val) => {
        return val.json();
    })
    .then((valor) => {
        let tabelar = document.querySelector("#popular");
        tabelar.replaceChildren();
        for(let i = 0; i < valor.length + 1; i ++){
            let template = document.createElement("tr");
            let type = "";
            if (i == 0){
                type = "th";
            }
            else{
                type = "td";
            }
            let main = document.createElement(type);
            let maino = document.createElement(type);
            if (i == 0){
                main.innerHTML = "Nome";
                template.append(main);
                maino.innerHTML = "Votos";
                template.append(maino);
            }
            else{
                main.innerHTML = valor[i - 1].nome;
                template.append(main);
                maino.innerHTML = valor[i - 1].votes;
                template.append(maino);
            }
            tabelar.append(template);
        }
    });

    setTimeout(() => {
        requester.send();
    }, 1 * 1000);
}

addEventListener("tabcall", updateChange);
var requesterduo= new TabelaRequest("tabcall");
requesterduo.send();

function updateChange(){
    fetch("http://127.0.0.1/acesso").then((val) => {
        return val.json();
    })
    .then((valor) => {
        fetch("http://127.0.0.1/votes").then((valp) => {
            return valp.json();
        })
        .then((valorfin) => {
            let tabelar = document.querySelector("#selectcool");
            tabelar.replaceChildren();
            for(let i = 0; i < 2; i ++){
                let template = document.createElement("tr");
                let type = "";
                if (i == 0){
                    type = "th";
                }
                else{
                    type = "td";
                }
                let main = document.createElement(type);
                let maino = document.createElement(type);
                console.log(valorfin)
                if (i == 0){
                    main.innerHTML = valor[i][0].nome;
                    template.append(main);
                    maino.innerHTML = valor[i + 1][0].nome;
                    template.append(maino);
                }
                else{
                    main.innerHTML = valorfin.main[0];
                    template.append(main);
                    maino.innerHTML = valorfin.main[1];
                    template.append(maino);
                }
                tabelar.append(template);
            }
        });
    });

    setTimeout(() => {
        requesterduo.send();
    }, 1 * 1000);
}
