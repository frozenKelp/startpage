(() => {
  // === Slideshow Setup ===
  const totalVideos = 21;
  const slideshow = document.getElementById('slideshow');
  const videos = Array.from({ length: totalVideos }, (_, i) => `assets/side${i + 1}.mp4`);

  const getDailySlideIndex = () => {
    const seed = new Date().toDateString();
    return [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0) % totalVideos;
  };

  const currentDate = new Date().toDateString();
  let slideIndex = localStorage.getItem('lastDate') === currentDate
    ? parseInt(localStorage.getItem('slideIndex'), 10)
    : getDailySlideIndex();

  localStorage.setItem('lastDate', currentDate);
  localStorage.setItem('slideIndex', slideIndex);

  videos.forEach((video, i) => {
    const slide = document.createElement('div');
    slide.className = 'mySlides';
    slide.style.opacity = i === slideIndex ? '1' : '0';
    slide.style.transition = 'opacity 0.5s'; // Smooth fade

    const vid = document.createElement('video');
    vid.dataset.src = video; // Use data-src for lazy loading
    vid.autoplay = false;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.style.cursor = 'pointer';
    vid.preload = 'none';
    vid.addEventListener('click', () => changeSlide(1));

    slide.appendChild(vid);
    slideshow.appendChild(slide);
  });

  // Helper to load/play only the current video
  const loadCurrentVideo = () => {
    document.querySelectorAll('.mySlides').forEach((slide, i) => {
      const vid = slide.querySelector('video');
      if (i === slideIndex) {
        if (!vid.src) vid.src = vid.dataset.src;
        vid.load();
        vid.play();
      } else {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
      }
    });
  };

  const changeSlide = (n) => {
    slideIndex = (slideIndex + n + totalVideos) % totalVideos;
    updateSlides();
    loadCurrentVideo();
  };

  const updateSlides = () => {
    document.querySelectorAll('.mySlides').forEach((slide, i) => {
      slide.style.opacity = i === slideIndex ? '1' : '0';
    });
    localStorage.setItem('slideIndex', slideIndex);
  };

  updateSlides();
  loadCurrentVideo();

  // === Clock Update ===
  const updateClock = () => {
    document.getElementById('codes').textContent = new Date().toLocaleString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  updateClock();
  setInterval(updateClock, 1000);

  // === Canvas Background Animation ===
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const opts = {
    particleColor: "rgb(143, 143, 143)",
    lineColor: "rgb(143, 143, 143)",
    particleAmount: 50,
    defaultSpeed: 0.5,
    variantSpeed: 0.5,
    defaultRadius: 2,
    variantRadius: 2,
    linkRadius: 150,
  };

  // --- Spatial Hashing Setup ---
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
