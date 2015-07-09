var
  STAGE_LANDING = 0,
  STAGE_INPUTNAME = 1,
  STAGE_WAITING = 2,
  STAGE_READY = 3,
  STAGE_PLAYING = 4,
  STAGE_WAITINGFINISH = 5,
  STAGE_OVER = 6,
  STAGE_RANKING = 7;

var 
  INPUT_WAITING = 0
  INPUT_COMPANYNAME = 1,
  INPUT_PLAYONENAME = 2,
  INPUT_PLAYTWONAME = 3;

var rootRef = new Firebase('https://multiplayersgg.firebaseio.com/multiplayer');
var databaseRef = new Firebase('https://multiplayersgg.firebaseio.com/ranking');
var HOST = "http://wechat-test.lucki.cn";
var ranking = [];

var ps = [];

function r(name) {
  return 'gg/data/' + name;
}

var resource = {},
  sound = {};


// ---------------------------------------------------------------------------
// Game Objects
// ---------------------------------------------------------------------------
var game = {
    stage: STAGE_LANDING,
    inputStage: INPUT_COMPANYNAME,
    stages: {
      0: {

      },
      1: {

        company:"",
        name:"",
        score:0,
        date:0

      },
      2: {
        opacity: 255,
        opacityIncr: 10
      },

      3: {
        startsAt: 0,
        fontSize: 0
      },

      4: {
        startsAt: 0,
        aiTask: null
      },

      5: {
        startsAt: 0,
      },

      6: {
        startsAt: 0
      },

      7: {
        startsAt: 0
      }
    },
    bgmOffset: 0,

    xt: 1000,
    yt: 1000,

    milkCount: 0,
    coffeeCount: 0,
    inputBuffer:"",
    differBufferSize: 20,
    differBuffer:[],
    companyName:"",
    playerOneName:"",
    playerTwoName:"",
    player1InputStartsAt: 0,
    player2InputStartsAt: 0,

    //--------------------
    //online player
    //--------------------
    onlinePlayers:"",
    list: [],
    opponent:"",
    opponentRealtimeScore:0,
    opponentFinish: false,
    onRef:{},
    playerOneStoredScore: 0
    
    
  };

game.initBuffer = function() {
  for(var i = 0; i < this.differBufferSize; i++){
    this.differBuffer.push(0);
  }
}

game.getDiff = function() {

  this.differBuffer.splice(0, 1);
  this.differBuffer.push(this.milkCount - this.coffeeCount);
  var sum = 0;
  for(var i = 0; i < this.differBuffer.length; i++){
    sum += this.differBuffer[i];
  }

  return sum/this.differBufferSize;
};

game.getMilkNum = function() {
  return this.milkCount;
};

game.getCoffeeNum = function() {
  return this.coffeeCount;
};

game.incrMilkNum = function() {
  addOne(random(width/6, width/3), height / 2);
  this.milkCount += 1;
};

game.incrCoffeeNum = function() {
  addOne(random(2*width/3, 5*width/6), height / 2);
  this.coffeeCount += 1;
};

game.stageWaiting = function() {
  this.stage = STAGE_WAITING;
  this.xt = this.yt = 1000;
  console.log(game.onlinePlayers);

};

game.getRankingNumber = function(objs) {
  var count = 0;

  for(var prop in objs) {
    if(objs.hasOwnProperty(prop))
    ++count;
  }
  return count;
};
game.stageLanding = function() {
  this.stage = STAGE_LANDING;
};
game.stageInputName = function() {
  this.stage = STAGE_INPUTNAME;
  
};

game.stageReady = function() {
  this.stage = STAGE_READY;
  this.stages[STAGE_READY].startsAt = millis();
  this.stages[STAGE_READY].fontSize = 0;
  this.milkCount = 0;
  this.coffeeCount = 0;
  rootRef.off('value', game.onRef);

  if(resource.bgm.isPlaying()){
    resource.bgm.stop();
  }
  if(!resource.readyGo.isPlaying()){
    resource.readyGo.play();
  }

};

