var canvas;
var grade = {
    tamanho: 48,
    maxX: null,
    maxY: null,
}

function configurarEIniciar() {
    configurarCanvas();
    configurarEventos();
    configurarGrade();
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

function configurarGrade() {
    grade.minX = this.grade.tamanho/2;
    grade.minY = this.grade.tamanho/2;
    grade.maxX = canvas.width - this.grade.tamanho/2;
    grade.maxY = canvas.height - this.grade.tamanho/2;

    personagem.grade = grade;
    chao.grade = grade;
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
    chao.desenhar(canvas);
    personagem.desenhar(canvas);
}

function reiniciarCanvas() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function teclaApertada(evento) {
    personagem.iniciarMovimento(evento);
}

function teclaLevantada(evento) {
    personagem.pararMovimento(evento);
}

