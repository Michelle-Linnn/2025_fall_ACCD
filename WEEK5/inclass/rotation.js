let numLines = 10;
function setup() {
  createCanvas(400, 400);
  colorMode(HSB,360,100,100);
  

}

function draw() {
    background(220,20,20);

    for(let y=0;y< numLines;y++){
        line(0,y * height/numLines, width, y * height/numLines);
    }
}