var movers = new Array();
var ps = new Array();
var par = new Array();
var img;

var DO;
var RE;
var MI;
var FA;
var SO;
var LA;
var SI;

function preload() {
  DO = loadSound('data/bgm.ogg');
  RE = loadSound('data/D.mp3');
  MI = loadSound('data/E.mp3');
  FA = loadSound('data/F.mp3');
  SO = loadSound('data/G.mp3');
  LA = loadSound('data/A.mp3');
  SI = loadSound('data/B.mp3');
}

function setup() {
  createCanvas(1024, 768);
  frameRate(40);
  img = loadImage("data/sprite.png");
}

function draw() {
  background(51);
  for(var i=0; i<movers.length; i++){
    
    movers[i].update();
    movers[i].display();
    if(movers[i].deadFlag){
      movers.splice(i,1);
    }
    
  }
  
  
  for(var j = 0; j < ps.length; j++)
  {
    if(!ps[j].areAllDead()){
      ps[j].update();
      ps[j].display();  
    }
    else{
      ps.splice(j,1);
    }
  }
  

}



function mousePressed(){
  ps.push(new ParticleSystem(50, width/2, height/2));
  movers.push(new Mover(createVector(mouseX, mouseY)));
  //textSize(30);
  //fill(255);
  //text(movers.length, width/2, height/2);
}
function keyPressed(){
  for(var i = 0; i < movers.length; i++){
    var m = movers[i];
    m.testCapture();
  }
  DO.play();
}
/*
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
*/
