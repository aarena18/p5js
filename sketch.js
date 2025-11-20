let recordedPaths = []; // {points:[{x,y}], stroke:[r,g,b,a], weight}
let recordedCircles = []; // {x,y,r,stroke,weight}
let canvasW = 800,
  canvasH = 600;

function setup() {
  createCanvas(canvasW, canvasH);
  noLoop();

  // boutons d'export
  let bSvg = createButton("Export SVG");
  bSvg.position(10, 10);
  bSvg.mousePressed(exportSVG);

  let bDxf = createButton("Export DXF");
  bDxf.position(100, 10);
  bDxf.mousePressed(exportDXF);

  // raccourcis clavier
  window.addEventListener("keydown", (e) => {
    if (e.key === "s") exportSVG();
    if (e.key === "d") exportDXF();
  });
}

function draw() {
  // effacer enregistrement précédent
  recordedPaths = [];
  recordedCircles = [];

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

// --- Enregistrement / échantillonnage d'une courbe de Bézier cubique ---
function sampleCubicBezier(x0, y0, x1, y1, x2, y2, x3, y3, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x =
      mt * mt * mt * x0 +
      3 * mt * mt * t * x1 +
      3 * mt * t * t * x2 +
      t * t * t * x3;
    const y =
      mt * mt * mt * y0 +
      3 * mt * mt * t * y1 +
      3 * mt * t * t * y2 +
      t * t * t * y3;
    pts.push({ x, y });
  }
  return pts;
}

function addPath(points, stroke, weight) {
  recordedPaths.push({ points, stroke, weight });
}

// --- Fonction utilitaire pour dessiner une fleur (contours seulement, plus complexe)
//    Ajoute aussi les chemins dans recordedPaths / recordedCircles pour export.
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

  for (let j = 0; j < petals; j++) {
    push();
    rotate((j * TWO_PI) / petals);

    // contour du pétale (couleur pétale)
    stroke(pr, pg, pb, pa);
    strokeWeight(max(1, 2 * scale));
    beginShape();
    // forme composée de deux courbes cubiques consécutives
    const p0 = { x: 6 * scale, y: -6 * scale };
    const c1 = { x: 22 * scale, y: -34 * scale };
    const c2 = { x: 46 * scale, y: -34 * scale };
    const p1 = { x: 56 * scale, y: 0 };

    const c3 = { x: 46 * scale, y: 34 * scale };
    const c4 = { x: 22 * scale, y: 34 * scale };
    const p2 = { x: 6 * scale, y: 6 * scale };

    vertex(p0.x, p0.y);
    bezierVertex(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
    bezierVertex(c3.x, c3.y, c4.x, c4.y, p2.x, p2.y);
    endShape(CLOSE);

    // enregistrer le contour du pétale en échantillonnant les deux cubic beziers
    const partA = sampleCubicBezier(
      p0.x,
      p0.y,
      c1.x,
      c1.y,
      c2.x,
      c2.y,
      p1.x,
      p1.y,
      24
    );
    const partB = sampleCubicBezier(
      p1.x,
      p1.y,
      c3.x,
      c3.y,
      c4.x,
      c4.y,
      p2.x,
      p2.y,
      24
    );
    // concaténer et transformer par rotation/translation courante
    const allPts = partA.concat(partB);
    const transformed = allPts.map((pt) => {
      const a = (j * TWO_PI) / petals;
      const rx = pt.x * cos(a) - pt.y * sin(a);
      const ry = pt.x * sin(a) + pt.y * cos(a);
      return { x: rx + cx, y: ry + cy };
    });
    addPath(transformed, petalStroke, max(1, 2 * scale));

    // nervures internes (utilisent la couleur du centre pour contraste)
    stroke(cr, cg, cb, ca * 0.9);
    strokeWeight(max(0.6, 0.9 * scale));
    for (let v = 0; v < 3; v++) {
      beginShape();
      const v0 = { x: 8 * scale, y: 0 };
      const vc1 = {
        x: 18 * scale + v * 2 * scale,
        y: -6 * scale - v * 3 * scale,
      };
      const vc2 = { x: 36 * scale, y: -6 * scale - v * 2 * scale };
      const v1 = { x: 46 * scale, y: 0 };
      vertex(v0.x, v0.y);
      bezierVertex(vc1.x, vc1.y, vc2.x, vc2.y, v1.x, v1.y);
      endShape();

      // enregistrer nervure
      const veinPts = sampleCubicBezier(
        v0.x,
        v0.y,
        vc1.x,
        vc1.y,
        vc2.x,
        vc2.y,
        v1.x,
        v1.y,
        20
      );
      const tVein = veinPts.map((pt) => {
        const a = (j * TWO_PI) / petals;
        const rx = pt.x * cos(a) - pt.y * sin(a);
        const ry = pt.x * sin(a) + pt.y * cos(a);
        return { x: rx + cx, y: ry + cy };
      });
      addPath(tVein, [cr, cg, cb, ca * 0.9], max(0.6, 0.9 * scale));
    }

    pop();
  }

  // centre : anneau en couleur de centre (on enregistre comme cercle DXF-friendly)
  stroke(cr, cg, cb, ca ?? 255);
  strokeWeight(2 * scale);
  noFill();
  circle(0, 0, 18 * scale);

  // enregistrer cercle (transformé)
  recordedCircles.push({
    x: cx,
    y: cy,
    r: (18 * scale) / 2,
    stroke: centerStroke,
    weight: 2 * scale,
  });

  // petits rayons dans le centre (même couleur que le centre pour lisibilité sur blanc)
  stroke(cr, cg, cb, ca * 0.95);
  strokeWeight(1 * scale);
  let rays = 12;
  for (let k = 0; k < rays; k++) {
    let a = (k * TWO_PI) / rays;
    let r1 = 6 * scale;
    let r2 = 10 * scale;
    const x1 = cos(a) * r1,
      y1 = sin(a) * r1;
    const x2 = cos(a) * r2,
      y2 = sin(a) * r2;
    line(x1, y1, x2, y2);

    // enregistrer comme chemin (ligne)
    addPath(
      [
        { x: x1 + cx, y: y1 + cy },
        { x: x2 + cx, y: y2 + cy },
      ],
      [cr, cg, cb, ca * 0.95],
      1 * scale
    );
  }

  pop();
}