game.stagePlaying = function() {
  this.stage = STAGE_PLAYING;
  this.stages[STAGE_PLAYING].startsAt = millis();


  if(resource.readyGo.isPlaying()){
    resource.readyGo.stop();
  }

  resource.battle.play();

  // spawn AI
  //window.clearInterval(this.stages[STAGE_PLAYING].aiTask);
/*  this.stages[STAGE_PLAYING].aiTask = window.setInterval(function() {
    var times = random(0, 2);
    for (var i = 0; i < times; i++) {
      game.incrCoffeeNum();
    }
  }, 500);*/
};

game.stageWaitingFinish = function(){
  this.stage = STAGE_WAITINGFINISH;
  this.stages[STAGE_WAITINGFINISH].startsAt = millis();

};

game.stageRanking = function() {
  this.stage = STAGE_RANKING;
  this.stages[STAGE_RANKING].startsAt = millis();
  
  //window.clearInterval(this.stages[STAGE_PLAYING].aiTask);
  
}

game.stageOver = function() {
  this.stage = STAGE_OVER;
  this.stages[STAGE_OVER].startsAt = millis();


  //window.clearInterval(this.stages[STAGE_PLAYING].aiTask);

  //console.log("player 1 score" + playerOneStoredScore);
  //console.log("player 2 score" + playerTwoStoredScore);
  console.log("this.milkCount " + this.milkCount + "stored score" + this.playerOneStoredScore)
  if(this.milkCount > game.playerOneStoredScore){
    this.uploadData(this.playerOneName, this.milkCount);
  }
  
/*  if(this.coffeeCount > playerTwoStoredScore){
    this.uploadData(this.playerTwoName, this.coffeeCount);
  }
  */
  
  if(resource.battle.isPlaying()){
    resource.battle.stop();
  }
  if(!resource.bgm.isPlaying()){
    resource.bgm.play();
  }
  var selfRef = rootRef.child(game.playerOneName);
  selfRef.remove();
  
};

game.draw = function() {
  if(this.stage === STAGE_LANDING) {
    this.drawLanding();
  }else if(this.stage === STAGE_INPUTNAME) {
    this.drawInputName();
  }else if (this.stage === STAGE_READY) {
    this.drawReady();
  } else if (this.stage === STAGE_PLAYING) {
    this.drawPlaying();
  } else if(this.stage === STAGE_WAITINGFINISH){
    this.drawWaitingFinish();
  } else if (this.stage === STAGE_RANKING) {
    this.drawRanking();
  } else if (this.stage === STAGE_OVER) {
    this.drawOver();
  } else {  // STAGE_WAITING & unknown stage
    this.drawWaiting();
  }
};

game.checkPlayer = function(playername){
  game.playerOneStoredScore = 0;
  databaseRef.orderByChild("name").equalTo(playername).once("value", function(snapshot){
    var message = snapshot.val();
    if(message === null){
      console.log("user does not exist");
    }
    else{
      console.log("user exists");
      game.playerOneStoredScore = message[playername].score;
      console.log(message);
    }

  });
}

game.uploadData = function(playername, playerscore) {
  
  //update player one score to the server
  var currentMessageRef = databaseRef.child(playername);
  currentMessageRef.setWithPriority({name: playername, score: playerscore, date: Date.now()}, playerscore);
  //upgate player two score to the server
            
}

game.gameInit = function(playername){
  var playersRef = rootRef.child(playername);
  playersRef.child("online").set("true");
  playersRef.child("name").set(playername);
  playersRef.child("time").set(Date.now());
  game.onRef = rootRef.orderByChild('time').limitToLast(5).on('value', function(snapshot){
    var msg = snapshot.val();
    game.onlinePlayers = msg;
    console.log(msg);
  });
  playersRef.onDisconnect().remove();
}

game.gameUpdateScore = function(score){
  
}
game.drawLanding = function() {
  imageMode(CENTER);
  fill('#F7B52C');
  rect(0, 0, width, height);
  var ratio = resource.bg.height / height;
  image(resource.bg, width/2, height/2, resource.bg.width / ratio, resource.bg.height / ratio );
  for(var i = 0; i < ps.length; i++){
    var p = ps[i];
    p.update();
    p.display();
    p.setEmitter(createVector(width/2, height/2));

  }
}


