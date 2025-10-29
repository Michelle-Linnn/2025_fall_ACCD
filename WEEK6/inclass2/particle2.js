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

  }

  bounce(){
      if(this.pos.x + this.radius >width){
        this.pos.x = width -this.radius
        this.vel.x *= -1
      } 
      if(this.pos.x - this.radius < 0){
        this.pos.x = 0 + this.radius  
        this.vel.x *= -1
      }
      if(this.pos.y + this.radius >height){
        this.pos.y = height -this.radius
        this.vel.y *= -1
      } 
      if(this.pos.y - this.radius < 0){
        this.pos.y = 0 + this.radius  
        this.vel.y *= -1
      }
  }
  display(){
    fill(this. clr)
    circle(this.pos.x,this.pos.y,this.radius*2)
  }
}