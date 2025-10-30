const container = document.querySelector('.container');
const starsContainer = document.querySelector('.stars');
const stardustContainer = document.querySelector('.stardust');
const mouseTrailContainer = document.querySelector('.mouse-trail');
const tooltip = document.getElementById('tooltip');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

// ====== MUSIC TOGGLE ======
if (musicToggle && bgMusic) {
    musicToggle.addEventListener('change', () => {
        musicToggle.checked ? bgMusic.play() : bgMusic.pause();
    });
}

// ====== MOUSE TRAIL SYSTEM ======
let mouseX = 0, mouseY = 0, trailParticles = [], lastTrailTime = 0;
const trailInterval = 50;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const currentTime = Date.now();
    if (currentTime - lastTrailTime > trailInterval) {
        createTrailParticle(mouseX, mouseY);
        lastTrailTime = currentTime;
    }
});

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('trail-particle');
    const types = ['normal', 'sparkle', 'magic'];
    const type = types[Math.floor(Math.random() * types.length)];
    particle.classList.add(type);
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y + offsetY}px`;
    mouseTrailContainer.appendChild(particle);
    setTimeout(() => particle.remove(), type === 'magic' ? 2000 : type === 'sparkle' ? 1000 : 1500);
}

document.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createTrailParticle(e.clientX, e.clientY), i * 20);
    }
});

// ====== STARS GENERATION ======
for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const sizes = ['small', 'medium', 'large'];
    star.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
    if (Math.random() > 0.85) star.classList.add('colored');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    starsContainer.appendChild(star);
}

// ====== ASTEROIDS ======
function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    const sizes = ['small', 'medium', 'large'];
    asteroid.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
    asteroid.style.left = `${-50 + Math.random() * 100}px`;
    asteroid.style.top = `${Math.random() * 100}%`;
    asteroid.style.animationDuration = `${20 + Math.random() * 20}s`;
    asteroid.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(asteroid);
    setTimeout(() => { asteroid.remove(); createAsteroid(); }, (20 + Math.random() * 20) * 1000);
}
for (let i = 0; i < 5; i++) setTimeout(createAsteroid, i * 2000);

// ====== STARDUST ======
for (let i = 0; i < 100; i++) {
    const dust = document.createElement('div');
    dust.classList.add('dust-particle');
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${Math.random() * 100}%`;
    dust.style.animationDelay = `${Math.random() * 20}s`;
    dust.style.animationDuration = `${15 + Math.random() * 10}s`;
    stardustContainer.appendChild(dust);
}

// ====== PULL REQUEST ORBITS + TOOLTIP ======
const orbits = [
    document.querySelector('.orbit-1'),
    document.querySelector('.orbit-2'),
    document.querySelector('.orbit-3')
];

orbits.forEach((orbit, index) => {
    const count = 6 + index * 3;
    for (let i = 0; i < count; i++) {
        const pr = document.createElement('div');
        pr.classList.add('pr');
        const status = Math.random() > 0.5 ? 'merged' : 'open';
        pr.classList.add(status);
        const angle = (i / count) * 360;
        const radius = orbit.offsetWidth / 2;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        pr.style.left = `calc(50% + ${x}px)`;
        pr.style.top = `calc(50% + ${y}px)`;
        pr.style.transform = `translate(-50%, -50%)`;
        pr.textContent = `PR${index + 1}-${i + 1}`;
        pr.addEventListener('mouseenter', (e) => {
            tooltip.textContent = `${status.toUpperCase()} - ${pr.textContent}\nOrbit ${index + 1}`;
            tooltip.style.left = `${e.pageX + 15}px`;
            tooltip.style.top = `${e.pageY - 30}px`;
            tooltip.classList.add('show');
        });
        pr.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
        orbit.appendChild(pr);
    }
});

// ====== SATELLITES ======
function createSatellite(orbitRadius, speed) {
    const satellite = document.createElement('div');
    satellite.classList.add('satellite');
    let angle = Math.random() * 360;
    function update() {
        angle += speed;
        const x = orbitRadius * Math.cos(angle * Math.PI / 180);
        const y = orbitRadius * Math.sin(angle * Math.PI / 180);
        satellite.style.left = `calc(50% + ${x}px)`;
        satellite.style.top = `calc(50% + ${y}px)`;
        satellite.style.transform = 'translate(-50%, -50%)';
        requestAnimationFrame(update);
    }
    container.appendChild(satellite);
    update();
}
createSatellite(120, 0.3);
createSatellite(180, -0.2);
createSatellite(240, 0.25);

// ====== CONTRIBUTORS + CODE RAIN ======
const contributorsContainer = document.querySelector('.contributors');
const contributorNames = ['ALEX', 'SAM', 'JAMIE', 'TAY', 'RILEY', 'CASEY', 'JORDAN', 'SKY'];
contributorNames.forEach(name => {
    const contributor = document.createElement('div');
    contributor.classList.add('contributor');
    contributor.textContent = name;
    contributor.addEventListener('click', () => createCodeRain(contributor));
    contributorsContainer.appendChild(contributor);
});

function createCodeRain(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const symbols = ['{}', '[]', '()', '<>', '//', '/', 'git', 'pr', 'fix'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const codeRain = document.createElement('div');
            codeRain.classList.add('code-rain');
            codeRain.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            codeRain.style.left = `${rect.left - containerRect.left + Math.random() * 50}px`;
            codeRain.style.top = `${rect.top - containerRect.top}px`;
            container.appendChild(codeRain);
            setTimeout(() => codeRain.remove(), 3000);
        }, i * 100);
    }
}

// ====== WARP SPEED + GALAXY BURST ======
const mainRepo = document.getElementById('mainRepo');
mainRepo.addEventListener('click', () => {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ring = document.createElement('div');
            ring.classList.add('pulse-ring');
            container.appendChild(ring);
            setTimeout(() => ring.remove(), 1500);
        }, i * 200);
    }
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const warp = document.createElement('div');
            warp.classList.add('warp-line');
            warp.style.left = `${Math.random() * 100}%`;
            warp.style.top = '0';
            warp.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
            container.appendChild(warp);
            setTimeout(() => warp.remove(), 600);
        }, i * 40);
    }
});

container.addEventListener('dblclick', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.borderRadius = '50%';
        p.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.boxShadow = '0 0 10px currentColor';
        p.style.pointerEvents = 'none';
        const angle = (i / 12) * Math.PI * 2;
        const dist = 80 + Math.random() * 40;
        const endX = x + Math.cos(angle) * dist;
        const endY = y + Math.sin(angle) * dist;
        p.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
        ], { duration: 800 + Math.random() * 400, easing: 'ease-out' });
        container.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
});

// ====== METEOR SHOWER ======
function createMeteor() {
    const meteor = document.createElement('div');
    meteor.classList.add('meteor');
    meteor.style.top = `${Math.random() * 50}%`;
    meteor.style.left = `${Math.random() * 50}%`;
    meteor.style.animationDuration = `${1.5 + Math.random()}s`;
    container.appendChild(meteor);
    setTimeout(() => meteor.remove(), 2000);
}
setInterval(createMeteor, 1200);

// ====== STATS COUNTER ANIMATION ======
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stats on page load
setTimeout(() => {
    animateCounter(document.getElementById('statPR'), 42, 2000);
    animateCounter(document.getElementById('statContrib'), 18, 2000);
    animateCounter(document.getElementById('statRepos'), 7, 2000);
    animateCounter(document.getElementById('statMerged'), 35, 2000);
}, 1000);