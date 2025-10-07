const max_animacao_andando = 8;
const max_animacao_ataque1 = 6;
const max_animacao_ataque2 = 6;
const max_animacao_ataque3 = 9;
const max_animacao_morrendo = 4;
const tile_size_personagem = 100;
const tamanho_real_personagem = 10; // tamanho em pixels dentro do tile
const y_real_personagem = 57;
const frequencia_animacao_personagem = 20; // vezes por segundo
const tempo_para_trocar_animacao_personagem_andando = 1/frequencia_animacao_personagem; // em segundos
const tempo_para_trocar_animacao_personagem_Ataque1 = 1/frequencia_animacao_personagem; // em segundos
const tempo_para_trocar_animacao_personagem_Ataque2 = 1/frequencia_animacao_personagem; // em segundos
const tempo_para_trocar_animacao_personagem_Ataque3 = 1/frequencia_animacao_personagem; // em segundos
const tempo_para_trocar_animacao_personagem_Morrendo = 1/frequencia_animacao_personagem; // em segundos
const velocidade_movimento = 5; // grades / segundo
const grades_do_personagem = 1;
const vidaMaximaPersonagem = 130;
const tempoMaximoDanoPersonagem = 1; // em segundos

var imagemPersonagem = new Image();
imagemPersonagem.src = 'assets/personagemAndando.png';

var imagemPersonagemAtaque1 = new Image();
imagemPersonagemAtaque1.src = 'assets/personagemAtaque1.png';

var imagemPersonagemAtaque2 = new Image();
imagemPersonagemAtaque2.src = 'assets/personagemAtaque2.png';

var imagemPersonagemAtaque3 = new Image();
imagemPersonagemAtaque3.src = 'assets/personagemAtaque3.png';

