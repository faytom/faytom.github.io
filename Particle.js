
var Particle = function(position){
  this.velocity = createVector(0,0);
  this.lifespan = random(255);
  this.position = createVector(position.x, position.y);
  this.gravity = createVector(0, 0);
  this.center = createVector(width/2, height/2);
  this.topspeed = 10.0;
  this.partsize = random(10, 60);
  this.rebirth(position);
};

Particle.prototype.rebirth = function(position){
  var a = random(TWO_PI);
  var speed = random(0.5, 4);
  this.velocity = createVector(cos(a), sin(a));
  this.velocity.mult(speed);
  this.position = createVector(position.x, position.y);
  
};

Particle.prototype.update = function(){
  this.lifespan = this.lifespan - 10;
  this.gravity = new p5.Vector.sub(this.center, this.position);
  this.gravity.setMag(0.2);
  this.velocity.add(this.gravity);
  this.velocity.limit(this.topspeed);
  this.position.add(this.velocity);
};

Particle.prototype.isDead = function(){
  if(this.lifespan <= 0){
    return true;
  }
  else{
    return false;
  }
};

Particle.prototype.display = function(){
  fill(255);
  ellipse(this.position.x, this.position.y, 30, 30);
};