game.drawInputName = function() {

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  if(game.inputStage === INPUT_WAITING){
    text("Enter your company name: ", width / 2, height / 5);
    text(game.inputBuffer, width/2, height/3);
  } else if(game.inputStage === INPUT_COMPANYNAME) {
    text("P1 your name please: ", width / 4, height / 5);
    text(game.inputBuffer, width/4, height/3);
    
  } else if(game.inputStage === INPUT_PLAYONENAME) {
    text("P2 your name please: ", width / 4 * 3, height / 5);
    fill('#fa005c');
    text(game.playerOneName, width  / 4, height / 3);
    fill(255);
    text(game.inputBuffer, width/4*3, height / 3);
  } else {
    game.stage = STAGE_WAITING;
  }
  

  

}

function keyPressed() {
  if(game.stage === STAGE_INPUTNAME){
    if((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z' || key === ' ')){
      game.inputBuffer += key;
    }

    if(keyCode === ENTER && game.inputStage === INPUT_WAITING && game.inputBuffer != ""){

      game.companyName = game.inputBuffer;
      createCompany(game.companyName);
      //setupDatabase();
      game.inputBuffer= "";
      game.inputStage = INPUT_COMPANYNAME;

    }else if(keyCode === ENTER && game.inputStage === INPUT_COMPANYNAME && game.inputBuffer != ""){

      game.playerOneName = game.inputBuffer;
      game.gameInit(game.playerOneName);
      setupDatabase();
      game.checkPlayer(game.playerOneName);
      game.inputBuffer = "";
      game.inputStage = INPUT_PLAYTWONAME;

    }else if(keyCode === ENTER && game.inputStage === INPUT_PLAYONENAME && game.inputBuffer != ""){

      game.playerTwoName = game.inputBuffer;
      game.inputBuffer = "";
      game.inputStage = INPUT_PLAYTWONAME;

    }else if(keyCode === LEFT_ARROW){
        game.inputBuffer = "";
    }

  }

  if(game.stage === STAGE_LANDING && keyCode === ENTER){
    game.stageInputName();
  }

  if(game.stage === STAGE_WAITING || game.stage === STAGE_PLAYING){
    if(key === '1'){
      player1GripInput();
    }
    if(key === '2'){
      player2GripInput();
    }
  }

  if(game.stage === STAGE_RANKING){
    if(keyCode === ENTER){
      game.inputStage = INPUT_COMPANYNAME;
      game.stageInputName();
    }
  }
}

function touchStarted() {
  console.log(touchX + " "+ touchY);
  var boxSize = width/10;
  if(game.stage === STAGE_WAITING){

    for(var i = 0; i < game.list.length; i++){
      var x = game.list[i].positionX;
      var y = game.list[i].positionY;
      console.log(game.list[i].name + game.list[i].positionX + game.list[i].positionY);
      if(touchX > (x - boxSize) && touchX < (x+boxSize) && touchY > (y - boxSize) && touchY < (y+boxSize)){
        console.log("touch: you " + game.list[i].name);
        //connect to opponent when game is initialized me
        game.connectToPlayer(game.playerOneName, game.list[i].name);

        game.stageReady();

      }
    }
  }
}

game.connectToPlayer = function(self, opponent){

  var selfRef = rootRef.child(self);
  var opponentRef = rootRef.child(opponent);

  selfRef.child("online").set("false");
  selfRef.child("opponent").set(opponent);
  opponentRef.child("online").set("false");
  opponentRef.child("opponent").set(self);
  game.opponent = opponent;

/*  opponentRef.child("dataPush").on("child_added", function(snapshot){
    var msg = snapshot.val();
    console.log(msg);

    //player2GripInput();

  });*/

  opponentRef.child("finish").on("child_added", function(snapshot){
    game.opponentFinish = true;
  });

  opponentRef.child("score").on("value", function(snapshot){
    var msg = snapshot.val();
    if(msg != null){
      game.opponentRealtimeScore = snapshot.val();
      console.log(msg);
    }
    


    if(game.coffeeCount < game.opponentRealtimeScore){
      if(game.coffeeCount + 1 === game.opponentRealtimeScore ){
        player2GripInput();
      }
      else if(game.coffeeCount <= game.opponentRealtimeScore + 2){
        player2GripInput();
        player2GripInput();

      }
      
    }
    

  });



}


game.drawWaiting = function() {
  this.stages[STAGE_WAITING].opacity += this.stages[STAGE_WAITING].opacityIncr;
  var opacity = this.stages[STAGE_WAITING].opacity;
  fill(255, 255, 255, opacity);
  if (opacity > 255 || opacity <= 0) {
    this.stages[STAGE_WAITING].opacityIncr *= -1;
  }

  textSize(50);
  textAlign(CENTER, CENTER);
  text("Grip together to start...", width / 2, height * 3 / 4);

  if (! resource.bgm.isPlaying()) {
    resource.bgm.play();
  }
  textSize(50);
  fill('#fa005c');
  text("Online player list", width/2, height/7);
  //text(game.playerOneName, width/4, height/3);
  //fill('#ffc903');
  //text(game.playerTwoName, width*3/4, height/3);

  var i =0;
  game.list = [];
  for(var k in game.onlinePlayers){
    if(!(game.playerOneName === game.onlinePlayers[k].name) && game.onlinePlayers[k].online === "true"){
      i++;
      textSize(50);
      fill('#fa005c');
      var x = width/2,
        y = height*(i+1)/7
      game.list.push({"name":k, "positionX": x*2, "positionY":y*2});
      text(game.onlinePlayers[k].name, x, y);
    }

    if(game.onlinePlayers[k].opponent === game.playerOneName){
      
      game.opponent = game.onlinePlayers[k].name;
      var opponentRef = rootRef.child(game.opponent);

      //initialize game when opponent start the game

      opponentRef.child("score").on("value", function(snapshot){
        var msg = snapshot.val();

        if(msg != null){
          game.opponentRealtimeScore = snapshot.val();
          console.log(msg);
        }

        if(game.coffeeCount < msg){
          if(game.coffeeCount + 1 === msg ){
            player2GripInput();
          }
          else if(game.coffeeCount <= msg + 2){
            player2GripInput();
            player2GripInput();

          }
          
        }

      });

      game.stageReady();
      break;
    }
  }
};

game.drawReady = function() {
  var current = millis();
  if (current - this.stages[STAGE_READY].startsAt >= 3000) {
    this.stagePlaying();
    return;
  }

  fill(255, 255, 255, 255);
  textSize(this.stages[STAGE_READY].fontSize);
  if (this.stages[STAGE_READY].fontSize <= 122) {
    this.stages[STAGE_READY].fontSize += 2;

    textAlign(CENTER, CENTER);
    text("Ready", width / 2, height / 3);
  } else {
    textAlign(CENTER, CENTER);
    text("Go", width / 2, height / 3);
  }
  textSize(50);
  fill('#fa005c');
  text(game.playerOneName, width/4, height/3);
  fill('#ffc903');
  text(game.opponent, width*3/4, height/3);
};

game.drawPlaying = function() {
  var elapsed = millis() - this.stages[STAGE_PLAYING].startsAt,
    remains = 10 * 2000 - elapsed;

  if(!resource.battle.isPlaying()){
    resource.battle.play();
  }

  if (remains < 0) {
    //game.stageRanking();
    //game.stageOver();
    game.stageWaitingFinish();
    return;
  }
  console.log("realtime score" + game.opponentRealtimeScore);

  fill(255);
  textSize(80);
  textAlign(CENTER, CENTER);
  text(str(nf(remains / 1000, 2, 2)),width / 2, height / 5);

  fill('#fa005c');
  textSize(60);
  textAlign(CENTER, CENTER);
  text(str(this.getMilkNum()),  width/4, height/2);
  text(game.playerOneName, width/4, height/3);
  fill('#ffc903');
  textSize(60);
  textAlign(CENTER, CENTER);
  text(str(this.getCoffeeNum()), width*3/4, height/2);
  text(game.opponent, width*3/4, height/3);
};

game.drawRanking = function() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("RANKING", width/2, height/10);
  for(var i = ranking.length - 1, n = 2; i >= 0; i--, n++){
    text(ranking[i].name, width/2 - 100, (n)*height/10);
    text(str(ranking[i].score), width/2 + 100, (n)*height/10);
    if(n >= 9) break;
  }

};

