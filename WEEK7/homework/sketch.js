let garden;
let weather = 'sunny';

function setWeather(w){ weather = w; }

class Flower {
  constructor(x, y){ this.x=x; this.y=y; this.angle=0; }
  update(){
    if(weather==='sunny') this.angle = lerp(this.angle, 0, 0.05);
    if(weather==='cloudy') this.angle = lerp(this.angle, PI/4, 0.05);
  }
  display(){
    push(); translate(this.x,this.y); rotate(this.angle);
    stroke(0); fill(255,150,200);
    ellipse(0,0,20,40);
    pop();
  }
}

class Grass {
  constructor(x,y){ this.x=x; this.y=y; this.swayAmount=0; }
  update(){
    if(weather==='windy') this.swayAmount = sin(frameCount*0.1 + this.x * 0.01) * 10;
    else this.swayAmount = 0;
  }
  display(){
    stroke(50,150,50);
    line(this.x, this.y, this.x + this.swayAmount, this.y-30);
  }
}

class Garden {
  constructor(){
    this.flowers=[];
    this.grasses=[];
  }
  addFlower(f){ this.flowers.push(f); }
  addGrass(g){ this.grasses.push(g); }
  update(){
    this.flowers.forEach(f=>f.update());
    this.grasses.forEach(g=>g.update());
  }
  display(){
    this.flowers.forEach(f=>f.display());
    this.grasses.forEach(g=>g.display());
  }
}

function setup(){
  createCanvas(500,300);
  garden = new Garden();
  for(let i=0;i<5;i++) garden.addFlower(new Flower(100+i*60,200));
  for(let i=0;i<40;i++) garden.addGrass(new Grass(i*12,260));
}

function draw(){
  if(weather==='sunny') background(135,206,235); // blue sky
  if(weather==='cloudy') background(180); // gray sky
  if(weather==='windy') background(135,206,235);

  garden.update();
  garden.display();
}
