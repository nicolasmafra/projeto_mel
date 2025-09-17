const tile_size_chao = 16;

var imagemChao = new Image();
imagemChao.src = 'TX Tileset Grass.png'; // Coloque o caminho da sua imagem aqui

var chao = {
    grade: null,

    desenhar(canvas) {
        var tile_x = 0;
        var tile_y = 15;

        var ctx = canvas.getContext('2d');
        
        var imagemX = tile_x * tile_size_chao;
        var imagemY = tile_y * tile_size_chao;
        var imagemWidth = tile_size_chao;
        var imagemHeight = tile_size_chao;
        var canvasWidth = this.grade.tamanho;
        var canvasHeight = this.grade.tamanho;

        for (let y = 0; y < canvas.height; y += canvasHeight) {
            for (let x = 0; x < canvas.width; x += canvasWidth) {
                ctx.drawImage(imagemChao, imagemX, imagemY, imagemWidth, imagemHeight, x, y, canvasWidth, canvasHeight);
            }
        }
    },
};
