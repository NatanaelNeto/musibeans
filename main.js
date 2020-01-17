var cards = document.getElementsByClassName("card");
var alert = document.getElementById("alert");
var alertTitle = document.getElementById("alertTitle");
var alertText = document.getElementById("alertText");
var gameDiv = document.getElementById("gameDiv");
var calibrateKeyboard = 2;
var gameStart = false;
var red = "#f44";
var orange = "#f83";
var yellow = "#fc4";
var green = "#9e5";
var aqua = "#7db";
var blue = "#4af";
var purple = "#84b";

var loadBody = function(){
    if(navigator.requestMIDIAccess){
        alertText.innerHTML = "Seu browser suporta o acesso MIDI.";
        alertTitle.innerHTML = "Suporte ao MIDI";
        alert.style.bottom = 0;
        setTimeout(function(){
            alert.style.bottom = "-120px";
            loaded();
        },3000);
        
    }else{
        alertText.innerHTML = "Seu browser não suporta o acesso MIDI.";
        alertTitle.innerHTML = "Falta de suporte";
        alert.style.bottom = 0;
        setTimeout(function(){
            alert.style.bottom = "-120px";
        },3000);
    }
}
loaded = function(){
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
}
function onMIDISucess(midiAccess){
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    console.log(midiAccess);
    console.log(inputs.size);

    tryMIDIConnection(midiAccess);
    /*while(inputs.size == 0){
        alertText.innerHTML = "Conecte um dispositivo MIDI e atualize a página.";
        alertTitle.innerHTML = "Falha na conexão MIDI";
        alert.style.bottom = 0;
        setTimeout(function(){
            alert.style.bottom = "-120px";
        },3000);
    }*/
}
function onMIDIFailure(){
    
}

function tryMIDIConnection(midiAccess){
    if(midiAccess.inputs.size == 0){
        alertText.innerHTML = "Conecte um dispositivo MIDI no seu computador.";
        alertTitle.innerHTML = "Falha na conexão MIDI";
        alert.style.bottom = 0;
        cards[0].style.backgroundColor = "#f44";
        setTimeout(function(){
            alert.style.bottom = "-120px";
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
            };
        }
        alertText.innerHTML = "Conexão com dispositivo MIDI bem sucedida";
        alertTitle.innerHTML = "Conexão MIDI";
        cards[0].style.backgroundColor = "#9e5";
        cards[0].classList.add("card-fixed");
        alert.style.bottom = 0;
        setTimeout(function(){
            alert.style.bottom = "-120px";
        },2000);
        if(calibrateKeyboard == 2){
            alertText.innerHTML = "Aperte as notas DÓ e SI centrais do seu teclado.";
            alertTitle.innerHTML = "Detectar notas";
            cards[0].style.backgroundColor = "#9e5";
            cards[0].classList.add("card-fixed");
            alert.style.bottom = 0;
            setTimeout(function(){
                alert.style.bottom = "-120px";
            },3000);
        }
    }
}

function getMIDIMessage(mm){
    if(mm.data[0] == 144){
        if(calibrateKeyboard == 2 && mm.data[1] == 60){
            alertText.innerHTML = "Aperte agora a Nota de Si";
            alertTitle.innerHTML = "Nota DÓ";
            alert.style.bottom = 0;
            setTimeout(function(){
                alert.style.bottom = "-120px";
            },1000);
            calibrateKeyboard--;
        }else if(calibrateKeyboard == 1 && mm.data[1] == 71){
            alertText.innerHTML = "Você está pronto para jogar!";
            alertTitle.innerHTML = "Nota SI";
            alert.style.bottom = 0;
            setTimeout(function(){
                alert.style.bottom = "-120px";
            },1000);
            calibrateKeyboard--;
            cards[1].style.backgroundColor = "#9e5";
            cards[1].classList.add("card-fixed");
        }
        if(gameStart){

        }


    }
}

function startGame(){
    gameStart = true;
    cards[2].style.backgroundColor = "#9e5";
    cards[2].classList.add("card-fixed");
    setTimeout(function(){
        for(let i = 0; i < cards.length; i++){
            cards[i].style.opacity = 0;
        }
    },2000);
}