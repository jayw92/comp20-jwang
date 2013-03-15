// Set up variables for game
function setup_params() {
   level = 1;
   cur_score = 0;
   highscore = 0;
   frog_x = 180;
   frog_y = 465;
   lives = 3;
   game_over = false;
   time_left = 300; //seconds
   time_left_ms = 0;
   fps_ms = 25;

   // Log locations
   log_loc = [0, 150, -5, 250, 30];
   // Log spaces
   logspace = [300,250,150,300,250];
   // Log speeds
   logspeed = [2, 2.8, 1.5, 2, 3.1];

   // Car locations
   car_loc = [60, 200, 200, 250, 100];
   // Log spaces
   carspace = [130,160,190,100,150];
   // Car speeds
   carspeed = [2.1, 1.6, 2.6, 1.9, 2.3];
}

function start_game() {
   canvas = document.getElementById('game');

   // Check if canvas is supported on browser
   if (canvas.getContext) {
      setup_params();
      ctx = canvas.getContext('2d');

      // Game starts
      gameloop = self.setInterval(function(){
         gameLoop()
      },fps_ms);
   }
   else {
      alert('Sorry, canvas is not supported on your browser!');
   }
}

// interval set
function gameLoop(){
   // See if a second has passed
   time_left_ms = time_left_ms + fps_ms;
   if (time_left_ms >= 1000){
      time_left--;
      time_left_ms = 0;
   }

   // Store the current transformation matrix for redraw
   ctx.save();
   ctx.setTransform(1, 0, 0, 1, 0, 0);
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   // Restore
   ctx.restore();

   ctx.fillStyle = "#191970";
   ctx.fillRect(0, 0, 399, 274);
   ctx.fillStyle = "#000000";
   ctx.fillRect(0, 280, 399, 290);
   ctx.fillStyle = "#27f404";

   img = new Image();
   img.src = 'assets/frogger_sprites.png';

   ctx.drawImage(img,0,0,399,110,0,0,399,110); //frogger and gates
   ctx.drawImage(img,0,119,399,34,0,273,399,34); //purple sides
   ctx.drawImage(img,0,119,399,34,0,460,399,34); //purple sides 2
   ctx.font="20px Georgia";

   // Information for the player
   ctx.fillText("Level: " + level,100,517);
   ctx.fillText("Time: " + time_left,230,517);
   ctx.fillText("Score: " + cur_score,0,537);
   ctx.fillText("Highscore: " + highscore,0,557);

   // For frog score
   if (lives >= 1){
      ctx.drawImage(img,11,334,20,23,0,500,14,17);
      if (lives >= 2){
         ctx.drawImage(img,11,334,20,23,16,500,14,17);
      }
      if (lives == 3){
         ctx.drawImage(img,11,334,20,23,32,500,14,17);
      }
   }

   //---------------------------------------------------------------------------
   // Log animation speeds
   log_loc[0] = log_loc[0]+logspeed[0];
   log_loc[1] = log_loc[1]-logspeed[1];
   log_loc[2] = log_loc[2]+logspeed[2];
   log_loc[3] = log_loc[3]-logspeed[3];
   log_loc[4] = log_loc[4]+logspeed[4];

   // Log lanes in order
   ctx.drawImage(img,0,166,190,21,log_loc[0]-logspace[0],113,190,21);
   ctx.drawImage(img,0,166,190,21,log_loc[0],113,190,21);
   ctx.drawImage(img,0,166,190,21,log_loc[0]+logspace[0],113,190,21);
   if (2*logspace[0]-log_loc[0] < logspace[0]){
      log_loc[0] = 0;
   }

   ctx.drawImage(img,0,198,130,21,log_loc[1]-logspace[1],147,130,21);
   ctx.drawImage(img,0,198,130,21,log_loc[1],147,130,21);
   ctx.drawImage(img,0,198,130,21,log_loc[1]+logspace[1],147,130,21);
   ctx.drawImage(img,0,198,130,21,log_loc[1]+logspace[1]*2,147,130,21);
   if (logspace[1]-log_loc[1] > logspace[1]*2){
      log_loc[1] = 0;
   }

   ctx.drawImage(img,0,230,100,21,log_loc[2]-logspace[2],181,100,21);
   ctx.drawImage(img,0,230,100,21,log_loc[2],181,100,21);
   ctx.drawImage(img,0,230,100,21,log_loc[2]+logspace[2],181,100,21);
   ctx.drawImage(img,0,230,100,21,log_loc[2]+logspace[2]*2,181,100,21);
   if (2*logspace[2]-log_loc[2] < logspace[2]){
      log_loc[2] = 0;
   }

   ctx.drawImage(img,0,166,190,21,log_loc[3]-logspace[3],215,190,21);
   ctx.drawImage(img,0,166,190,21,log_loc[3],215,190,21);
   ctx.drawImage(img,0,166,190,21,log_loc[3]+logspace[3],215,190,21);
   ctx.drawImage(img,0,166,190,21,log_loc[3]+logspace[3]*2,215,190,21);
   if (logspace[3]-log_loc[3] > logspace[3]*2){
      log_loc[3] = 0;
   }

   ctx.drawImage(img,0,198,130,21,log_loc[4]-logspace[4],249,130,21);
   ctx.drawImage(img,0,198,130,21,log_loc[4],249,130,21);
   ctx.drawImage(img,0,198,130,21,log_loc[4]+logspace[4],249,130,21);
   if (2*logspace[4]-log_loc[4] < logspace[4]){
      log_loc[4] = 0;
   }
   //-----------------------------------------------------------------------------
   // CAR DRAWING
   car_loc[0] = car_loc[0]+carspeed[0];
   car_loc[1] = car_loc[1]-carspeed[1];
   car_loc[2] = car_loc[2]+carspeed[2];
   car_loc[3] = car_loc[3]-carspeed[3];
   car_loc[4] = car_loc[4]+carspeed[4];

   // Car lanes in order
   ctx.drawImage(img,5,265,35,21,car_loc[0]-carspace[0],310,35,21);
   ctx.drawImage(img,5,265,35,21,car_loc[0],310,35,21);
   ctx.drawImage(img,5,265,35,21,car_loc[0]+carspace[0],310,35,21);
   ctx.drawImage(img,5,265,35,21,car_loc[0]+2*carspace[0],310,35,21);
   if (2*carspace[0]-car_loc[0] < carspace[0]){
      car_loc[0] = 0;
   }

   ctx.drawImage(img,104,302,54,21,car_loc[1]-carspace[1],340,54,21);
   ctx.drawImage(img,104,302,54,21,car_loc[1],340,54,21);
   ctx.drawImage(img,104,302,54,21,car_loc[1]+carspace[1],340,54,21);
   ctx.drawImage(img,104,302,54,21,car_loc[1]+2*carspace[1],340,54,21);
   ctx.drawImage(img,104,302,54,21,car_loc[1]+3*carspace[1],340,54,21);
   if (carspace[1]-car_loc[1] > carspace[1]*2){
      car_loc[1] = 0;
   }

   ctx.drawImage(img,42,264,32,24,car_loc[2]-carspace[2],370,32,24);
   ctx.drawImage(img,42,264,32,24,car_loc[2]-2*carspace[2],370,32,24);
   ctx.drawImage(img,42,264,32,24,car_loc[2],370,32,24);
   ctx.drawImage(img,42,264,32,24,car_loc[2]+carspace[2],370,32,24);
   ctx.drawImage(img,42,264,32,24,car_loc[2]+2*carspace[2],370,32,24);
   if (2*carspace[2]-car_loc[2] < carspace[2]){
      car_loc[2] = 0;
   }

   ctx.drawImage(img,80,264,32,24,car_loc[3]-2*carspace[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3]-carspace[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3]+carspace[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3]+2*carspace[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3]+3*carspace[3],400,32,24);
   ctx.drawImage(img,80,264,32,24,car_loc[3]+4*carspace[3],400,32,24);
   if (carspace[3]-car_loc[3] > carspace[3]*2){
      car_loc[3] = 0;
   }

   ctx.drawImage(img,5,300,32,22,car_loc[4]-2*carspace[4],430,32,22);
   ctx.drawImage(img,5,300,32,22,car_loc[4]-carspace[4],430,32,22);
   ctx.drawImage(img,5,300,32,22,car_loc[4],430,32,22);
   ctx.drawImage(img,5,300,32,22,car_loc[4]+carspace[4],430,32,22);
   ctx.drawImage(img,5,300,32,22,car_loc[4]+2*carspace[4],430,32,22);
   if (2*carspace[4]-car_loc[4] < carspace[4]){
      car_loc[4] = 0;
   }

   //-----------------------------------------------------------------------------

   // Draw frog
   ctx.drawImage(img,11,368,23,20,frog_x,frog_y,23,20);

}