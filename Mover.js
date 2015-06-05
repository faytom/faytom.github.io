//----------------Mover Class-----------------------
var Mover = function(position){
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(0, -4);
  this.acceleration = createVector(0, 0);
  this.lifespan = 255.0;
};

Mover.prototype.update = function(){
  this.position.add(this.velocity);
  this.lifespan -= 10;
  
};

Mover.prototype.display = function(){
  fill(255, 255,255, this.lifespan);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("+1", this.position.x, this.position.y);
};

Mover.prototype.isDead = function(){
  
  if (this.lifespan <= 0) {
    return true;
  } else {
    return false;
  }
};
//-----------------------------------------------------