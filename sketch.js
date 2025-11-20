function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  // fond blanc demandé
  background(255);

  // Grande fleur centrale (pétales verts foncés, centre rose vif)
  drawFlower(
    width / 2,
    height / 2 + 4,
    2.0,
    12,
    [6, 120, 60, 255], // pétales : vert foncé
    [255, 60, 150, 255] // centre : rose vif (contraste)
  );

  // Petites fleurs extérieures : alternance rose / vert pour contraste
  for (let i = 0; i < 3; i++) {
    let x = cos((i * PI * 2) / 3) * 150;
    let y = sin((i * PI * 2) / 3) * 100;

    // alternance : index pair -> rose (pétales), vert (centre) ; impair -> vert (pétales), rose (centre)
    let petalCol = i % 2 === 0 ? [255, 80, 160, 255] : [10, 140, 70, 255];
    let centerCol = i % 2 === 0 ? [10, 140, 70, 255] : [255, 80, 160, 255];

    drawFlower(width / 2 + x, height / 2 + y, 0.9, 8, petalCol, centerCol);
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
  const [cr, cg, cb, ca] = centerStroke;

  // pétales : outlines en courbes de Bézier + nervures en couleur de centre (contraste sur fond blanc)
  for (let j = 0; j < petals; j++) {
    push();
    rotate((j * TWO_PI) / petals);

    // contour du pétale (couleur pétale)
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

    // nervures internes (utilisent la couleur du centre pour contraste)
    stroke(cr, cg, cb, ca * 0.9);
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

  // centre : anneau en couleur de centre
  stroke(cr, cg, cb, ca ?? 255);
  strokeWeight(2 * scale);
  noFill();
  circle(0, 0, 18 * scale);

  // petits rayons dans le centre (même couleur que le centre pour lisibilité sur blanc)
  stroke(cr, cg, cb, ca * 0.95);
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

// Nouvelle fonction utilitaire pour dessiner une feuille (non utilisée ici mais conservée)
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
