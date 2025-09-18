const tile_width_boss = 79;
const tile_height_boss = 69;
const tamanho_real_boss = 20; // tamanho que o corpo ocupa sem as asas, em pixels
const grades_do_boss = 2;
const y_real_boss = 40;

var imagemBoss = new Image();
imagemBoss.src = 'assets/boss.png';

var boss = {
    x: 900,
    y: 400,
    largura: 75,
    altura: 75,
    velocidade: 1,
    grade: null,

    desenhar(canvas) {
        var ctx = canvas.getContext('2d');

        var tile_x = 0
        var tile_y = 0

        var imageX = tile_x * tile_width_boss;
        var imageY = tile_y * tile_height_boss;
        var imagemWidth = tile_width_boss;
        var imagemHeight = tile_height_boss;

        var tamanhoEsperado = grades_do_boss * this.grade.tamanho; // em pixels do canvas
        var correcaoEscala = tamanhoEsperado / tamanho_real_boss; // número adimensional
        var diferencaY = y_real_boss - tile_height_boss/2; // em pixels da imagem

        var canvasWidth = tile_width_boss * correcaoEscala;
        var canvasHeight = tile_height_boss * correcaoEscala;
        var canvasX = this.x - canvasWidth/2;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala;


        ctx.drawImage(
            imagemBoss,
            imageX, imageY, imagemWidth, imagemHeight,
            canvasX, canvasY, canvasWidth, canvasHeight       
        );
    },

    atualizar(tempoQuePassou) {
    
    },
}