game.drawWaitingFinish = function() {

  var current = millis();

  if(game.opponentFinish === true){
    game.coffeeCount = game.opponentRealtimeScore;
    this.stageOver();
    return;

  }

  if(current - this.stages[STAGE_WAITINGFINISH].startsAt >= 5000){
    console.log("timeout" + game.opponentFinish + "realtime score" + game.opponentRealtimeScore);
    game.coffeeCount = game.opponentRealtimeScore;
    this.stageOver();
    return;
  }

  this.stages[STAGE_WAITINGFINISH].opacity += this.stages[STAGE_WAITINGFINISH].opacityIncr;
  var opacity = this.stages[STAGE_WAITINGFINISH].opacity;
  fill(255, 255, 255, opacity);
  if (opacity > 255 || opacity <= 0) {
    this.stages[STAGE_WAITINGFINISH].opacityIncr *= -1;
  }
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("WAITING...", width / 2, height * 3 / 4);

}

game.drawOver = function() {
  var current = millis();
  if (current - this.stages[STAGE_OVER].startsAt >= 10000) {
    this.stageRanking();
    
    return;
  }
  
  textSize(60);
  textAlign(CENTER, CENTER);
  fill(2, 237, 176, 255);

  if ((this.milkCount - this.coffeeCount) > 0) {
    text("WIN", width / 4, height  / 5);
  } else if ((this.milkCount - this.coffeeCount) < 0) {
    text("WIN", width / 4 * 3, height / 5);
  } else {
    text("DRAW", width / 2, height  / 5);
  }

  fill('#fa005c');
  textSize(60);
  textAlign(CENTER, CENTER);
  text(str(this.getMilkNum()),  width/4, height/2);
  text(game.playerOneName, width/4, height/3);
  fill('#ffc903');
  textSize(60);
  textAlign(CENTER, CENTER);
  text(str(this.getCoffeeNum()), width*3/4, height/2);
  text(game.opponent, width*3/4, height/3);
  
};

