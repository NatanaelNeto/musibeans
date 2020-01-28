var logoDiv = document.getElementById("logoDiv");
var cardsDiv = document.getElementById("cardsDiv");
var cards = document.getElementsByClassName("card");
var barCards = document.getElementsByClassName("bar-card");
var alert = document.getElementById("alert");
var alertTitle = document.getElementById("alertTitle");
var alertText = document.getElementById("alertText");
var barAlert = document.getElementById("barAlert");
var gameDiv = document.getElementById("gameDiv");
var gameDivArea = document.getElementById("gameDivArea");
var gameDivResp = document.getElementById("gameDivResp");
var rows = document.getElementsByClassName("row");
var rowsResp = document.getElementsByClassName("row-micro");
var calibrateKeyboard = 1;
var gameStart = false;
var red = "#f44";
var orange = "#f83";
var yellow = "#fc4";
var green = "#9e5";
var aqua = "#8fa";
var blue = "#4af";
var purple = "#84b";
var rowColor = 0;
var rowResp = 0;
var dataPos = [60,62,64,65,67,69,71];
var sequence = new Array();
var insert = new Array();
var nRows = 0;
var whiteKey = 0;
var blackKey = 0;
var sizeCode = 4;

function makeSeq(){
    sequence = new Array();
    for(let i = 0; i < sizeCode; i++){
        let j = Math.floor(Math.random()*7)
        if (j==7){
            j=6;
        }
        if(sequence.indexOf(dataPos[j]) < 0){
            sequence.push(dataPos[j]);
        }else{
            i--;
        }
    }
}

function loadBody(){
    if(navigator.requestMIDIAccess){
        alertText.innerHTML = "Seu browser suporta o acesso MIDI.";
        alertTitle.innerHTML = "Suporte ao MIDI";
        barAlert.style.backgroundColor = "#9e5";
        alert.style.left = 0;
        setTimeout(function(){
            alert.style.left = "-500px";
            logoDiv.style.opacity = 0;
            loaded();
        },3000);
        
    }else{
        alertText.innerHTML = "Seu browser não suporta o acesso MIDI.";
        alertTitle.innerHTML = "Falta de suporte";
        barAlert.style.backgroundColor = "#f44";
        alert.style.left = 0;
        setTimeout(function(){
            alert.style.left = "-500px";
        },3000);
    }
}
function loaded(){
    setTimeout(function(){
        logoDiv.style.display = "none";
        cardsDiv.style.display = "flex";
        cardsDiv.style.opacity = 1;
        var i = 0;
        var showCard = setInterval(function(){
            cards[i].style.opacity = 1;
            cards[i].style.transform = "none";
            i++;
            if(i == cards.length){
                clearInterval(showCard);
            }
        }, 300);
        navigator.requestMIDIAccess().then(onMIDISucess,onMIDIFailure);
    },600);
}
function onMIDISucess(midiAccess){
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    //onsole.log(midiAccess);
    //console.log(inputs.size);

    tryMIDIConnection(midiAccess);
    /*while(inputs.size == 0){
        alertText.innerHTML = "Conecte um dispositivo MIDI e atualize a página.";
        alertTitle.innerHTML = "Falha na conexão MIDI";
        alert.style.left = 0;
        setTimeout(function(){
            alert.style.left = "-500px";
        },3000);
    }*/
}
function onMIDIFailure(){
    alertText.innerHTML = "Seu browser não suporta o acesso MIDI.";
    alertTitle.innerHTML = "Falta de suporte";
    barAlert.style.backgroundColor = "#f44";
    alert.style.left = 0;
    setTimeout(function(){
        alert.style.left = "-500px";
    },3000);
}

function tryMIDIConnection(midiAccess){
    if(midiAccess.inputs.size == 0){
        alertText.innerHTML = "Falha na conexão MIDI. Conecte um dispositivo MIDI no seu computador.";
        alertTitle.innerHTML = "Conexão MIDI";
        barAlert.style.backgroundColor = "#f44";
        alert.style.left = 0;
        barCards[0].style.backgroundColor = "#f44";
        setTimeout(function(){
            alert.style.left = "-500px";
            tryMIDIConnection(midiAccess);
        },3000);
    }else{
        for (var input of midiAccess.inputs.values()){
            input.onmidimessage = getMIDIMessage;
            midiAccess.onstatechange = function(){
                if(midiAccess.inputs.size == 0){
                    for(let i = 0; i < cards.length; i++){
                        cards[i].style.opacity = 1;
                    }
                    
                    cards[2].style.backgroundColor = "#f44";
                    cards[2].classList.remove("card-fixed");
                    cards[0].classList.remove("card-fixed");
                    tryMIDIConnection(midiAccess);
                }
            }
        }
        alertText.innerHTML = "Conexão com dispositivo MIDI bem sucedida";
        alertTitle.innerHTML = "Conexão MIDI";
        barAlert.style.backgroundColor = "#9e5";
        barCards[0].style.backgroundColor = "#9e5";
        cards[0].classList.add("card-fixed");
        alert.style.left = 0;
        setTimeout(function(){
            alert.style.left = "-500px";
        },2000);
        if(calibrateKeyboard == 2){
            alertText.innerHTML = "Aperte a nota DÓ central do seu controlador MIDI.";
            alertTitle.innerHTML = "Detectar nota";
            barAlert.style.backgroundColor = "#9e5";
            barCards[0].style.backgroundColor = "#9e5";
            cards[0].classList.add("card-fixed");
            alert.style.left = 0;
            setTimeout(function(){
                alert.style.left = "-500px";
            },3000);
        }
    }
}

