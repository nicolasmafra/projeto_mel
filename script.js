const max_tempo = 0.5; // em segundos
var canvas;
var textoLog;
var grade = {
    tamanho: 32,
    maxX: null,
    maxY: null,
}

function configurarEIniciar() {
    textoLog = document.getElementById("log");
    configurarCanvas();
    configurarEventos();
    configurarGrade();
    personagem.configurar(grade);
    boss.configurar(grade);
    executarLoop();
};

function configurarCanvas() {
    canvas = document.getElementById('meuCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function configurarEventos() {
    window.addEventListener('keydown', botaoApertado);
    window.addEventListener('keyup', botaoLevantado);
    canvas.addEventListener('pointerdown', botaoApertado);
    canvas.addEventListener('pointerup', botaoLevantado);
}

function configurarGrade() {
    grade.minX = this.grade.tamanho/2;
    grade.minY = this.grade.tamanho/2;
    grade.maxX = canvas.width - this.grade.tamanho/2;
    grade.maxY = canvas.height - this.grade.tamanho/2;

    personagem.grade = grade;
    boss.grade = grade;
    chao.grade = grade;
}

var ultimaAtualizacao;
function executarLoop() {
    var agora = Date.now();
    var tempoQuePassou = (ultimaAtualizacao ? (agora - ultimaAtualizacao) : 0) / 1000; // em segundos
    if (tempoQuePassou > max_tempo) {
        tempoQuePassou = max_tempo;
    }
    personagem.atualizar(tempoQuePassou);
    boss.atualizar(tempoQuePassou);
    desenhar();

    ultimaAtualizacao = agora;
    requestAnimationFrame(executarLoop); // chama de novo
}

function desenhar() {
    reiniciarCanvas();
    chao.desenhar(canvas);

    var coisas = [
        personagem,
        boss,
    ];

    coisas.sort(function(a,b) { //ordenar para variavel y 
        return a.y < b.y ? -1 : a.y > b.y ? 1 : 0;
    });

    coisas.forEach(coisa => {
        if (coisa.desenharSombra) {
            coisa.desenharSombra(canvas);
        }
    })
    coisas.forEach(coisa => {
        coisa.desenhar(canvas);
    })
}

function reiniciarCanvas() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function botaoApertado(evento) {
    textoLog.innerHTML = "Log: " + (evento.key || evento.constructor.name);
    personagem.iniciarMovimento(evento);
}

function botaoLevantado(evento) {
    personagem.pararMovimento(evento);
}
function colidiu(coisa1, coisa2) {
    // pitágoras
    var dx = coisa1.x - coisa2.x;
    var dy = coisa1.y - coisa2.y;
    var dz = coisa1.z - coisa2.z;
    var quadradoHipotenusa = dx*dx + dy*dy + dz*dz;

    var distancia = Math.sqrt(quadradoHipotenusa);
    var distanciaMinima = coisa1.raio + coisa2.raio;

    return distancia < distanciaMinima;
}
