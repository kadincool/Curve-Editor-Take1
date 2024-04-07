class Element {
  x;
  y;
  wid;
  hei;

  constructor(x, y, wid, hei) {
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.hei = hei;
  }

  move(x, y, wid, hei) {
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.hei = hei;
  }

  isInside(posX, posY, leniance = 0) {
    return this.x - leniance <= posX && this.x + this.wid + leniance >= posX && this.y - leniance <= posY && this.y + this.hei + leniance >= posY;
  }

  get weight() {
    return this.wid * this.hei;
  }
}

class Grid extends Element {
  cols;
  rows;

  constructor(x, y, wid, hei, cols, rows) {
    super(x, y, wid, hei);
    this.cols = cols;
    this.rows = rows;
  }

  render() {
    can2d.beginPath();
    for (let col = 0; col <= this.cols; col++) {
      for (let row = 0; row <= this.rows; row++) {
        can2d.moveTo(this.x + col * (this.wid / this.cols), this.y + row * (this.hei / this.rows));
        can2d.lineTo(this.x + col * (this.wid / this.cols), this.y + row * (this.hei / this.rows));
        can2d.stroke();
      }
    }
    can2d.moveTo(this.x, this.y);
    can2d.lineTo(this.x, this.y);
    can2d.stroke();
    // can2d.beginPath();
    // can2d.moveTo(this.x, this.y);
    // can2d.lineTo(this.x + this.wid, this.y);
    // can2d.lineTo(this.x + this.wid, this.y + this.hei);
    // can2d.lineTo(this.x, this.y + this.hei);
    // can2d.lineTo(this.x, this.y);
    // can2d.stroke();
  
    // for (let i = 1; i < this.cols; i++) {
    //   can2d.beginPath();
    //   can2d.moveTo(this.x + i * (this.wid / this.cols), this.y);
    //   can2d.lineTo(this.x + i * (this.wid / this.cols), this.y + this.hei);
    //   can2d.stroke();
    // }
    // for (let i = 1; i < this.rows; i++) {
    //   can2d.beginPath();
    //   can2d.moveTo(this.x, this.y + i * (this.hei / this.rows));
    //   can2d.lineTo(this.x + this.wid, this.y + i * (this.hei / this.rows));
    //   can2d.stroke();
    // }
  }

  getClosestOnGrid(posX, posY, clamp = false) {
    let newX = Math.round((posX - this.x) * this.cols / this.wid);
    let newY = Math.round((posY - this.y) * this.rows / this.hei);

    if (clamp) {
      if (newX < 0) {newX = 0}
      if (newX > this.cols) {newX = this.cols}
      if (newY < 0) {newY = 0}
      if (newY > this.rows) {newY = this.rows}
    }

    return [newX * this.wid / this.cols + this.x, newY * this.hei / this.rows + this.y];
  }

  onClick() {
    console.log(points);
  }
}

class Point extends Element {
  control = false;
  size = 15;

  constructor(x, y) {
    super(x, y, 0, 0);
    this.x -= this.size;
    this.y -= this.size;
    this.wid += this.size * 2;
    this.hei += this.size * 2;
    // super(x - this.size, y - this.size, this.size * 2, this.size * 2);
  }

  // constructor(x, y, control) {
  //   super(x - this.size, y - this.size, this.size * 2, this.size * 2);
  //   this.control = control;
  // }

  get posX() {
    return this.x + this.size;
  }

  get posY() {
    return this.y + this.size;
  }

  render() {
    can2d.beginPath();
    can2d.arc(this.x + this.size, this.y + this.size, this.size, 0, Math.PI * 2);
    can2d.fill();
    can2d.stroke();
  }
}

class Line {
  point1;
  point2;

  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }

  isInside(posX, posY, leniance = 0) {
    leniance += 4;
    console.log(this.point1.posX, this.point1.posY, this.point2.posX, this.point2.posY);
    let lineSlope = (this.point2.posY - this.point1.posY) / (this.point2.posX - this.point1.posX);
    let lineInt = this.point1.posY - (lineSlope * this.point1.posX);
    let invSlope = -1/lineSlope;
    let posInt = posY - (invSlope * posX);
    let intX = (lineInt - posInt) / (invSlope - lineSlope);
    let intY = intX * lineSlope + lineInt;
    console.log(intX, intY)
    let distance = Math.hypot(posX - intX, posY - intY);
    console.log(distance);
    return distance <= leniance;
  }

  get weight() {
    return Math.hypot(this.point2.posX - this.point1.posX, this.point2.posY - this.point1.posY) * 8;
  }

  render() {
    can2d.beginPath();
    can2d.moveTo(this.point1.posX, this.point1.posY);
    can2d.lineTo(this.point2.posX, this.point2.posY);
    can2d.stroke();
  }
}