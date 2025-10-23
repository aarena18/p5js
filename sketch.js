function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  background(0, 20, 40);

  push();
  translate(width / 2, height / 2);

  fill(235, 150, 100);
  stroke(255);
  strokeWeight(2);

  ellipse(0, 4, 120, 80);
  pop();

  for (let i = 0; i < 3; i++) {
    push();
    let x = cos((i * PI * 2) / 3) * 100;
    let y = sin((i * PI * 2) / 3) * 80;
    translate(width / 2 + x, height / 2 + y);

    fill(0, 0, 0, 0);
    stroke(255);
    strokeWeight(2);
    circle(0, 0, 10);
    pop();
  }

  for (let i = 0; i < 3; i++) {
    let x = cos((i * PI * 2) / 3) * 150;
    let y = sin((i * PI * 2) / 3) * 100;

    fill(255, 100, 150, 0);
    stroke(255);
    strokeWeight(1);
    ellipse(width / 2 + x, height / 2 + y, 60, 30);
  }
}
