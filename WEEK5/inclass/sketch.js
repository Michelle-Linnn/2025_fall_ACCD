function setup() {
  createCanvas(600, 600);
  colorMode(HSB,360,100,100);
  frameRate(20);
}

function draw() {
  background(0,0,0)
  for(let i = 0;i < 2; i++){
    fill(random(360),80,100)
    circle(random(width),random(height),50);
  }

}

//while(){
 // fill(random)
//}
