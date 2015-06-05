var xt ;
var yt;
var interval;
var diffBuffer = [];
var diff = 0;
var milkT = 0;
var coffeeT = 0;
//-----------music----------
var bgm;
var battle;
var readygo;
//--------------------------
//------time constant-------
var TimeCount = false;
var decimalT = 0.0;
var previousT = 0.0;
var time = 10;
var stage = 0;
var ReadyGoFlag = true;
var frontsize = 70;
//--------------------------
//------stage 0 variables---
var opacity0 = 255;
var opacitySetting = 10;
//--------------------------
//stage 1 variables
var milkNum = 0;
var coffeeNum = 0;
var movers = [];
var moverReady;
function setup() {
  createCanvas(800, 400);
  xt = 1000;
  yt = 1000;
  interval = 20;
  initBuffer(diffBuffer, 20);
  moverReady = new Mover(createVector(width, height/2));
  moverReady.velocity = createVector(-20, 0);
  bgm = loadSound('data/bgm.ogg');
  battle = loadSound('data/battle.ogg');
  readygo = loadSound('data/readygo.ogg');
  bgm.loop();
  bgm.play();
  frameRate(30);
  noStroke();
}

function draw() {
  
  drawEffect(pushBuffer(diffBuffer, diff)*10);
  
  //------------stage 0 waiting for user to get ready-----------------
  if(stage === 0){
    displayLandingPage();
  }
  if(stage === 1){
    displayPlusOne();
    countDown(TimeCount);
    if(TimeCount){
      displayMilkNumber();
      displayCoffeeNumber();
    }
    
    displayReadyGo(ReadyGoFlag);
  }
  
  
}

function drawEffect(diff) {
  xt = yt;
  for(var i = 0; i < height; i+=interval){
    var offset = map(noise(xt), 0, 1, -50+diff, 50+diff);
    fill(247,237,220, 150);
    rect(0, i, width/2+offset, i+interval, 4);
    fill(116,83,30, 150);
    rect(width/2+offset, i, width, i+interval, 4);
    xt+=0.04;
  }
  yt+=0.01;
}

function displayReadyGo(flag){
  if(flag){
    moverReady.update();
    //fill("#02EDB0", moverReady.lifespan);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Ready", moverReady.position.x, moverReady.position.y);
  }
}

function keyPressed(){
  if(key == '1'){
    milkNum++;
    diff++;
    milkT = millis();
    movers.push(new Mover(createVector(random(width/6, width/3), height/4)));
  }
  if(key == '2'){
    coffeeNum++;
    diff--;
    coffeeT = millis();
    movers.push(new Mover(createVector(random(2*width/3, 5*width/6), height/4)));
  }
  
  if(abs(milkT - coffeeT) < 300 && !TimeCount){
    stage = 1;
    ReadyGoPlay = true;
    //TimeCount = true;
    previousT = millis();
    reset();
  }
}

function displayReadyGo(flag){
  if(flag){
    currentT = millis();
    if((currentT - previousT) >= 2000){
      TimeCount = true;
      previousT = millis();
      ReadyGoFlag = false;
    }
    if(frontsize <= 100){
      textSize(frontsize);
      fill(255);
      textAlign(CENTER, CENTER);
      text("ready", width/2, height/3);
      frontsize++;
    }
    
    if(frontsize > 100 && ReadyGoFlag){
      textSize(frontsize);
      fill(255);
      textAlign(CENTER, CENTER);
      text("Go", width/2, height/3);
      
    }
    
  }
}

function reset(){
  diff = 0;
  milkNum = 0;
  coffeeNum = 0;
  ReadyGoFlag = true;
  frontsize = 50;
}
function displayLandingPage(){
  fill(2, 237, 176, opacity0);
  if(opacity0 >= 255 || opacity0 <= 0){
    opacitySetting = -opacitySetting;
  }
  opacity0 += opacitySetting;
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Please activate your grip exerciser", width/2, height*3/4);
}

function displayPlusOne(){
  for(var i = 0; i < movers.length; i++){
    var m = movers[i];
    m.update();
    m.display();
    if(m.isDead()){
      movers.splice(i,1);
    }
  }
}

function displayMilkNumber(){
  textSize(50);
  textAlign(CENTER, CENTER);
  text(str(milkNum), width/4, height/4);
}

function displayCoffeeNumber(){
  textSize(50);
  textAlign(CENTER, CENTER);
  text(str(coffeeNum), width*3/4, height/4);
}

