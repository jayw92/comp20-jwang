// Set up variables for game
function setup_params() {
   level = 1;
   cur_score = 0;
   highscore = 0;
   lives = 5;
   fps_ms = 25; // ms interval for gameLoop()

   //Scoring
   jumps_forward = 0; // Successfully jumping Frogger forward: 10 points
   jumps_home = 0; // Successfully jumping Frogger home: 50 points
   jumps_home5 = 0; // Successfully jumping 5 frogs home: 1000 points

   // Lane Y positions for frog starting from bottom
   lanes = [465, 430, 400, 370, 340, 310, 276, 249, 215, 181, 147, 113, 80];

   // Gate Locations
   gates = [12,97,182,265,352];
   gate_width = 30;
   gate_success = [false,false,false,false,false];

   // Log locations
   log_loc = [0, 150, -5, 250, 30];
   // Log spaces
   logspace = [300,250,150,300,250];
   // Log speeds
   logspeed = [1.4, -2.2, 1.2, -2.4, 2.3];
   // Log locations in association list
   log_x = {
      '0':[],
      '1':[],
      '2':[],
      '3':[],
      '4':[]
   };
   // Log widths
   log_w = [180, 120, 87, 180, 120];

   // Car locations
   car_loc = [60, 200, 200, 250, 100];
   // Log spaces
   carspace = [130,160,190,100,150];
   // Car speeds
   carspeed = [2.0, -1.6, 2.2, -1.4, 2.2];
   // Car locations in association list
   car_x = {
      '0':[],
      '1':[],
      '2':[],
      '3':[],
      '4':[]
   };
   // Car widths
   car_w = [35, 54, 32, 32, 32];
}

function setupFrog(){
   // Frog vars
   frog_x = 180;
   frog_y = 465;
   frog_x_jump = 17;
   frog_dir = 0;  // 0 = facing up, 1 = down, 2 = left, 3 = right
   on_log = false;
   safe = true;
   frog_width = 23;
   cur_lane = 0;
   time_left = 300; // seconds
   time_left_ms = 0; // ms counter
   lane_visited = [true,false,false,false,false,false,false,false,false,false,false,false,false,false];
}

function start_game() {
   canvas = document.getElementById('game');

   // Check if canvas is supported on browser
   if (canvas.getContext) {
      setup_params();
      setupFrog();
      ctx = canvas.getContext('2d');

      // Sprite sheets
      img = new Image();
      img.src = 'assets/frogger_sprites.png';
      img2 = new Image();
      img2.src = 'assets/dead_frog.png';

      // Game starts
      gameloop = self.setInterval(function(){
         gameLoop()
      },fps_ms);

      // Game keys
      document.addEventListener("keydown", function(event) {
         // LEFT ARROW
         if (event.keyCode == 37) {
            event.preventDefault();
            frog_dir = 2;
            frog_x = frog_x - frog_x_jump;
            if (frog_x-frog_x_jump < 0)
               frog_x = 0;
         }
         // UP ARROW
         if (event.keyCode == 38) {
            event.preventDefault();
            frog_dir = 0;
            cur_lane++;
            frog_y = lanes[cur_lane];
         }
         // RIGHT ARROW
         if (event.keyCode == 39) {
            event.preventDefault();
            frog_dir = 3;
            frog_x = frog_x + frog_x_jump;
            if (frog_x+frog_x_jump > 399)
               frog_x = 399-frog_width;
         }
         // DOWN ARROW
         if (event.keyCode == 40) {
            event.preventDefault();
            frog_dir = 1;
            cur_lane--;
            if (cur_lane < 0)
               cur_lane = 0;
            frog_y = lanes[cur_lane];
         }
      });
   }
   else {
      alert('Sorry, canvas is not supported on your browser!');
   }
}

