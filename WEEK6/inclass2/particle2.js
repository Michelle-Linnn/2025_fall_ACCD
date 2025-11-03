class Particle{
  constructor(_x,_y){
    this.pos = createVector(_x,_y)
    this.vel= createVector(random(-3,3),random(-4,4))
    
    this.radius = 20
    this.clr =color(TWO_PI,0.9,0.9)
    
  }
  move(){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
   
  }
  
  applyForce(_force){
    this.acc.add(_force)
  }
  
 
  
  display(){
    fill(this. clr)
    circle(this.pos.x,this.pos.y,this.radius*2)
  }
}