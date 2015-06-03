float W;
float WM;
float tx = 1000;
ArrayList<Otupus> otupuses;
void setup()
{
  size(640,640);
  smooth();
  W = 60;
  WM = 0.89;
  otupuses = new ArrayList<Otupus>();
  for(int i = 0; i < 8; i++) 
  {
    otupuses.add(new Otupus(random(0,5000)));
  }
  
}

void draw()
{
  background(237);
  
  translate(width/2, height/2);
  
  noFill();
  
  stroke (#5A3E0A, 180);
  strokeWeight (1.25);
  for(Otupus o : otupuses)
  {
    
    pushMatrix();
    //translate(-20, 0);
    rotate(4*PI/3);
    o.display();
    popMatrix();
    
  }
  translate(0, -30);  
  drawHead();
  
}



class Otupus
{
  float tx;
  float angle;
  
  Otupus(float param)
  {
    tx = param;
  }
  
  void step()
  {
    angle = map(noise(tx), 0, 1 , PI/10, -PI/10);
    tx += 0.01;
  }
  
  void display() 
  {
    step();
    W = 60;
    pushMatrix();
    for(int i = 0 ; i < 30; i++)
    {
      fill(#FF0A81, 10);
      rotate(angle);
      translate (-W/3, -W/(3*2));
      rect(-W/2, -W/2, W, W);
      W *= WM;
    }
    popMatrix();
 
  }
}

void drawHead()
{
  
  fill(#FF8BB6, 145);
  strokeWeight(1.5);
 ///ellipse(0, 0, 120, 150);
 // ellipse(-30, -20, 20, 20);
 // ellipse(30, -20, 20, 20);
 // ellipse(0, 30, 20, 20);
 
  for(int i = 0; i < 10; i++) 
  {
    float angle = map(noise(tx), 0, 1 , PI/12, -PI/12);
     tx += 0.01;
     pushMatrix();
    rotate(angle);
   float size = map(noise(tx), 0, 1, 0, 60);
    
    rect(-60, -60, 120, 120);
    rect(-size/2, -size/2+20, size, size);
    line(-20, -50, -50, 0);
    line(20, -50, 50, 0);
    popMatrix();
  }
    
    

  
  
}

