const canvas = document.getElementById("canvas2d");
const can2d = canvas.getContext("2d");

var mouse = {
  x: 0,
  y: 0,
  isClicked: false,
  wasClicked: false,
  lastClicked: Date.now(),
  startClicked: Date.now(),
  startX: 0,
  startY: 0,
  selected: null,
}

var grid = new Grid(100, 100, 400, 400, 4, 4);
var points = [];
var lines = [];

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function frame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let now = Date.now();

  //mouse
  if (mouse.isClicked && !mouse.wasClicked) {
    // console.log("click start");
    console.log(getSmallestElem(mouse.x, mouse.y));
    grid.onClick();
    if (grid.isInside(mouse.x, mouse.y, 30)) {
      console.log(grid.getClosestOnGrid(mouse.x, mouse.y, true));
      let newPoint = new Point(...grid.getClosestOnGrid(mouse.x, mouse.y, true))
      points.push(newPoint);
      if (mouse.selected != null) {
        let newLine = new Line(mouse.selected, newPoint)
        lines.push(newLine);
      }
      mouse.selected = newPoint;
    }
    if (now - mouse.lastClicked < 250) {
      // console.log("double click");
    }
  }

  if (mouse.isClicked && mouse.wasClicked) {
    // console.log("click held");
    if (now - mouse.startClicked > 500) {
      // console.log("long press");
    }
    if (dist(mouse.startX, mouse.startY, mouse.x, mouse.y) > 30) {
      // console.log("mouse dragged");
    }
  }

  if (!mouse.isClicked && mouse.wasClicked) {
    // console.log("click end");
  }

  if (mouse.isClicked) {
    mouse.lastClicked = now;
  }
  mouse.wasClicked = mouse.isClicked;

  //draw
  can2d.fillStyle = "yellow";
  can2d.strokeStyle = "black";
  can2d.lineWidth = 8;
  can2d.lineCap = "round";
  can2d.lineJoin = "round";

  can2d.fillRect(0, 0, canvas.width, canvas.height);

  grid.render();

  for (let line in lines) {
    lines[line].render();
  }

  for (let point in points) {
    points[point].render();
  }

  // can2d.beginPath();
  // can2d.moveTo(mouse.startX, mouse.startY);
  // can2d.lineTo(mouse.x, mouse.y);
  // can2d.stroke();

  requestAnimationFrame(frame);
}
frame();

function getSmallestElem(posX, posY) {
  let out = null;
  let smallestSize = Infinity;
  
  if (grid.isInside(posX, posY) && grid.weight < smallestSize) {
    out = grid;
    smallestSize = grid.weight;
  }
  return out;
}

document.addEventListener("mousedown", (e) => {
  // if (grid.isInside(e.offsetX, e.offsetY, 30)) {
  //   console.log(grid.getClosestOnGrid(e.offsetX, e.offsetY, true));
  //   points.push(new Point(...grid.getClosestOnGrid(e.offsetX, e.offsetY, true)))
  // }
  mouse.isClicked = true;
  mouse.startClicked = Date.now();
  mouse.startX = e.offsetX;
  mouse.startY = e.offsetY;
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

document.addEventListener("mouseup", (e) => {
  mouse.isClicked = false;
});

document.addEventListener("mousemove", (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

document.addEventListener("touchstart", (e) => {
  mouse.isClicked = true;
  mouse.startClicked = Date.now();
  mouse.startX = e.touches[0].pageX;
  mouse.startY = e.touches[0].pageY;
  mouse.x = e.touches[0].pageX;
  mouse.y = e.touches[0].pageY;
});

document.addEventListener("touchend", (e) => {
  mouse.isClicked = false;
});

document.addEventListener("touchcancel", (e) => {
  mouse.isClicked = false;
});

document.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].pageX;
  mouse.y = e.touches[0].pageY;
});