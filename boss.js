const tile_width_boss = 79;
const tile_height_boss = 69;
const max_animacao_bossVoando = 4;
const max_animacao_bossAtacando = 8;
const tamanho_real_boss = 25; // tamanho que o corpo ocupa sem as asas, em pixels
const grades_do_boss = 3;
const x_real_boss = 32;
const y_real_boss_parado = 55;
const tempo_para_trocar_animacao_bossVoando = 0.2;
const tempo_para_trocar_animacao_bossAtacando = 0.2;
const velocidade_maxima_boss = 200;
const suavidade_boss = 0.08;
const distance_maxima = 3; // em grades
const altura_voando = 4;
const altura_atacando = 1; //em grades
const velocidadeAtaqueZ = 1; // em 1/s

const imagemBossVoando = new Image();
imagemBossVoando.src = 'assets/bossVoando.png';

const imagemBossAtaque = new Image();
imagemBossAtaque.src = 'assets/bossAtaque.png';

var boss = {
    x: 900,
    y: 400,
    largura: 200,
    altura:500,
    z: null, 
    acumuladorAnimacao: 0,
    animacao: 0,
    grade: null,
    modo: "voando",
    dano: 10,
    vida: 100,
    tamanho: null,
    raio: null,

    configurar(grade) {
        this.grade = grade;
        this.tamanho = grades_do_boss*this.grade.tamanho;
        this.raio = 2*this.tamanho / 2;
        this.z = altura_voando*this.grade.tamanho;
    },

    desenhar(canvas, sombra=false) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao 
        var tile_y = 0

        var imageX = tile_x * tile_width_boss;
        var imageY = tile_y * tile_height_boss;
        var imagemWidth = tile_width_boss;
        var imagemHeight = tile_height_boss;

        var correcaoEscala = this.tamanho / tamanho_real_boss; // número adimensional
        var diferencaX = x_real_boss - tile_width_boss/2; // em pixels da imagem
        var diferencaY = y_real_boss_parado - tile_height_boss/2; // em pixels da imagem

        var canvasWidth = tile_width_boss * correcaoEscala;
        var canvasHeight = tile_height_boss * correcaoEscala;
        var canvasX = this.x - canvasWidth/2 - diferencaX * correcaoEscala;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala - this.z;

        var imagemASerDesenhada;

        if (this.modo == "voando"){
            imagemASerDesenhada = imagemBossVoando
        }
        if (this.modo == "atacando"){
            imagemASerDesenhada = imagemBossAtaque
        }

        if (sombra) {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.tamanho/2, this.tamanho/4, 0, 0, 2*Math.PI);
            ctx.fill();
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

    aproximarBoss(tempoQuePassou) {
        var dx = personagem.x - this.x;
        var dy = personagem.y+1 - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            var velocidade = Math.sqrt(distance) / suavidade_boss;
            if (velocidade > velocidade_maxima_boss) {
                velocidade = velocidade_maxima_boss;
            }
            this.x += (dx / distance) * velocidade * tempoQuePassou;
            this.y += (dy / distance) * velocidade * tempoQuePassou;
        }
    },

    atualizarModo() {
        var dx = personagem.x - this.x;
        var dy = personagem.y+1 - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < 1 && this.modo != "atacando"){
            this.modo = "atacando";
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
        const distanceMaxima = distance_maxima*this.grade.tamanho;
        if(distance > distanceMaxima && this.modo != "voando"){
            this.modo = "voando"
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
    },

    atualizar(tempoQuePassou) {
        this.atualizarAnimacao(tempoQuePassou);

        this.atualizarModo();
        if(this.modo == "voando"){
            this.aproximarBoss(tempoQuePassou);
        }

        // voltar altura
        var alturaFinal;
        if (this.modo == "voando") {
            alturaFinal = altura_voando*this.grade.tamanho;
        }
        if (this.modo == "atacando") {
            alturaFinal = altura_atacando*this.grade.tamanho;
        }
        var diferencaAltura = alturaFinal - this.z;
        this.z = this.z + diferencaAltura*velocidadeAtaqueZ*tempoQuePassou;
    },

    atualizarAnimacao(tempoQuePassou) {
        this.acumuladorAnimacao = this.acumuladorAnimacao + tempoQuePassou;
        var tempoParaTrocar;
        var maxAnimacao;
        
        if (this.modo == "voando"){
            tempoParaTrocar = tempo_para_trocar_animacao_bossVoando;
            maxAnimacao = max_animacao_bossVoando;
        }
        if (this.modo == "atacando"){
            tempoParaTrocar = tempo_para_trocar_animacao_bossAtacando;
            maxAnimacao = max_animacao_bossAtacando;
        }
        // verifica se deve reiniciar a animação
        if (this.acumuladorAnimacao > tempoParaTrocar) {
            // debita o tempo utilizado do acumulador
            this.acumuladorAnimacao = this.acumuladorAnimacao - tempoParaTrocar;

            // executa animação
            this.animacao = this.animacao + 1;
            if (this.animacao >= maxAnimacao) this.animacao = 0;
        }
    }
}

