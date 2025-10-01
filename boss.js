const tile_width_boss = 79;
const tile_height_boss = 69;
const max_animacao_bossVoando = 4;
const max_animacao_bossAtacando = 8;
const max_animacao_bossMorrendo = 7;
const tamanho_real_boss = 25; // tamanho que o corpo ocupa sem as asas, em pixels
const grades_do_boss = 3;
const x_real_boss = 32;
const y_real_boss_parado = 55;
const tempo_para_trocar_animacao_bossVoando = 0.2;
const tempo_para_trocar_animacao_bossAtacando = 0.2;
const tempo_para_trocar_animacao_bossMorrendo = 0.2;
const velocidade_maxima_boss = 100;
const suavidade_boss = 0.08;
const distance_maxima = 3; // em grades
const altura_voando = 4;
const altura_atacando = 1; //em grades
const velocidade_z_voando = 0.8;
const velocidadeAtaqueZ = 2; // em 1/s
const vidaMaximaBoss = 130;
const tempo_maximo_ataque_boss = 4;

const imagemBossVoando = new Image();
imagemBossVoando.src = 'assets/bossVoando.png';

const imagemBossAtaque = new Image();
imagemBossAtaque.src = 'assets/bossAtaque.png';

const imagemBossMorrendo = new Image();
imagemBossMorrendo.src = 'assets/bossMorrendo.png';

var boss = {
    x: 400,
    y: 600,
    largura: 200,
    altura:500,
    z: null, 
    acumuladorAnimacao: 0,
    animacao: 0,
    grade: null,
    modo: "voando",
    dano: 10,
    vida: vidaMaximaBoss,
    tamanho: null,
    raio: null,
    imagemInvertida: false,
    tempoAtaque: 0,

    configurar(grade) {
        this.grade = grade;
        this.tamanho = grades_do_boss*this.grade.tamanho;
        this.raio = this.tamanho / 2;
        this.z = altura_voando*this.grade.tamanho;
    },

    desenhar(canvas, tipoDesenho="imagem") {
        if (this.modo == "morto") {
            return;
        }
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
        if (this.modo == "morre"){
            imagemASerDesenhada = imagemBossMorrendo
        }

        if (tipoDesenho == "sombra") {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.tamanho/2, this.tamanho/4, 0, 0, 2*Math.PI);
            ctx.fill();
        } else if (tipoDesenho == "gui") {

            var x = (1/3) * canvas.width;
            var y = (0.1) * canvas.height;
            var width = (1/3) * canvas.width;
            var height = (0.04) * canvas.height;

            ctx.fillStyle = "#080808ff";
            ctx.fillRect(x, y, width, height);

            var fracaoVida = this.vida/vidaMaximaBoss;
            ctx.fillStyle = "#440909ff";
            ctx.fillRect(x, y, width * fracaoVida, height);

            ctx.strokeStyle = "#a78b10ff";
            ctx.lineWidth = 2; // espessura da borda
            ctx.strokeRect(x, y, width, height);

            ctx.strokeStyle = "#fcf04bff";
            ctx.lineWidth = 2; 
            ctx.strokeRect(x, y, width * fracaoVida, height);

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

    desenharGui(canvas) {
        this.desenhar(canvas, "gui");
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

    atualizarModo(tempoQuePassou) {
        if (this.modo == "morre" || this.modo == "morto") {
            return;
        }
        if (this.vida <= 0 && this.modo != "morre") {
            this.modo = "morre"
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
            return;
        }

        var dx = personagem.x - this.x;
        var dy = personagem.y+1 - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < 1 && this.modo != "atacando"){
            this.modo = "atacando";
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
            this.tempoAtaque = 0;
            return;
        }
        if (this.modo == "atacando") {
            this.tempoAtaque += tempoQuePassou;
        }
        const distanceMaxima = distance_maxima*this.grade.tamanho;
        if(distance > distanceMaxima && this.modo != "voando" && this.tempoAtaque > tempo_maximo_ataque_boss){
            this.modo = "voando"
            this.acumuladorAnimacao = 0;
            this.animacao = 0;
        }
    },

    atualizar(tempoQuePassou) {
        if (this.modo == "morto") {
            return;
        }
        this.atualizarAnimacao(tempoQuePassou);

        this.atualizarModo(tempoQuePassou);
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
        if (this.modo == "morre") {
            alturaFinal = this.z;
        }

        var velocidadeZ = this.modo == "voando" ? velocidade_z_voando : velocidadeAtaqueZ;
        var diferencaAltura = alturaFinal - this.z;
        this.z = this.z + diferencaAltura*velocidadeZ*tempoQuePassou;
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
        if (this.modo == "morre"){
            tempoParaTrocar = tempo_para_trocar_animacao_bossMorrendo;
            maxAnimacao = max_animacao_bossMorrendo;
        }
        // verifica se deve reiniciar a animação
        if (this.acumuladorAnimacao > tempoParaTrocar) {
            // debita o tempo utilizado do acumulador
            this.acumuladorAnimacao = this.acumuladorAnimacao - tempoParaTrocar;

            // executa animação
            this.animacao = this.animacao + 1;
            if (this.animacao >= maxAnimacao) {
                if (this.modo == "morre") {
                    this.modo = "morto";
                    alert('you win');
                    return;
                }
                this.animacao = 0; // reinicia
            }
        }
    },
    receberDano(quantidade_de_Dano) {
        if(this.vida <= 0){
            console.log( "boss ja esta morto")
            return;
        }

        this.vida -= quantidade_de_Dano;
        console.log( "recebi dano. vida atual: " + this.vida)

        if(this.vida <= 0 ){
            console.log("morreu")
            this.vida = 0
        }
    }
}

