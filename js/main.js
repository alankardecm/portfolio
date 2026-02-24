// ============================================================
//  PORTFOLIO — Alan Moreira | main.js
// ============================================================

// ── Navbar scroll ────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ────────────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('#nav-links a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ── Typing animation ─────────────────────────────────────────
const roles = ['Desenvolvedor', 'BI & Dashboards', 'IA & Automação', 'Engenheiro de Dados', 'Power BI Specialist'];
let rolei = 0, chari = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
    const current = roles[rolei];
    if (!deleting) {
        typedEl.textContent = current.slice(0, ++chari);
        if (chari === current.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
        typedEl.textContent = current.slice(0, --chari);
        if (chari === 0) { deleting = false; rolei = (rolei + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
}
type();

// ── Particles ─────────────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.35 + 0.05;
        this.color = Math.random() > 0.5 ? '0,212,255' : '124,58,237';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 70; i++) particles.push(new Particle());

function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Connect particles
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animParticles);
}
animParticles();

// ── Skill bar reveal ─────────────────────────────────────────
function revealSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        bar.style.width = w + '%';
    });
}

// ── Counters ─────────────────────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (current >= target ? target : Math.floor(current)) + suffix;
        if (current >= target) clearInterval(timer);
    }, 25);
}

// ── Intersection Observer ─────────────────────────────────────
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');

        // Skill bars
        if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
            revealSkillBars();
        }
        // Counters
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);

        io.unobserve(entry.target);
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, section').forEach(el => io.observe(el));

// ── Project filter ────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (cat === 'all' || card.dataset.cat === cat) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ── Contact form ──────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    btn.textContent = '✅ Mensagem enviada!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
        btn.textContent = 'Enviar Mensagem';
        btn.style.background = '';
        this.reset();
    }, 3500);
});

// ── Matrix Rain Canvas ────────────────────────────────────────
(function initMatrix() {
    const mc = document.getElementById('matrix-canvas');
    if (!mc) return;
    const mctx = mc.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEF0123456789</>{}[]';
    let cols;

    function resize() {
        mc.width = window.innerWidth;
        mc.height = window.innerHeight;
        cols = Math.floor(mc.width / 16);
        drops.length = 0;
        for (let i = 0; i < cols; i++) drops.push(Math.random() * -100);
    }

    const drops = [];
    resize();
    window.addEventListener('resize', resize);

    function drawMatrix() {
        mctx.fillStyle = 'rgba(7,11,19,0.05)';
        mctx.fillRect(0, 0, mc.width, mc.height);
        mctx.font = '13px monospace';
        for (let i = 0; i < drops.length; i++) {
            const c = chars[Math.floor(Math.random() * chars.length)];
            const hue = Math.random() > 0.8 ? '0,212,255' : '16,185,129';
            mctx.fillStyle = `rgba(${hue},0.7)`;
            mctx.fillText(c, i * 16, drops[i] * 16);
            if (drops[i] * 16 > mc.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.5;
        }
    }
    setInterval(drawMatrix, 60);
})();

