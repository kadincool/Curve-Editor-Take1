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
    let clicked = getSmallestElem(mouse.x, mouse.y);
    // console.log(clicked);
    if (clicked && clicked.onClick) {
      clicked.onClick();
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

  //update elements
  

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

  requestAnimationFrame(frame);
}
frame();

function getSmallestElem(posX, posY, leniance = 30) {
  let out = null;
  let smallestSize = Infinity;
  
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].isInside(posX, posY, leniance) && elements[i].weight < smallestSize) {
      out = elements[i];
      smallestSize = elements[i].weight;
    }
  }
  return out;
}

document.addEventListener("mousedown", (e) => {
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