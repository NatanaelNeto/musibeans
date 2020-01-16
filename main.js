var cards = document.getElementsByClassName("card");
var alert = document.getElementById("alert");
var alertTitle = document.getElementById("alertTitle");
var alertText = document.getElementById("alertText");

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
        setTimeout(function(){
            alert.style.bottom = "-120px";
            tryMIDIConnection(midiAccess);
        },3000);
    }else{
        for (var input of midiAccess.inputs.values()){
            input.onmidimessage = getMIDIMessage;
        }
        alertText.innerHTML = "Conexão com dispositivo MIDI bem sucedida";
        alertTitle.innerHTML = "Conexão MIDI";
        //cards[0].style.backgroundColor = "";
        alert.style.bottom = 0;
        setTimeout(function(){
            alert.style.bottom = "-120px";
        },3000);
    }
}

function getMIDIMessage(midiMessage){
    console.log(midiMessage);
}