function getMIDIMessage(mm){
    if(mm.data[0] == 144){
        if(calibrateKeyboard == 1 && mm.data[1] == 60){
            alertText.innerHTML = "Você está pronto para jogar!";
            alertTitle.innerHTML = "Nota DÓ encontrada!";
            barAlert.style.backgroundColor = "#9e5";
            alert.style.left = 0;
            setTimeout(function(){
                alert.style.left = "-500px";
            },3000);
            calibrateKeyboard--;
            barCards[1].style.backgroundColor = "#9e5";
            cards[1].classList.add("card-fixed");
        }
        if(gameStart && (nRows <= 10)){
            if(rowColor < sizeCode){
                switch(mm.data[1]){
                    case 60:
                        addColor(red);
                        insert.push(60);
                        break;
                    case 62:
                        addColor(orange);
                        insert.push(62);
                        break;
                    case 64:
                        addColor(yellow);
                        insert.push(64);
                        break;
                    case 65:
                        addColor(green);
                        insert.push(65);
                        break;
                    case 67:
                        addColor(aqua);
                        insert.push(67);
                        break;
                    case 69:
                        addColor(blue);
                        insert.push(69);
                        break;
                    case 71:
                        addColor(purple);
                        insert.push(71);
                        break;
                }
            }else{
                
                console.log(nRows);
                console.log(sequence);
                console.log(insert);
                blackKey = 0;
                whiteKey = 0;
                rowColor = 0;

                for(let i = 0; i < sizeCode; i++){
                    for(let j = 0; j < sizeCode; j++){
                        if(insert[i] == sequence[i]){
                            blackKey++;
                            j = sizeCode;
                        }else if(insert[i] == sequence[j]){
                            whiteKey++;
                            j = sizeCode;
                        }
                    }
                }
                var microRow = 0;
                var colorDiv = document.createElement("div");
                colorDiv.classList.add("row-micro");
                gameDivResp.appendChild(colorDiv);
                for(let i = 0; i < blackKey; i++){
                    var key = document.createElement("div");
                    key.classList.add("micro-key-black");
                    rowsResp[rowsResp.length-1].appendChild(key);
                }
                for(let i = 0; i < whiteKey; i++){
                    var key = document.createElement("div");
                    key.classList.add("micro-key-white");
                    rowsResp[rowsResp.length-1].appendChild(key);
                }
                if(blackKey == sizeCode){
                    alertText.innerHTML = "Você descobriu a senha correta!";
                    alertTitle.innerHTML = "Vitória!";
                    alert.style.left = 0;
                    setTimeout(function(){
                        alert.style.left = "-500px";
                        resetGame();
                    },5000);
                }
                blackKey = 0;
                whiteKey = 0;
                insert = new Array();
                if(nRows == 10){
                    gameStart = false;
                    nRows = 0;
                    alertText.innerHTML = "Você não conseguiu descobrir a senha.";
                    alertTitle.innerHTML = "Derrota";
                    barAlert.style.backgroundColor = "#f44";
                    alert.style.left = 0;
                    setTimeout(function(){
                        alert.style.left = "-500px";
                        resetGame();
                    },5000);
                }
            }
        }
    }
}

function addColor(color){
    if(rowColor == 0){
        var colorDiv = document.createElement("div");
        colorDiv.classList.add("row");
        gameDivArea.appendChild(colorDiv);
        var ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.backgroundColor = color;
        rowColor++;
        rows[rows.length-1].appendChild(ball);
        nRows++;
    }else{
        var ball = document.createElement("div");
        ball.classList.add("ball");
        ball.style.backgroundColor = color;
        rowColor++;
        rows[rows.length-1].appendChild(ball);
    }
}

function startGame(){
    if(calibrateKeyboard == 0){
        makeSeq();
        gameStart = true;
        barCards[2].style.backgroundColor = "#9e5";
        cards[2].classList.add("card-fixed");
        setTimeout(function(){
            cardsDiv.style.display = "none";
            gameDiv.style.display = "flex";
        },1000);
    }else{
        alertText.innerHTML = "Execute o passo 2 para poder continuar";
        alertTitle.innerHTML = "Passo 2 não concluído.";
        barAlert.style.backgroundColor = "#f44";
        alert.style.left = 0;
        setTimeout(function(){
            alert.style.left = "-500px";
        },3000);
    }
}

function resetGame(){
    while(gameDivArea.firstChild){
        gameDivArea.removeChild(gameDivArea.firstChild);
    }
    var backArea = document.createElement("div");
    backArea.classList.add("back-area");
    for(let i = 0; i < 10; i++){
        var backRow = document.createElement("div");
        backRow.classList.add("row");
        for(let j = 0; j < 4; j++){
            var clearBall = document.createElement("div");
            clearBall.classList.add("ball");
            clearBall.classList.add("ball-clear");
            backRow.appendChild(clearBall);
        }
        backArea.appendChild(backRow);
    }
    gameDivArea.appendChild(backArea);
    
    while(gameDivResp.firstChild){
        gameDivResp.removeChild(gameDivResp.firstChild);
    }
    nRows = 0;
    makeSeq();

}

function clearRow(){
    if(rowColor > 0){
        rowColor = 0;
        insert = new Array();
        rows[rows.length-1].remove();
    }
}