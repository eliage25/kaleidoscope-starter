// Change these values, save, and try drawing again.
let brushSize = 3;
let ink = '#7b1ed3';
let gestureColor = "";
let wasMousePressed = false;
let segments = 10;

function setup() { 
  // cunvas o full available spase in the window
  createCanvas(windowWidth, windowHeight);
  background(15, 15, 200);
  strokeCap(ROUND);
  angleMode(DEGREES);
}
 
function draw() {
  const insideCanvas = mouseX >= 0 && mouseX < width &&
    mouseY >= 0 && mouseY < height &&
    pmouseX >= 0 && pmouseX < width &&
    pmouseY >= 0 && pmouseY < height;

  // Draw only while dragging inside the canvas.
  if (mouseIsPressed && insideCanvas) {
    if (!wasMousePressed) {
      gestureColor = color(random(255), random(255), random(255));
    }

    translate(width / 2, height / 2);

    const offsetX = mouseX - width / 2;
    const offsetY = mouseY - height / 2;
    const prevOffsetX = pmouseX - width / 2;
    const prevOffsetY = pmouseY - height / 2;

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
        const x = lerp(prevOffsetX, offsetX, t);
        const y = lerp(prevOffsetY, offsetY, t);
        circle(x, y, circleSize);
        circle(-x, y, circleSize);
      }

      circle(accentDistance, 0, circleSize);
      pop();
    }
  }

  wasMousePressed = mouseIsPressed;
}

function keyPressed() {
  // Clear the canvas when the user presses 'c' or 'C'.
  if (key === 'c' || key === 'C') {
    background(12, 15, 24);
  }
  if (key === 's' || key === 'S') {
    saveCanvas('my-kaleidoscope', 'png');
  }
}
