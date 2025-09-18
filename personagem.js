const tile_y_personagem_andando = 1;
const max_animacao_andando = 8;
const tile_size_personagem = 100;
const tamanho_real_personagem = 16;
const frequencia_animacao_personagem = 20; // vezes por segundo
const tempo_para_trocar_animacao_personagem = 1/frequencia_animacao_personagem; // em segundos
const velocidade_movimento = 5; // grades / segundo

var imagemPersonagem = new Image();
imagemPersonagem.src = 'assets/personagem.png';

var personagem = {
    x: 0,
    y: 0,
    largura: 50,
    altura: 50,
    animacao: 0,
    acumuladorAnimacao: 0,
    velocidade: {
        x: 0,
        y: 0,
    },
    grade: null,
    imagemInvertida: false,

    desenhar(canvas) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao;
        var tile_y = tile_y_personagem_andando;

        var imageX = tile_x * tile_size_personagem;
        var imageY = tile_y * tile_size_personagem;
        var imagemWidth = tile_size_personagem;
        var imagemHeight = tile_size_personagem;

        var canvasWidth = tile_size_personagem * (this.grade.tamanho / tamanho_real_personagem);
        var canvasHeight = tile_size_personagem * (this.grade.tamanho / tamanho_real_personagem);
        var canvasX = this.x - canvasWidth/2;
        var canvasY = this.y - canvasHeight/2;

    if (this.imagemInvertida) {
        
        ctx.save();
        ctx.translate(canvasX + canvasWidth / 2, canvasY + canvasHeight / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(
            imagemPersonagem, imageX, imageY, imagemWidth, imagemHeight,
            -canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight
        );
        ctx.restore();
    } else {
        ctx.drawImage(
            imagemPersonagem,
            imageX, imageY, imagemWidth, imagemHeight,
            canvasX, canvasY, canvasWidth, canvasHeight
        );
    }
},

    iniciarMovimento(evento) {
        if (evento.key === 'ArrowUp') this.velocidade.y = -velocidade_movimento * this.grade.tamanho;
        if (evento.key === 'ArrowDown') this.velocidade.y = +velocidade_movimento * this.grade.tamanho;
        if (evento.key === 'ArrowLeft') {
            this.velocidade.x = -velocidade_movimento * this.grade.tamanho;
            this.imagemInvertida = true;
        }
        if (evento.key === 'ArrowRight') {
            this.velocidade.x = +velocidade_movimento * this.grade.tamanho;
            this.imagemInvertida = false;
        }
    },

    pararMovimento(evento) {
        if (evento.key === 'ArrowUp') this.velocidade.y = 0;
        if (evento.key === 'ArrowDown') this.velocidade.y = 0;
        if (evento.key === 'ArrowLeft') this.velocidade.x = 0;
        if (evento.key === 'ArrowRight') this.velocidade.x = 0;
    },

    atualizar(tempoQuePassou) {
        this.mover(tempoQuePassou);
        this.atualizarAnimacao(tempoQuePassou);
    },
    
    mover(tempoQuePassou) {
        this.x = this.x + this.velocidade.x * tempoQuePassou;
        this.y = this.y + this.velocidade.y * tempoQuePassou;
        
        if (this.x < this.grade.minX) {
            this.velocidade.x = 0;
            this.x = this.grade.minX;
        }
        if (this.y < this.grade.minY) {
            this.velocidade.y = 0;
            this.y = this.grade.minY;
        }
        if (this.x > this.grade.maxX) {
            this.velocidade.x = 0;
            this.x = this.grade.maxX;
        }
        if (this.y > this.grade.maxY) {
            this.velocidade.y = 0;
            this.y = this.grade.maxY;
        }
    },

    atualizarAnimacao(tempoQuePassou) {
        if (this.velocidade.x == 0 && this.velocidade.y == 0) {
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
