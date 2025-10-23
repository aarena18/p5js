let angle = 0;
let clickedCircles = [];
let nextOrbitIndex = 1; // Start after the 3 existing orbiting circles

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(0, 20, 40);

  // Center the main shape
  push();
  translate(width / 2, height / 2);
  rotate(angle * 1.2);

  // Static colored oval
  fill(235, 150, 100);
  stroke(255);
  strokeWeight(2);

  ellipse(0, 4, 120, 80); // Oval shape
  pop();

  // Add some floating circles
  for (let i = 0; i < 3; i++) {
    push();
    let x = cos(angle + (i * PI * 2) / 3) * 400;
    let y = sin(angle + (i * PI * 2) / 3) * 150;
    translate(width / 2 + x, height / 2 + y);

    fill(0, 0, 0, 0);
    stroke(255);
    strokeWeight(2);
    circle(0, 0, 10); // Small circles
    pop();
  }
  
  // Draw clicked circles in orbit
  for (let i = 0; i < clickedCircles.length; i++) {
    let orbitIndex = clickedCircles[i].orbitIndex;
    let x = cos(angle + orbitIndex * PI * 2/3) * 400;
    let y = sin(angle + orbitIndex * PI * 2/3) * 150;
    
    fill(255, 100, 150, 000);
    stroke(255);
    strokeWeight(1);
    ellipse(width/2 + x, height/2 + y, 60, 30);
  }
  
  angle += 0.02;
}

function mousePressed() {
  clickedCircles.push({orbitIndex: nextOrbitIndex});
  nextOrbitIndex += 1; // Each new circle gets its own orbital position
}
