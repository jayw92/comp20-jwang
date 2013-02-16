// Your work goes here...
function setup_params() {
level = 1;
cur_score = 0;
highscore = 0;
frog_x = 180;
frog_y = 465;
lives = 3;
game_over = false;
time_left = 300; //seconds

//log locations
log1 = 60;
log2 = 150;
log3 = -5;
log4 = 250;
log5 = 30;

//log speeds
log_speed1 = 2;
log_speed2 = 3;
log_speed3 = 1;
log_speed4 = 4;
log_speed5 = 2;

//car locations
car1 = 60;
car2 = 150;
car3 = 10;
car4 = 340;
car5 = 288;

//car speeds
car_speed1 = 2;
car_speed2 = 3;
car_speed3 = 1;
car_speed4 = 3;
car_speed5 = 2;

//more params can be added
}
function start_game() {
setup_params();
canvas = document.getElementById('game');
// Check if canvas is supported on browser
if (canvas.getContext) {
ctx = canvas.getContext('2d');
ctx.fillStyle = "#191970";
ctx.fillRect(0, 0, 399, 274);
ctx.fillStyle = "#000000";
ctx.fillRect(0, 280, 399, 290);
ctx.fillStyle = "#27f404";
ctx.font="20px Georgia";

//information for the player
ctx.fillText("Level: " + level,100,517);
ctx.fillText("Score: " + cur_score,0,537);
ctx.fillText("Highscore: " + highscore,0,557);

img = new Image();
img.src = 'assets/frogger_sprites.png';
ctx.drawImage(img,0,0,399,110,0,0,399,110); //frogger and gates
ctx.drawImage(img,0,119,399,34,0,273,399,34); //purple sides
ctx.drawImage(img,0,119,399,34,0,460,399,34); //purple sides 2

//logs in order
ctx.drawImage(img,0,166,190,21,log1,113,190,21);
ctx.drawImage(img,0,198,130,21,log2,147,130,21);
ctx.drawImage(img,0,230,100,21,log3,181,100,21);
ctx.drawImage(img,0,166,190,21,log4,215,190,21);
ctx.drawImage(img,0,198,130,21,log5,249,130,21);

//cars in order
ctx.drawImage(img,5,265,35,21,car1,310,35,21);
ctx.drawImage(img,104,302,54,21,car2,340,54,21); //truck
ctx.drawImage(img,42,264,32,24,car3,370,32,24);
ctx.drawImage(img,80,264,32,24,car4,400,32,24);
ctx.drawImage(img,5,300,32,22,car5,430,32,22);

//for frog score
if (lives >= 1){
   ctx.drawImage(img,11,334,20,23,0,500,14,17);
   if (lives >= 2){
   ctx.drawImage(img,11,334,20,23,16,500,14,17);
   }
   if (lives == 3){
   ctx.drawImage(img,11,334,20,23,32,500,14,17);
   }
}

ctx.drawImage(img,11,368,23,20,frog_x,frog_y,23,20);
}
else {
alert('Sorry, canvas is not supported on your browser!');
}
}