var PlusOne = function(px, py) {
  this.position = createVector(px, py);
  this.velocity = createVector(0, -4);
  this.acceleration = createVector(0, 0);
  this.lifespan = 255.0;
};

PlusOne.prototype.update = function() {
  this.position.add(this.velocity);
  this.lifespan = this.lifespan - 10;
  return this;
};

PlusOne.prototype.draw = function() {
  if(this.position.x <= width / 2) {
    fill(250, 0, 92, this.lifespan);
  } else {
    fill(250, 201, 3, this.lifespan);
  }

  textSize(40);
  textAlign(CENTER, CENTER);
  text('+1', this.position.x, this.position.y);
};

PlusOne.prototype.isDead = function() {
  return (this.lifespan <= 0);
};

var onesPool = [];

function addOne(px, py) {
  onesPool.push(new PlusOne(px, py));
}

// ---------------------------------------------------------------------------
// Preload
// ---------------------------------------------------------------------------

function preload() {
  preloadResource();
}

function preloadResource() {
  resource = {
    'bgm': loadSound(r('bgm.mp3')),
    'battle': loadSound(r('battle.mp3')),
    'readyGo': loadSound(r('readygo.mp3')),
    'myFont': loadFont(r('Showcard_Gothic.ttf')),
    'bg' : loadImage(r('fight-03.png')),
    'spark' : loadImage(r('blackhole.png'))
  };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

function setup() {
  
  setupCanvas();
  setupSound();
  //setupDatabase();
  
  game.initBuffer();
  ps.push(new ParticleSystem(40, width/2, height/2));
}

function setupCanvas() {
  createCanvas(window.innerWidth/2, window.innerHeight/2);
  frameRate(30);
  noStroke();
  textFont(resource.myFont);
}

function setupSound() {
  resource.bgm.loop();
  if(!resource.bgm.isPlaying()){
    resource.bgm.play();
  }
  

  sound = {
    'ampBgm': new p5.Amplitude(),
    'ampBattle': new p5.Amplitude(),
    'ampReadyGo': new p5.Amplitude()
  };
}

function setupDatabase() {
  //rootRef.orderByChild("score").on('value', function(snapshot){
    databaseRef.orderByChild("score").limitToLast(8).on('value', function(snapshot){
    var message = snapshot.val();

    console.log(JSON.stringify(message));
    ranking = [];

    for (var msg in message){

       console.log(message[msg].name + ' ' + message[msg].score);
       ranking.push(message[msg]);
       
    };

    console.log(ranking);

    
  });
}
// ---------------------------------------------------------------------------
// Draw
// ---------------------------------------------------------------------------
// function touchInput(){
//   if(touchIsDown  && game.stage === STAGE_WAITING)
//   game.stageReady();

//   if(game.stage === STAGE_PLAYING && touchIsDown){
//       game.incrMilkNum();
//   }
//   if(game.stage === STAGE_RANKING && touchIsDown){
//       game.stageInputName();
//   }
// }
function player1GripInput(){
  game.player1InputStartsAt = millis();
  if(game.stage === STAGE_WAITING && (abs(game.player1InputStartsAt - game.player2InputStartsAt) < 300)){
      game.stageReady();
  }
  if(game.stage === STAGE_PLAYING || game.stage === STAGE_WAITING){
      game.incrMilkNum();
      var selfRef = rootRef.child(game.playerOneName + "/dataPush");
      selfRef.push(1);
      var scoreRef = rootRef.child(game.playerOneName + "/score");
      scoreRef.set(game.milkCount);
  }
  

}

function player2GripInput(){
  game.player2InputStartsAt = millis();
  if(game.stage === STAGE_WAITING && (abs(game.player1InputStartsAt - game.player2InputStartsAt) < 300)){
    game.stageReady();
  }
  if(game.stage === STAGE_PLAYING || game.stage === STAGE_WAITING){
      game.incrCoffeeNum();
  }
}

function draw() {
  drawSoundEffect();
  //drawEasyEffect();
  drawPlusOne();
  game.draw();
  //touchInput();
}

function drawSoundEffect() {

  var offset,
    interval = 40,
    diff = game.getDiff() * game.differBufferSize;

  game.xt = game.yt;
  for (var i = 0; i < height; i += interval) {
    offset = map(noise(game.xt), 0, 1, -50 + diff, 50 + diff) + width/2;
    if(offset < 0){
      offset = 0;
    }
    //offset = diff;
    //fill(247, 237, 220, 150);
    //fill(247,181,44, 150);//yellow
    fill(37,96,105, 150); //dark blue
    //rect(i, 0,  i + interval, height / 2 + offset, 2);
    rect(0, i, offset, i+interval, 2);
    //fill(116, 83, 30, 150);
    fill(233, 84, 19, 150);//orange
    //fill(162,54,69, 150);//red
    //rect(i, height / 2 + offset, i + interval, height, 2);
    rect(offset, i, width, i+interval, 2);

    game.xt += 0.04;
  }

  game.yt += 0.01;
}

function createCompany(company){
   $.ajax({
      url: HOST + '/betwinepark/company/create/', 
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({'name':company}), 
      contentType: 'application/json',
   }).done(function(resp) {
      console.log(resp);
      if(resp.status === "ok"){
        if(resp.data.created){
          console.log("company ID: " +  resp.data.id + "company name: " + resp.data.name);
        }
        
      }

   });
}

function drawEasyEffect() {
    fill(247, 237, 220, 150);
    rect(0, 0,  width, height / 2 + game.getDiff() * 5, 3);

    fill(116, 83, 30, 150);
    rect(0, height / 2 + game.getDiff() * 5, width, height, 3);
}
function drawPlusOne() {
  var pool = [];

  onesPool.forEach(function(one) {
    one.update().draw();

    if (! one.isDead()) {
      pool.push(one);
    }
  });

  onesPool = pool;
}