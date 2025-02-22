function drawText(x, y, size, color, text) {
    ctx.font = size +"px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text.toString(), x, y);
}

var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame || window.msRequestAnimationFrame || 
                       function(c) {window.setTimeout(c, 15)};

function goFullScreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
};

var canvas;
canvas = document.getElementById('myCanvas');
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

function sizeCanvas() {
    var scaleX = (innerWidth - 20) / canvas.width;
    var scaleY = (innerHeight - 20) / canvas.height;

    var scaleToFit = Math.min(scaleX, scaleY);

    myCanvas.style.transformOrigin = "50% 0 0"; //scale from top left
    myCanvas.style.transform = "translateX(" + (innerWidth / 2 - canvas.width / 2).toString() + "px) scale("+ scaleToFit.toString() + ")";
}

sizeCanvas();
addEventListener("resize", sizeCanvas);

var mainMenu = new MainMenu();
var inGame = new InGame();
var scene = mainMenu;

var particleManager = new ParticleManager();

var highScores = new HighScores();
highScores.load();

main();

function main() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    scene.rendering();
    particleManager.apply();
    
    scene.handleEvents();

    requestAnimFrame(main);
}
