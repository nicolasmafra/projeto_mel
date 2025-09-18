const tile_size_boss = 75;

var imagemBoss = new Image();
imagemBoss.src = 'IDLE.png';

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

        var imageX = tile_x * tile_size_boss;
        var imageY = tile_y * tile_size_boss;
        var imagemWidth = tile_size_boss ;
        var imagemHeight = tile_size_boss;

        var escala = 2;
        var larguraDesenho = imagemWidth * escala;
        var alturaDesenho = imagemHeight * escala;

        ctx.drawImage(
            imagemBoss,
            imageX, imageY, imagemWidth, imagemHeight, // recorte da sprite
            this.x, this.y, larguraDesenho, alturaDesenho // posição e tamanho no canvas
        );

        var canvasWidth = tile_size_boss * this.grade.tamanho;
        var canvasHeight = tile_size_boss * this.grade.tamanho;
        var canvasX = this.x - canvasWidth;
        var canvasY = this.y - canvasHeight;
    },

    atualizar(tempoQuePassou) {
    
    },
}

