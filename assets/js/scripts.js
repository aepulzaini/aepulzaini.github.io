const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 75; // Slightly reduced so icons don't overcrowd the screen
const maxDistance = 140;

//icon
const icons = ['🌟'];

const mouse = {
  x: null,
  y: null,
  radius: 160
};

// Handle window resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Class (Icon-based)
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.size = Math.random() * 8 + 14; // Icon font size (14px - 22px)
    // Pick a random icon from the array
    this.icon = icons[Math.floor(Math.random() * icons.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off screen boundaries
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.font = `${this.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, this.x, this.y);
  }
}

// Populate icon particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Connect floating icons to each other with faint glowing lines
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.8 - dist / maxDistance})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // Connect icons to mouse cursor
    if (mouse.x && mouse.y) {
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mdist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - mdist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();


const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const playText = document.getElementById('play-text');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.textContent = '⏸';
    playText.textContent = 'PAUSE TRACK';
    playBtn.classList.add('playing');
  } else {
    audio.pause();
    playIcon.textContent = '▶';
    playText.textContent = 'PLAY TRACK';
    playBtn.classList.remove('playing');
  }
});

// Reset button when song finishes playing
audio.addEventListener('ended', () => {
  playIcon.textContent = '▶';
  playText.textContent = 'PLAY TRACK';
  playBtn.classList.remove('playing');
});