// Frog is safe or not
function collision(){
   on_log = false;
   key = ''+(11-cur_lane);

   // Frog on log cases
   if (cur_lane >= 7 && cur_lane <= 11){
      for (z in log_x[key]){
         if (frog_x >= log_x[key][z] && frog_x <= log_x[key][z]+ log_w[11-cur_lane]){
            on_log = true;
         }
      }
      if (frog_x+frog_width>399 || on_log == false){
         safe = false;
      }
   }

   // Frog on road cases
   key = ''+(5-cur_lane);
   if (cur_lane >= 1 && cur_lane <= 5){
      for (z in car_x[key]){
         if ((frog_x >= car_x[key][z] && frog_x <= car_x[key][z]+ car_w[5-cur_lane]) ||
		(frog_x + frog_width >= car_x[key][z] && frog_x + frog_width <= car_x[key][z]+ car_w[5-cur_lane])){
            safe = false;
         }
      }
   }

   // Frog reaches home lane
   if (cur_lane == 12){
      safe = false;
      for (z in gates){
         if (frog_x >= gates[z] && frog_x + frog_width <= gates[z]+ gate_width && gate_success[z] == false){
            gate_success[z] = true;
            jumps_home++;
            if (jumps_home%5 == 0){
               jumps_home5++;
               next_lvl();
            }
            else{
               setupFrog();
            }
         }
      }
   }

   // Check for lives left
   if (safe == false || time_left == 0){
      // Kill a frog
      lives--;

      setupFrog();

      // No frogs left
      if (lives == 0){
         game_over();
      }
   }
}

// Go to next level and makes it harder by +/-0.2 speed
function next_lvl(){
   level++;
   gate_success = [false,false,false,false,false];
   setupFrog();
   if (lives<5){
      lives++;
   }
   for (v in logspeed){
      logspeed[v] = logspeed[v] + (v%2)*(-1)*0.2;
      carspeed[v] = carspeed[v] + (v%2)*(-1)*0.2;
   }
}

function game_over(){
   gameloop=window.clearInterval(gameloop);
}

