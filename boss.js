const tile_width_boss = 79;
const tile_height_boss = 69;
const max_animacao_boss = 4;
const tamanho_real_boss = 25; // tamanho que o corpo ocupa sem as asas, em pixels
const grades_do_boss = 3;
const x_real_boss = 32;
const y_real_boss_parado = 40;
const frequencia_animacao_boss = 5;
const tempo_para_trocar_animacao_boss = 1/frequencia_animacao_boss;
const velocidade_maxima_boss = 200;
const suavidade_boss = 0.08;

var imagemBoss = new Image();
imagemBoss.src = 'assets/boss.png';

var boss = {
    x: 900,
    y: 400,
    z: 5, // em grades
    acumuladorAnimacao: 0,
    animacao: 0,
    grade: null,

    desenhar(canvas, sombra=false) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao 
        var tile_y = 0

        var imageX = tile_x * tile_width_boss;
        var imageY = tile_y * tile_height_boss;
        var imagemWidth = tile_width_boss;
        var imagemHeight = tile_height_boss;

        var tamanhoEsperado = grades_do_boss * this.grade.tamanho; // em pixels do canvas
        var correcaoEscala = tamanhoEsperado / tamanho_real_boss; // número adimensional
        var diferencaX = x_real_boss - tile_width_boss/2; // em pixels da imagem
        var diferencaY = y_real_boss_parado - tile_height_boss/2; // em pixels da imagem

        var canvasWidth = tile_width_boss * correcaoEscala;
        var canvasHeight = tile_height_boss * correcaoEscala;
        var canvasX = this.x - canvasWidth/2 - diferencaX * correcaoEscala;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala - this.z * this.grade.tamanho;

        if (sombra) {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, tamanhoEsperado/2, tamanhoEsperado/4, 0, 0, 2*Math.PI);
            ctx.fill();
        } else {
            ctx.drawImage(
                imagemBoss,
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

    atualizar(tempoQuePassou) {
        this.atualizarAnimacao(tempoQuePassou);

        // A fazer: verificar se o boss está no modo de aproximar ou de atacar
        this.aproximarBoss(tempoQuePassou);
    },

    atualizarAnimacao(tempoQuePassou) {
        this.acumuladorAnimacao = this.acumuladorAnimacao + tempoQuePassou;

        // verifica se deve reiniciar a animação
        if (this.acumuladorAnimacao > tempo_para_trocar_animacao_boss) {
            // debita o tempo utilizado do acumulador
            this.acumuladorAnimacao = this.acumuladorAnimacao - tempo_para_trocar_animacao_boss;

            // executa animação
            this.animacao = this.animacao + 1;
            if (this.animacao >= max_animacao_boss) this.animacao = 0;
        }
    }
}

