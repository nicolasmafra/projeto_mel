const tile_width_boss = 79;
const tile_height_boss = 69;
const max_animacao_boss = 4;
const tamanho_real_boss = 20; // tamanho que o corpo ocupa sem as asas, em pixels
const grades_do_boss = 2;
const y_real_boss_parado = 40;
const frequencia_animacao_boss = 5;
const tempo_para_trocar_animacao_boss = 1/frequencia_animacao_boss; 

var imagemBoss = new Image();
imagemBoss.src = 'assets/boss.png';

var boss = {
    x: 900,
    y: 400,
    z: 3, // em grades
    acumuladorAnimacao: 0,
    animacao: 0,
    velocidade: 2,
    grade: null,

    desenhar(canvas) {
        var ctx = canvas.getContext('2d');

        var tile_x = this.animacao 
        var tile_y = 0

        var imageX = tile_x * tile_width_boss;
        var imageY = tile_y * tile_height_boss;
        var imagemWidth = tile_width_boss;
        var imagemHeight = tile_height_boss;

        var tamanhoEsperado = grades_do_boss * this.grade.tamanho; // em pixels do canvas
        var correcaoEscala = tamanhoEsperado / tamanho_real_boss; // número adimensional
        var diferencaY = y_real_boss_parado - tile_height_boss/2; // em pixels da imagem

        var canvasWidth = tile_width_boss * correcaoEscala;
        var canvasHeight = tile_height_boss * correcaoEscala;
        var canvasX = this.x - canvasWidth/2;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala - this.z * this.grade.tamanho;


        ctx.drawImage(
            imagemBoss,
            imageX, imageY, imagemWidth, imagemHeight,
            canvasX, canvasY, canvasWidth, canvasHeight       
        );
    },

    movendoBoss(tempoQuePassou) {
        var dx = personagem.x - this.x;
        var dy = personagem.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            this.x += (dx / distance) * this.velocidade;
            this.y += (dy / distance) * this.velocidade;
        }
    },

    atualizar(tempoQuePassou) {
        this.atualizarAnimacao(tempoQuePassou);
        this.movendoBoss(tempoQuePassou)
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

