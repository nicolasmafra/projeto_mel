const tile_y_personagem_andando = 1;
const max_animacao_andando = 8;
const tile_size_personagem = 100;
const tempo_para_trocar_animacao_personagem = 0.10; // em segundos
const velocidade_movimento = 15; // pixels / segundo

var imagemPersonagem = new Image();
imagemPersonagem.src = 'Soldier.png';

var personagem = {
    size: 100,
    x: 100,
    y: 100,
    animacao: 0,
    acumuladorAnimacao: 0,
    movimento: {
        x: 0,
        y: 0,
    },

    desenhar(canvas) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao;
        var tile_y = tile_y_personagem_andando;

        var imageX = tile_x * tile_size_personagem;
        var imageY = tile_y * tile_size_personagem;
        var imagemWidth = tile_size_personagem;
        var imagemHeight = tile_size_personagem;

        var canvasX = this.x;
        var canvasY = this.y;
        var canvasWidth = this.size;
        var canvasHeight = this.size;

        ctx.drawImage(imagemPersonagem, imageX, imageY, imagemWidth, imagemHeight, canvasX, canvasY, canvasWidth, canvasHeight);
    },

    iniciarMovimento(evento) {
        if (evento.key === 'ArrowUp') this.movimento.y = -velocidade_movimento;
        if (evento.key === 'ArrowDown') this.movimento.y = +velocidade_movimento;
        if (evento.key === 'ArrowLeft') this.movimento.x = -velocidade_movimento;
        if (evento.key === 'ArrowRight') this.movimento.x = +velocidade_movimento;
    },

    pararMovimento(evento) {
        if (evento.key === 'ArrowUp') this.movimento.y = 0;
        if (evento.key === 'ArrowDown') this.movimento.y = 0;
        if (evento.key === 'ArrowLeft') this.movimento.x = 0;
        if (evento.key === 'ArrowRight') this.movimento.x = 0;
    },

    atualizar(tempoQuePassou) {
        this.mover(tempoQuePassou);
        this.atualizarAnimacao(tempoQuePassou);
    },

    mover(tempoQuePassou) {
        this.x = this.x + this.movimento.x * tempoQuePassou;
        this.y = this.y + this.movimento.y * tempoQuePassou;
    },

    atualizarAnimacao(tempoQuePassou) {
        if (this.movimento.x == 0 && this.movimento.y == 0) {
            this.acumuladorAnimacao = tempo_para_trocar_animacao_personagem;
            this.animacao = 0;
            return;
        }

        this.acumuladorAnimacao = this.acumuladorAnimacao + tempoQuePassou;

        if (this.acumuladorAnimacao > tempo_para_trocar_animacao_personagem) {
            // debita o tempo utilizado do acumulador
            this.acumuladorAnimacao = this.acumuladorAnimacao - tempo_para_trocar_animacao_personagem;

            // executa animação
            this.animacao = this.animacao + 1;
            if (this.animacao >= max_animacao_andando) this.animacao = 0;
        }
    }
};
