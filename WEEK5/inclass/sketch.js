
let posX = [];
let posY = [];
let size = []
let numStars = 500;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB,360,100,100);
  //frameRate(20);
  for(let i = 0;i < numStars; i++){
    posX.push(random(width))
    posY[i] = random(height)
    size.push (random(2,10))
  }
}

function draw() {
  background(0,0,0)
  fill(0,0,100)
  for(let i = 0;i < numStars; i++){
    //fill(random(360),80,100)
    circle(posX[i],posY[i],random(size[i],size[i+1]));
  }

}

//while(){
 // fill(random)
//}
