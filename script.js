var canvas;
const zoom = 3;
const tamanhoGrade = 16;

function configurarEIniciar() {
    configurarCanvas();
    configurarEventos();
    executarLoop();
};

function configurarCanvas() {
    canvas = document.getElementById('meuCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function configurarEventos() {
    window.addEventListener('keydown', teclaApertada);
    window.addEventListener('keyup', teclaLevantada);
}


var ultimaAtualizacao;
function executarLoop() {
    var agora = Date.now();
    var tempoQuePassou = (ultimaAtualizacao ? (agora - ultimaAtualizacao) : 0) / 1000; // em segundos

    personagem.atualizar(tempoQuePassou);
    desenhar();

    ultimaAtualizacao = agora;
    requestAnimationFrame(executarLoop); // chama de novo
}


function desenhar() {
    reiniciarCanvas();
    chao.desenhar(canvas, tamanhoGrade);
    personagem.desenhar(canvas);
}

function reiniciarCanvas() {
    var ctx = canvas.getContext('2d');
    ctx.reset();
    ctx.scale(zoom, zoom);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function teclaApertada(evento) {
    personagem.iniciarMovimento(evento);
}

function teclaLevantada(evento) {
    personagem.pararMovimento(evento);
}

window.onload = configurarEIniciar;
