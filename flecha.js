const tile_size_flecha = 32;
const grades_flecha = 1;
const y_real_flecha = 32;
const velocidade_flecha = 50; // em grades por segundo
const tempo_maximo_flecha = 1; // em segundos
const tamanho_sombra_flecha = 0.1;

const imagem_flecha = new Image();
imagem_flecha.src = 'assets/flecha.png';

class Flecha {
    x = null;
    y = null;
    z = 0;
    grade = null;
    tamanho = null;
    raio = null;
    imagemInvertida = null;
    tempo = 0;

    constructor(personagem) {
        this.x = personagem.x;
        if (personagem.imagemInvertida) {
            this.x -= 2*personagem.raio;
        } else {
            this.x += 2*personagem.raio;
        }
        this.y = personagem.y;
        this.grade = personagem.grade;
        this.tamanho = grades_flecha*this.grade.tamanho;
        this.raio = this.tamanho /2;
        this.imagemInvertida = personagem.imagemInvertida;
    }

    desenhar(canvas, sombra=false) {
        var ctx = canvas.getContext('2d');

        var imageX = 0;
        var imageY = 0;
        var imagemWidth = tile_size_flecha;
        var imagemHeight = tile_size_flecha;
        
        var correcaoEscala = 1; // número adimensional
        var diferencaY = y_real_flecha - tile_size_flecha/2; // em pixels da imagem

        var canvasWidth = tile_size_flecha * correcaoEscala;
        var canvasHeight = tile_size_flecha * correcaoEscala;
        var canvasX = this.x - canvasWidth/2;
        var canvasY = this.y - canvasHeight/2 - diferencaY * correcaoEscala;

        var imagemASerDesenhada = imagem_flecha;

        if (sombra) {
            ctx.fillStyle = "#00000080";
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, tamanho_sombra_flecha*this.tamanho/2, tamanho_sombra_flecha*this.tamanho/4, 0, 0, 2*Math.PI);
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
    }

    desenharSombra(canvas) {
        this.desenhar(canvas, true);
    }

    atualizar(tempoQuePassou) {
        this.verificarColisao();
        this.mover(tempoQuePassou);
        
        this.tempo += tempoQuePassou;
        if (this.tempo > tempo_maximo_flecha) {
            removerCoisa(this);
        }
    }

    mover(tempoQuePassou) {
        var distancia = velocidade_flecha * this.grade.tamanho * tempoQuePassou;
        if (this.imagemInvertida) {
            this.x -= distancia;
        } else {
            this.x += distancia;
        }
    }

    verificarColisao() {
        if (colidiu(this, boss)) {
            boss.receberDano(10);
            removerCoisa(this);
        }
    }

}