const max_animacao_andando = 8;
const max_animacao_ataque1 = 6;
const tile_size_personagem = 100;
const tamanho_real_personagem = 10; // tamanho em pixels dentro do tile
const y_real_personagem = 57;
const frequencia_animacao_personagem = 20; // vezes por segundo
const tempo_para_trocar_animacao_personagem_andando = 1/frequencia_animacao_personagem; // em segundos
const tempo_para_trocar_animacao_personagem_Ataque1 = 1/frequencia_animacao_personagem; // em segundos
const velocidade_movimento = 5; // grades / segundo
const grades_do_personagem = 1;

var imagemPersonagem = new Image();
imagemPersonagem.src = 'assets/personagemAndando.png';

var imagemPersonagemAtaque1 = new Image();
imagemPersonagemAtaque1.src = 'assets/personagemAtaque1.png';

var personagem = {
    x: 100,
    y: 100,
    z: 0,
    largura: 50,
    altura: 50,
    animacao: 0,
    acumuladorAnimacao: 0,
    velocidade: {
        x: 0,
        y: 0,
    },
    grade: null,
    modo:"normal",
    dano: 25,
    vida: 100,
    podeDarDano: true,
    imagemInvertida: false,
    tamanho: null,
    raio: null,
    atacou: false,

    configurar(grade) {
        this.grade = grade;
        this.tamanho = grades_do_personagem*this.grade.tamanho;
        this.raio = this.tamanho /2;
    },

    desenhar(canvas, sombra=false) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao;
        var tile_y = 0;

        var imageX = tile_x * tile_size_personagem;
        var imageY = tile_y * tile_size_personagem;
        var imagemWidth = tile_size_personagem;
        var imagemHeight = tile_size_personagem;
        
        var tamanho = grades_do_personagem * this.grade.tamanho; // em pixels do canvas
        var correcaoEscala = this.tamanho / tamanho_real_personagem; // número adimensional
        var diferencaY = y_real_personagem - tile_size_personagem/2; // em pixels da imagem

        var canvasWidth = tile_size_personagem * correcaoEscala;
        var canvasHeight = tile_size_personagem * correcaoEscala;
        var canvasX = this.x - canvasWidth/2;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala;

        var imagemASerDesenhada;

        if (this.modo == "normal"){
            imagemASerDesenhada = imagemPersonagem
        }
        if (this.modo == "ataque1"){
            imagemASerDesenhada = imagemPersonagemAtaque1
        }

        if (sombra) {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.tamanho/2, this.tamanho/4, 0, 0, 2*Math.PI);
            ctx.fill();
        } else if (this.imagemInvertida) {
            
            ctx.save();
            ctx.translate(canvasX + canvasWidth / 2, canvasY + canvasHeight / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(
                imagemASerDesenhada, imageX, imageY, imagemWidth, imagemHeight,
                -canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                imagemASerDesenhada,
                imageX, imageY, imagemWidth, imagemHeight,
                canvasX, canvasY, canvasWidth, canvasHeight
            );
        }
    },

    desenharSombra(canvas) {
        this.desenhar(canvas, true);
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
        if(evento.key === 'f'){
            this.modo = "ataque1"
            this.atacou = false
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
    
    },

    pararMovimento(evento) {
        if (evento.key === 'ArrowUp' && this.velocidade.y < 0) this.velocidade.y = 0;
        if (evento.key === 'ArrowDown' && this.velocidade.y > 0) this.velocidade.y = 0;
        if (evento.key === 'ArrowLeft' && this.velocidade.x < 0) this.velocidade.x = 0;
        if (evento.key === 'ArrowRight' && this.velocidade.x > 0) this.velocidade.x = 0;
    },

    atualizar(tempoQuePassou) {
        this.mover(tempoQuePassou);
        this.atualizarAnimacao(tempoQuePassou);
        this.verificarAtaque();
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
        var tempoParaTrocar;
        var maxAnimacao;

        if (this.modo == "normal"){
            // verifica se precisa parar animação
            if (this.velocidade.x == 0 && this.velocidade.y == 0) {
                this.acumuladorAnimacao = tempo_para_trocar_animacao_personagem_andando;
                this.animacao = 0;
                return;
            }
            
            tempoParaTrocar = tempo_para_trocar_animacao_personagem_andando;
            maxAnimacao = max_animacao_andando;
        }
        if (this.modo == "ataque1"){
            tempoParaTrocar = tempo_para_trocar_animacao_personagem_Ataque1;
            maxAnimacao = max_animacao_ataque1;
        }

        this.acumuladorAnimacao = this.acumuladorAnimacao + tempoQuePassou;

        // verifica se deve reiniciar a animação
        if (this.acumuladorAnimacao > tempoParaTrocar) {
            // debita o tempo utilizado do acumulador
            this.acumuladorAnimacao = this.acumuladorAnimacao - tempoParaTrocar;

            // executa animação
            this.animacao = this.animacao + 1;
            // verifica se terminou a animação
            if (this.animacao >= maxAnimacao) {
                this.animacao = 0; // reinicia
                if (this.modo == "ataque1"){
                    this.modo = "normal";
                    this.acumuladorAnimacao = 0;
                }
            }
        }
    },

    verificarAtaque() {
        if(this.modo == "ataque1" && colidiu(personagem, boss) && ! this.atacou) {
            this.atacou = true
            boss.receberDano(30)
        }
    },
};

