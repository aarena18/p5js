function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  background(0, 20, 40);

  // Grande fleur centrale remplaçant l'ellipse orange
  drawFlower(
    width / 2,
    height / 2 + 4,
    2.0,
    12,
    [255, 200, 50, 255], // trait jaune/orangé vif pour forte contrainte
    [255, 255, 255, 255] // centre en blanc
  );

  // Petites fleurs extérieures (contours magenta + cyan pour contraste)
  for (let i = 0; i < 3; i++) {
    let x = cos((i * PI * 2) / 3) * 150;
    let y = sin((i * PI * 2) / 3) * 100;

    // alternance de couleurs pour contraste
    let strokeCol = i % 2 === 0 ? [255, 60, 180, 255] : [40, 255, 230, 255];

    drawFlower(
      width / 2 + x,
      height / 2 + y,
      0.9,
      8,
      strokeCol,
      [255, 255, 255, 200]
    );
  }
}

// Nouvelle fonction utilitaire pour dessiner une fleur (contours seulement, plus complexe)
function drawFlower(
  cx,
  cy,
  scale = 1,
  petals = 6,
  petalStroke = [255, 150, 200, 255],
  centerStroke = [255, 220, 60, 255]
) {
  push();
  translate(cx, cy);
  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);

  const [pr, pg, pb, pa] = petalStroke;

  // pétales : outlines en courbes de Bézier + nervures blanches pour contraste
  for (let j = 0; j < petals; j++) {
    push();
    rotate((j * TWO_PI) / petals);

    // contour du pétale
    stroke(pr, pg, pb, pa);
    strokeWeight(max(1, 2 * scale));
    beginShape();
    vertex(6 * scale, -6 * scale);
    bezierVertex(
      22 * scale,
      -34 * scale,
      46 * scale,
      -34 * scale,
      56 * scale,
      0
    );
    bezierVertex(
      46 * scale,
      34 * scale,
      22 * scale,
      34 * scale,
      6 * scale,
      6 * scale
    );
    endShape(CLOSE);

    // nervures internes (blanc semi-opaque pour fort contraste)
    stroke(255, 230);
    strokeWeight(max(0.6, 0.9 * scale));
    for (let v = 0; v < 3; v++) {
      beginShape();
      vertex(8 * scale, 0);
      bezierVertex(
        18 * scale + v * 2 * scale,
        -6 * scale - v * 3 * scale,
        36 * scale,
        -6 * scale - v * 2 * scale,
        46 * scale,
        0
      );
      endShape();
    }

    pop();
  }

  // centre : anneau et rayons en contraste élevé
  stroke(
    centerStroke[0],
    centerStroke[1],
    centerStroke[2],
    centerStroke[3] ?? 255
  );
  strokeWeight(2 * scale);
  noFill();
  circle(0, 0, 18 * scale);

  // petits rayons blancs dans le centre pour texture
  stroke(255, 220);
  strokeWeight(1 * scale);
  let rays = 12;
  for (let k = 0; k < rays; k++) {
    let a = (k * TWO_PI) / rays;
    let r1 = 6 * scale;
    let r2 = 10 * scale;
    line(cos(a) * r1, sin(a) * r1, cos(a) * r2, sin(a) * r2);
  }

  pop();
}

// Nouvelle fonction utilitaire pour dessiner une feuille (forme allongée, orientée)
function drawLeaf(cx, cy, angle = 0, scale = 1, color = [255, 255, 255, 230]) {
  push();
  translate(cx, cy);
  rotate(angle);
  noStroke();
  fill(color[0], color[1], color[2], color[3]);

  // forme de feuille simple composée de deux courbes de Bézier
  beginShape();
  vertex(-10 * scale, 0);
  bezierVertex(-10 * scale, -11 * scale, 22 * scale, -8 * scale, 2 * scale, 0);
  bezierVertex(20 * scale, 12 * scale, -12 * scale, 8 * scale, -10 * scale, 0);
  endShape(CLOSE);

  // nervure centrale
  stroke(220, 220);
  strokeWeight(1);
  line(-10 * scale, 0, 28 * scale, 0);

  pop();
}
