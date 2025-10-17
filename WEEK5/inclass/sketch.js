function setup() {
  createCanvas(600, 600);
  colormade(HSB,360,100,100);
}

function draw() {
  background(0,0,0)
  for(let i = 0;i < 8; i++)
    fill(random(360),80,100)
  circle(random(width),random(height),50);
}


//while(){
 // fill(random)
//}