// --- Export SVG ---
function rgbaToSvgColor(col) {
  const [r, g, b, a] = col;
  if (a === undefined || a === 255) return `rgb(${r},${g},${b})`;
  const alpha = (a / 255).toFixed(3);
  return `rgba(${r},${g},${b},${alpha})`;
}

function exportSVG() {
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">`
  );
  lines.push(`<rect width="100%" height="100%" fill="white"/>`);

  // paths as polyline
  for (const p of recordedPaths) {
    const pts = p.points
      .map((pt) => `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`)
      .join(" ");
    const stroke = rgbaToSvgColor(p.stroke);
    const w = p.weight;
    lines.push(
      `<polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
    );
  }

  // circles
  for (const c of recordedCircles) {
    const stroke = rgbaToSvgColor(c.stroke);
    lines.push(
      `<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${c.r.toFixed(
        2
      )}" fill="none" stroke="${stroke}" stroke-width="${c.weight}"/>`
    );
  }

  lines.push(`</svg>`);

  // save as file
  saveStrings(lines, "drawing.svg");
  console.log("SVG exporté : drawing.svg");
}

// --- Export DXF (ASCII R12 minimal) ---
function exportDXF() {
  const out = [];
  function push(code, value) {
    out.push(String(code));
    out.push(String(value));
  }

  // header
  push(0, "SECTION");
  push(2, "ENTITIES");

  // add polylines for each recorded path
  for (const p of recordedPaths) {
    // start polyline
    push(0, "POLYLINE");
    push(8, "0");
    push(66, "0");
    push(70, "0");
    // vertices
    for (const v of p.points) {
      push(0, "VERTEX");
      push(8, "0");
      push(10, v.x.toFixed(4));
      push(20, v.y.toFixed(4));
      push(30, "0.0");
    }
    push(0, "SEQEND");
  }

  // add circles as CIRCLE entities when possible
  for (const c of recordedCircles) {
    push(0, "CIRCLE");
    push(8, "0");
    push(10, c.x.toFixed(4));
    push(20, c.y.toFixed(4));
    push(30, "0.0");
    push(40, c.r.toFixed(4));
  }

  // footer
  push(0, "ENDSEC");
  push(0, "EOF");

  saveStrings(out, "drawing.dxf");
  console.log("DXF exporté : drawing.dxf");
}

// --- ancienne fonction drawLeaf conservée mais non utilisée ---
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
