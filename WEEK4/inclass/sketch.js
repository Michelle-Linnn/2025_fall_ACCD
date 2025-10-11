let posx
let posy
 
let velx
let vely

let radius = 20

function setup() {
  createCanvas(400, 400);
  colorMode(HSB,width,100,100)
  posx = width * 0.5;
  posy = height * 0.5;

  velx = random(-4,4)
  vely = random(-3,3)
}


function draw() {
  posx = posx + velx
  posy += vely

  if(posy + radius >= height || posy - radius <= 0){
    vely = vely * -1
  
  }
  if(posx + radius >= height || posx - radius <= 0){
    velx = velx * -1
  }
  
  background(mouseX,mouseY,233);

  fill(posx, 100, 100);


  circle(posx,posy,radius);
  
  fill(0,200,100);
  rect(width*0.5-50,height*0.5-50,100)
  stroke(200, 204, 0);
  strokeWeight(4);

  circle(mouseX,mouseY,80);
  circle(200,200,60);
  circle(200,200,40);
  circle(200,200,20);
}

