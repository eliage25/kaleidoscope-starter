// Change these values, save, and try drawing again.
let brushSize = 3;
let ink = '#7b1ed3';
let gestureColor = "";
let segments = 10;
let fadeBackground = [15, 15, 10];
let drawingOnCanvas = false;

function setup() { 
  // cunvas o full available spase in the window
  createCanvas(windowWidth, windowHeight);
  background(fadeBackground[0], fadeBackground[1], fadeBackground[2]);
  strokeCap(ROUND);
  angleMode(DEGREES);

  const canvas = document.querySelector('canvas');
  canvas.addEventListener('pointerdown', () => {
    drawingOnCanvas = true;
  });
  window.addEventListener('pointerup', () => {
    drawingOnCanvas = false;
  });
  window.addEventListener('pointercancel', () => {
    drawingOnCanvas = false;
  });

  const symmetrySlider = document.getElementById('symmetry-slider');
  const symmetryValue = document.getElementById('symmetry-value');
  symmetrySlider.addEventListener('input', () => {
    segments = Number(symmetrySlider.value);
    symmetryValue.value = segments;
  });
}
 
function draw() {
  const fadeAmount = 255 * (1 - Math.pow(0.5, deltaTime / 24000));
  push();
  noStroke();
  fill(fadeBackground[0], fadeBackground[1], fadeBackground[2], fadeAmount);
  rect(0, 0, width, height);
  pop();
}

function mousePressed() {
  if (!drawingOnCanvas || !mouseIsInsideCanvas()) {
    return;
  }

  gestureColor = color(random(255), random(255), random(255));
  drawStroke(mouseX, mouseY, mouseX, mouseY);
}

function mouseDragged() {
  if (!drawingOnCanvas || !mouseIsInsideCanvas() ||
      pmouseX < 0 || pmouseX >= width ||
      pmouseY < 0 || pmouseY >= height) {
    return;
  }

  drawStroke(pmouseX, pmouseY, mouseX, mouseY);
}

function mouseIsInsideCanvas() {
  return mouseX >= 0 && mouseX < width &&
    mouseY >= 0 && mouseY < height;
}

function drawStroke(previousX, previousY, x, y) {
  push();
  translate(width / 2, height / 2);

  const offsetX = x - width / 2;
  const offsetY = y - height / 2;
  const prevOffsetX = previousX - width / 2;
  const prevOffsetY = previousY - height / 2;

  stroke(gestureColor);
  strokeWeight(brushSize);

  const dx = offsetX - prevOffsetX;
  const dy = offsetY - prevOffsetY;
  const distance = sqrt(dx * dx + dy * dy);
  const speed = min(distance, 35) / 35;
  const circleSize = map(speed, 0, 1, 40, 5, true);
  const spacing = max(18, circleSize * 1.7);
  const steps = max(1, floor(distance / spacing));

  for (let i = 0; i < segments; i++) {
    push();
    rotate(360 / segments * i);

    const mirroredX = -offsetX;
    const mirroredPX = -prevOffsetX;
    const accentDistance = min(width, height) * 0.18;

    line(prevOffsetX, prevOffsetY, offsetX, offsetY);
    line(mirroredPX, prevOffsetY, mirroredX, offsetY);

    noFill();
    stroke(red(gestureColor), green(gestureColor), blue(gestureColor), 70);

    for (let s = 0; s <= steps; s++) {
      const t = s / max(1, steps);
      const pointX = lerp(prevOffsetX, offsetX, t);
      const pointY = lerp(prevOffsetY, offsetY, t);
      circle(pointX, pointY, circleSize);
      circle(-pointX, pointY, circleSize);
    }

    circle(accentDistance, 0, circleSize);
    pop();
  }

  pop();
}

function keyPressed() {
  // Clear the canvas when the user presses 'c' or 'C'.
  if (key === 'c' || key === 'C') {
    fadeBackground = [12, 15, 24];
    background(fadeBackground[0], fadeBackground[1], fadeBackground[2]);
  }
  if (key === 's' || key === 'S') {
    saveCanvas('my-kaleidoscope', 'png');
  }
}