// Calculate Score
function calc_score(extra){
   if (lane_visited[cur_lane] == false){
      jumps_forward++;
      lane_visited[cur_lane] = true;
   }
   cur_score = 10 * jumps_forward + 50 * jumps_home + 1000 * jumps_home5;
   if (highscore < cur_score){
      highscore = cur_score;
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

   ctx.drawImage(img,0,0,399,110,0,0,399,110); //frogger and gates
   ctx.drawImage(img,0,119,399,34,0,273,399,34); //purple sides
   ctx.drawImage(img,0,119,399,34,0,460,399,34); //purple sides 2
   ctx.font="20px Georgia";

   // LOCATION UPDATES
   for (x = 0; x < 5; x++){
      log_loc[x] = log_loc[x]+logspeed[x];
      car_loc[x] = car_loc[x]+carspeed[x];
   }
   // Associative array updates
   for (k = 0; k<5; k++){
      key = ''+k;
      log_x[key] = [log_loc[k]-logspace[k],log_loc[k],log_loc[k]+logspace[k],log_loc[k]+logspace[k]*2];
      car_x[key] = [car_loc[k]-carspace[k]*2,car_loc[k]-carspace[k],car_loc[k],car_loc[k]+carspace[k],car_loc[k]+carspace[k]*2,car_loc[k]+carspace[k]*3,car_loc[k]+carspace[k]*4];
   }

   // Checks for collision and scoring
   collision();
   calc_score(0);

   // Move frog with log
   if (on_log == true){
      frog_x = frog_x + logspeed[11-cur_lane];
   }

   // Information for the player
   ctx.fillText("Level: " + level,100,517);
   ctx.fillText("Time: " + time_left,230,517);
   ctx.fillText("Score: " + cur_score,0,537);
   ctx.fillText("Highscore: " + highscore,0,557);

   // For score drawing
   if (lives >= 1){
      ctx.drawImage(img,11,334,20,23,0,500,14,17);
      if (lives >= 2){
         ctx.drawImage(img,11,334,20,23,16,500,14,17);
      }
      if (lives >= 3){
         ctx.drawImage(img,11,334,20,23,32,500,14,17);
      }
      if (lives >= 4){
         ctx.drawImage(img,11,334,20,23,48,500,14,17);
      }
      if (lives == 5){
         ctx.drawImage(img,11,334,20,23,64,500,14,17);
      }
   }

   // For gate frog drawings
   for (c in gate_success){
      if (gate_success[c] == true){
         ctx.drawImage(img,79,368,frog_width,20,gates[c],lanes[12],frog_width,20);
      }
   }

   //---------------------------------------------------------------------------
   // LOG DRAWING
   // Log lanes in order
   for (y = -1; y<3; y++){
      ctx.drawImage(img,5,166,log_w[0],21,log_loc[0]+y*logspace[0],113,log_w[0],21);
      ctx.drawImage(img,5,198,log_w[4],21,log_loc[4]+y*logspace[4],249,log_w[4],21);
      ctx.drawImage(img,5,198,log_w[1],21,log_loc[1]+y*logspace[1],147,log_w[1],21);
      ctx.drawImage(img,5,230,log_w[2],21,log_loc[2]+y*logspace[2],181,log_w[2],21);
      ctx.drawImage(img,5,166,log_w[3],21,log_loc[3]+y*logspace[3],215,log_w[3],21);
   }
   if (2*logspace[0]-log_loc[0] < logspace[0]){
      log_loc[0] = 0;
   }
   if (logspace[1]-log_loc[1] > logspace[1]*2){
      log_loc[1] = 0;
   }
   if (2*logspace[2]-log_loc[2] < logspace[2]){
      log_loc[2] = 0;
   }
   if (logspace[3]-log_loc[3] > logspace[3]*2){
      log_loc[3] = 0;
   }
   if (2*logspace[4]-log_loc[4] < logspace[4]){
      log_loc[4] = 0;
   }
   //-----------------------------------------------------------------------------
   // CAR DRAWING
   // Car lanes in order
   for (y = -2; y<5; y++){
      ctx.drawImage(img,5,265,car_w[0],21,car_loc[0]+y*carspace[0],310,car_w[0],21);
      ctx.drawImage(img,104,302,car_w[1],21,car_loc[1]+y*carspace[1],340,car_w[1],21);
      ctx.drawImage(img,42,264,car_w[2],24,car_loc[2]+y*carspace[2],370,car_w[2],24);
      ctx.drawImage(img,80,264,car_w[3],24,car_loc[3]+y*carspace[3],400,car_w[3],24);
      ctx.drawImage(img,5,300,car_w[4],22,car_loc[4]+y*carspace[4],430,car_w[4],22);
   }
   if (2*carspace[0]-car_loc[0] < carspace[0]){
      car_loc[0] = 0;
   }
   if (carspace[1]-car_loc[1] > carspace[1]*2){
      car_loc[1] = 0;
   }
   if (2*carspace[2]-car_loc[2] < carspace[2]){
      car_loc[2] = 0;
   }
   if (carspace[3]-car_loc[3] > carspace[3]*2){
      car_loc[3] = 0;
   }
   if (2*carspace[4]-car_loc[4] < carspace[4]){
      car_loc[4] = 0;
   }

   //-----------------------------------------------------------------------------

   // Draw frog with directions
   // UP
   if (frog_dir == 0){
      ctx.drawImage(img,11,368,frog_width,20,frog_x,frog_y,frog_width,20);
   }
   // DOWN
   else if (frog_dir == 1){
      ctx.drawImage(img,79,368,frog_width,20,frog_x,frog_y,frog_width,20);
   }
   // LEFT
   else if (frog_dir == 2){
      ctx.drawImage(img,81,334,frog_width,26,frog_x,frog_y,frog_width,26);
   }
   // RIGHT
   else if (frog_dir == 3){
      ctx.drawImage(img,12,333,frog_width,26,frog_x,frog_y,frog_width,26);
   }


}