
var Mover = function(position){
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(random(-2,2), random(-2,2));
  this.acceleration = createVector(0, 0);
  this.lifespan = 255.0;
  this.center = createVector(width/2, height/2);
  this.topspeed = 6.0;
  this.arrivalTime = 0.0;
  this.emitTime = 0.0;
  this.initLocation = createVector(position.x, position.y);
  this.maxDistance = new p5.Vector.sub(this.center, this.initLocation).mag();
  this.dis2original = createVector(width,height);
  this.dis2center = new p5.Vector.sub(this.center, this.initLocation);
  this.fading = false;
  this.deadFlag = false;
  this.rotation = random(TWO_PI);
};

Mover.prototype.update = function(){
  this.dis2original = new p5.Vector.sub(this.position, this.initLocation);
  this.dis2center = new p5.Vector.sub(this.center, this.position);
  
  if(this.dis2original.mag() >= this.maxDistance + 50){
    this.fading = true;
  }
  if(!this.fading){
    this.acceleration = new p5.Vector.sub(this.center, this.position);
    this.acceleration.setMag(0.2);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);
  }
  else{
    this.lifespan -= 5;
  }
  
  if(this.lifespan <= 0){
    this.deadFlag = true;
  }
  
  this.position.add(this.velocity);
  
};

Mover.prototype.display = function(){
  noStroke();
  imageMode(CENTER);
  push();
  translate(this.position.x, this.position.y);
  rotate(this.rotation);
  tint(255,this.lifespan);
  image(img, 0, 0, 30, 30);
  pop();
  this.rotation+=0.1;
};

Mover.prototype.isDead = function(){
  
  if (this.dis2center.mag() <= 50) {
    return true;
  } else {
    return false;
  }
};

Mover.prototype.calcArrivalTime = function(){
  var acceleration = createVector(0,0);
  var velocity = createVector(this.velocity.x, this.velocity.y);
  var position = createVector(this.position.x, this.position.y);
  var topspeed = 6.0;
  var iteration = 0.0;
  for(var i = 0; i < 150; i++){
    acceleration = new p5.Vector.sub(this.center, position);
    acceleration.setMag(0.2);
    velocity.add(acceleration);
    velocity.limit(topspeed);
    position.add(velocity);
    if(p5.Vector.dist(this.center, position) <= 30){
      iteration = i;
      break;
    }
  }
  arrivalTime = (iteration/frameRate());
}

Mover.prototype.testCapture = function(){
  this.deadFlag = this.isDead();
}