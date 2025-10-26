// --- JS complet avec particules limitées au hero ---

// Mise à jour automatique de l'année
document.getElementById('year').textContent = new Date().getFullYear();

// Canvas et contexte
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Récupération du hero
const hero = document.querySelector('.hero');
let heroHeight = hero.offsetHeight;

// Souris
const mouse = { x: width / 2, y: heroHeight / 2 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Ajustement au redimensionnement
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  heroHeight = hero.offsetHeight;
  canvas.width = width;
  canvas.height = height;
});

// Classe Particule
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * heroHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.baseColor = [200, 132, 252];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Effet de répulsion de la souris
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = 120;

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      const force = (minDist - dist) / minDist;
      this.x -= Math.cos(angle) * force * 2;
      this.y -= Math.sin(angle) * force * 2;
      this.glow = 0.8 + (1 - dist / minDist) * 0.7;
    } else {
      this.glow = 0.8;
    }

    // Rebond uniquement dans le hero
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = heroHeight;
    if (this.y > heroHeight) this.y = 0;
  }

  draw() {
    if (this.y <= heroHeight) {
      ctx.fillStyle = `rgba(${this.baseColor[0]},${this.baseColor[1]},${this.baseColor[2]},${this.glow})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Création des particules
const particlesArray = [];
const numParticles = 150;
for (let i = 0; i < numParticles; i++) particlesArray.push(new Particle());

// Connexions entre particules
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const glow = ((1 - dist / 100) * 0.7 + 0.3) * 1.2;
        ctx.strokeStyle = `rgba(200,132,252,${glow})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animation principale
function animate() {
  ctx.clearRect(0, 0, width, height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

// Effet parallaxe du hero
const heroContent = document.getElementById('heroContent');
window.addEventListener('mousemove', e => {
  const x = (e.clientX - width / 2) / 50;
  const y = (e.clientY - heroHeight / 2) / 50;
  heroContent.style.transform = `translate(${x}px, ${y}px)`;
});

// Smooth scroll
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});