var imagemPersonagemMorrendo = new Image();
imagemPersonagemMorrendo.src = 'assets/personagemMorrendo.png';

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
    dano: 30,
    vida: vidaMaximaPersonagem,
    podeDarDano: true,
    imagemInvertida: false,
    tamanho: null,
    raio: null,
    atacou: false,
    tempoDano: 0,

    configurar(grade) {
        this.grade = grade;
        this.tamanho = grades_do_personagem*this.grade.tamanho;
        this.raio = this.tamanho /2;
    },

    desenhar (canvas, tipoDesenho = "imagem") {
        if (this.modo == "morto") {
            return;
        }
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
        if (this.modo == "ataque2"){
            imagemASerDesenhada = imagemPersonagemAtaque2
        }
        if (this.modo == "ataque3"){
            imagemASerDesenhada = imagemPersonagemAtaque3
        }
        if (this.modo == "morrendo"){
            imagemASerDesenhada = imagemPersonagemMorrendo
        }

        if (tipoDesenho == "sombra") {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.tamanho/2, this.tamanho/4, 0, 0, 2*Math.PI);
            ctx.fill();

            } else if (tipoDesenho == "barra") {

            var x = (2/5) * canvas.width;
            var y = (0.9) * canvas.height;
            var width = (1/5) * canvas.width;
            var height = (0.03) * canvas.height;

            ctx.fillStyle = "#080808ff";
            ctx.fillRect(x, y, width, height);

            var fracaoVida = this.vida/vidaMaximaPersonagem;
            ctx.fillStyle = "#440909ff";
            ctx.fillRect(x, y, width * fracaoVida, height);

            ctx.strokeStyle = "#a78b10ff";
            ctx.lineWidth = 2; // espessura da borda
            ctx.strokeRect(x, y, width, height);

            ctx.strokeStyle = "#fcf04bff";
            ctx.lineWidth = 2; 
            ctx.strokeRect(x, y, width * fracaoVida, height);

            ctx.font = "18px Arial";       
            ctx.fillStyle = "#000000ff"
            ctx.textAlign = "center"; 

            ctx.fillText("PERSONAGEM", x + width /2, y + 2*height );

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
        this.desenhar(canvas, "sombra");
    },
    desenharBarra(canvas) {
        this.desenhar(canvas, "barra");
    },

    iniciarMovimento(evento) {
        if (evento.code === 'ArrowUp') this.velocidade.y = -velocidade_movimento * this.grade.tamanho;
        if (evento.code === 'ArrowDown') this.velocidade.y = +velocidade_movimento * this.grade.tamanho;
        
        if (evento.code === 'ArrowLeft') {
            this.velocidade.x = -velocidade_movimento * this.grade.tamanho;
            this.imagemInvertida = true;
        }
        if (evento.code === 'ArrowRight') {
            this.velocidade.x = +velocidade_movimento * this.grade.tamanho;
            this.imagemInvertida = false;
        }
        var botaoAtaqueApertado = evento.code === 'Enter' || evento.code === 'Space';
        if (botaoAtaqueApertado && this.modo == "normal") {
            this.modo = "ataque1"
            this.atacou = false;
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
        var botaoAtaque2Apertado = evento.code === 'KeyF' 
        if (botaoAtaque2Apertado && this.modo == "normal") {
            this.modo = "ataque2"
            this.atacou = false;
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
        var botaoAtaque3Apertado = evento.code === 'KeyG' 
        if (botaoAtaque3Apertado && this.modo == "normal") {
            this.modo = "ataque3"
            this.atacou = false;
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

    atualizarModo(tempoQuePassou) {
        if (this.modo == "morrendo" || this.modo == "morto") {
            return;
        }
        if (this.vida <= 0 && this.modo != "morrendo") {
            this.modo = "morrendo"
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
            return;
        }
    },

    atualizar(tempoQuePassou) {
        if (this.modo == "morto") {
            return;
        }
        this.atualizarModo(tempoQuePassou);
        this.mover(tempoQuePassou);
        this.atualizarAnimacao(tempoQuePassou);
        this.verificarAtaque();
        this.tempoDano -= tempoQuePassou;
        if (this.tempoDano < 0) {
            this.tempoDano = 0;
        }
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
        if (this.modo == "ataque2"){
            tempoParaTrocar = tempo_para_trocar_animacao_personagem_Ataque2;
            maxAnimacao = max_animacao_ataque2;
        }
        if (this.modo == "ataque3"){
            tempoParaTrocar = tempo_para_trocar_animacao_personagem_Ataque3;
            maxAnimacao = max_animacao_ataque3;
        }
        if (this.modo == "morrendo"){
            tempoParaTrocar = tempo_para_trocar_animacao_personagem_Morrendo;
            maxAnimacao = max_animacao_morrendo;
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
                if (this.modo == "morrendo") {
                    this.modo = "morto";
                    textoFinal = "game over";
                    acabou = true;
                    return;
                }
                this.animacao = 0; // reinicia
                if (this.modo == "ataque1" || this.modo == "ataque2"){
                    this.modo = "normal";
                    this.acumuladorAnimacao = 0;
                }
                if(this.modo == "ataque3") {
                    adicionarCoisa(new Flecha(this))
                    this.modo = "normal";
                    this.acumuladorAnimacao = 0;
                }
            }
        }
    },

    verificarAtaque() {
        var espada = {
            x: this.x,
            y: this.y,
            z: this.z,
            raio: this.raio,
        };
        if (this.imagemInvertida) {
            espada.x -= this.raio;
        } else {
            espada.x += this.raio;
        }

        if (this.atacou || !colidiu(espada, boss)) {
            return;
        }
        if(this.modo == "ataque1") {
            this.atacou = true
            boss.receberDano(30)
        }
        if(this.modo == "ataque2") {
            this.atacou = true
            boss.receberDano(20)
        }
    },
    receberDano(quantidade_de_Dano) {
        if (this.tempoDano > 0) {
            return; // já está recebendo dano
        }
        this.vida -= quantidade_de_Dano;
        this.tempoDano = tempoMaximoDanoPersonagem;
        console.log( "personagem: recebi dano. vida atual: " + this.vida)

        if(this.vida <= 0 ){
            console.log("personagem: morreu")
            this.vida = 0
        }
    }
};

