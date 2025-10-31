(() => {
//Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const opts = {
  particleColor: "#ffffffff",
  lineColor: "#ffffffff",
  particleAmount: 100,
  defaultSpeed: 0.5,
  variantSpeed: 1.2,
  defaultRadius: 1,
  variantRadius: 1.5,
  linkRadius: 200,
};

//Spatial Hashing
const cellSize = opts.linkRadius;
function getCell(x, y) {
  return [Math.floor(x / cellSize), Math.floor(y / cellSize)].join(",");
}

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
    this.direction = Math.random() * Math.PI * 2;
    this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
    this.vector = {
      x: Math.cos(this.direction) * this.speed,
      y: Math.sin(this.direction) * this.speed,
    };
  }

  update() {
    this.x += this.vector.x;
    this.y += this.vector.y;

    if (this.x <= 0 || this.x >= canvas.width) this.vector.x *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.vector.y *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = opts.particleColor;
    ctx.fill();
  }
}

const createParticles = () => {
  particles = Array.from({ length: opts.particleAmount }, () => new Particle());
};

const drawLines = () => {
  // Build spatial hash
  const hash = {};
  particles.forEach((p, i) => {
    const cell = getCell(p.x, p.y);
    if (!hash[cell]) hash[cell] = [];
    hash[cell].push(i);
  });
  // For each particle, only check neighbors in adjacent cells
  particles.forEach((p1, i) => {
    const [cx, cy] = [Math.floor(p1.x / cellSize), Math.floor(p1.y / cellSize)];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cell = [cx + dx, cy + dy].join(",");
        if (!hash[cell]) continue;
        for (const j of hash[cell]) {
          if (j <= i) continue; // Avoid double checking
          const p2 = particles[j];
          const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (distance < opts.linkRadius) {
            ctx.strokeStyle = `rgba(143, 143, 143, ${1 - distance / opts.linkRadius})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
  });
};

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animate);
};

createParticles();
animate();

})();