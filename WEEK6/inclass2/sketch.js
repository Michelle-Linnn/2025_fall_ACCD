let particles = []


function setup() {
  
  createCanvas(400, 600);
  particles.push(new Particle(random(width),0))
}

function draw() {
  background(0);

  for(let i = 0; i<10 ;i++){
    particles.push(new Particle(random(width),0))
  }
  
  particles.forEach((p,i)=>{
    p.move()
    p.display()
  })
}
