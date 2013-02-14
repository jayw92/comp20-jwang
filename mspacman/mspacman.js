function draw() {
canvas = document.getElementById('simple');
// Check if canvas is supported on browser
if (canvas.getContext) {
ctx = canvas.getContext('2d');
img = new Image();
img.src = 'pacman10-hp-sprite.png';
ctx.drawImage(img,322,2,464,135,0,0,464,135);
ctx.drawImage(img,82,2,18,18,50,4,18,18);
ctx.drawImage(img,82,82,18,18,10,4,18,18);
}
else {
alert('Sorry, canvas is not supported on your browser!');
}
}