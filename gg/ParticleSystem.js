
var ParticleSystem = function(number, x, y){
  this.particles = new Array();
  for(var i = 0; i < number; i++){
    this.particles.push(new Particle(createVector(x, y)));
  }
}

ParticleSystem.prototype.update = function(){
  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update();
  }
}

ParticleSystem.prototype.setEmitter = function(position){

  for(var i = 0; i < this.particles.length; i++){
    if(this.particles[i].isDead()){
      this.particles[i].rebirth(position);
    }
  }

}

ParticleSystem.prototype.areAllDead = function(){
  for(var i = 0; i < this.particles.length; i++){
    if(!this.particles[i].isDead()){
      return false;
    }
  }
  return true;
};

ParticleSystem.prototype.display = function(){
  for(var i = 0; i < this.particles.length; i++){
    noStroke();
    imageMode(CENTER);
    push();
    translate(this.particles[i].position.x, this.particles[i].position.y);
    tint(255, 255, 255, this.particles[i].lifespan);
    image(resource.spark, 0, 0, this.particles[i].partsize, this.particles[i].partsize);
    pop();
  }
};