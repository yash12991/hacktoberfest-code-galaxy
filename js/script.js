const container = document.querySelector('.container');
const starsContainer = document.querySelector('.stars');
const stardustContainer = document.querySelector('.stardust');
const mouseTrailContainer = document.querySelector('.mouse-trail');
const tooltip = document.getElementById('tooltip');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

// ====== THEME SWITCHER ======
const themeButton = document.getElementById('themeButton');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

// Enhanced Theme Manager Class
class ThemeManager {
    constructor() {
        this.themes = ['deep-space', 'cosmic-purple', 'emerald-dream', 'neon-sunset', 'arctic-aurora', 'solar-flare'];
        this.currentTheme = localStorage.getItem('galaxy-theme') || 'deep-space';
        this.themeHistory = JSON.parse(localStorage.getItem('theme-history') || '[]');
        this.autoRotateInterval = null;
        this.autoRotateActive = false;
        
        this.init();
    }
    
    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateActiveOption();
        
        // Setup event listeners
        this.setupThemeSelection();
        this.setupRandomTheme();
        this.setupAutoRotate();
        this.setupCustomizer();
        this.setupKeyboardShortcuts();
        this.setupThemePreview();
        
        // Initialize new features
        this.initializeFavorites();
        this.initializeImportExport();
    }
    
    updateActiveOption() {
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === this.currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    setTheme(themeName, addToHistory = true) {
        this.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('galaxy-theme', themeName);
        
        if (addToHistory) {
            this.addToHistory(themeName);
        }
        
        this.updateActiveOption();
        themeDropdown.classList.remove('show');
        createThemeChangeEffect();
    }
    
    addToHistory(themeName) {
        // Keep last 5 themes
        this.themeHistory = [themeName, ...this.themeHistory.filter(t => t !== themeName)].slice(0, 5);
        localStorage.setItem('theme-history', JSON.stringify(this.themeHistory));
    }
    
    setupThemeSelection() {
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.getAttribute('data-theme');
                this.setTheme(selectedTheme);
            });
        });
    }
    
    setupRandomTheme() {
        const randomBtn = document.getElementById('randomThemeBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                const availableThemes = this.themes.filter(t => t !== this.currentTheme);
                const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
                this.setTheme(randomTheme);
                
                // Visual feedback
                randomBtn.style.transform = 'rotate(360deg)';
                setTimeout(() => randomBtn.style.transform = 'rotate(0deg)', 500);
            });
        }
    }
    
    setupAutoRotate() {
        const autoRotateBtn = document.getElementById('autoRotateBtn');
        if (autoRotateBtn) {
            autoRotateBtn.addEventListener('click', () => {
                this.autoRotateActive = !this.autoRotateActive;
                
                if (this.autoRotateActive) {
                    autoRotateBtn.classList.add('active');
                    this.startAutoRotate();
                } else {
                    autoRotateBtn.classList.remove('active');
                    this.stopAutoRotate();
                }
            });
        }
    }
    
    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            const currentIndex = this.themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % this.themes.length;
            this.setTheme(this.themes[nextIndex], false);
        }, 5000); // Change theme every 5 seconds
    }
    
    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    setupCustomizer() {
        const customizeBtn = document.getElementById('customizeThemeBtn');
        const customizerModal = document.getElementById('themeCustomizerModal');
        const closeBtn = document.getElementById('closeCustomizer');
        const applyBtn = document.getElementById('applyCustomTheme');
        const resetBtn = document.getElementById('resetCustomTheme');
        
        if (customizeBtn && customizerModal) {
            customizeBtn.addEventListener('click', () => {
                customizerModal.classList.add('active');
                themeDropdown.classList.remove('show');
            });
            
            closeBtn?.addEventListener('click', () => {
                customizerModal.classList.remove('active');
            });
            
            // Live preview of custom colors
            const colorInputs = ['customPrimary', 'customSecondary', 'customAccent', 'customBg'];
            colorInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                input?.addEventListener('input', () => this.updateCustomPreview());
            });
            
            applyBtn?.addEventListener('click', () => this.applyCustomTheme());
            resetBtn?.addEventListener('click', () => this.resetCustomTheme());
        }
    }
    
    updateCustomPreview() {
        const primary = document.getElementById('customPrimary')?.value || '#ff7b00';
        const secondary = document.getElementById('customSecondary')?.value || '#00ff88';
        const accent = document.getElementById('customAccent')?.value || '#6a00ff';
        const bg = document.getElementById('customBg')?.value || '#1a1a2e';
        
        const preview = document.getElementById('customizerPreview');
        if (preview) {
            preview.style.setProperty('--bg-gradient-start', bg);
            preview.style.setProperty('--bg-gradient-end', this.adjustBrightness(bg, -20));
            preview.style.setProperty('--primary-color', primary);
            preview.style.setProperty('--secondary-color', secondary);
            preview.style.setProperty('--primary-glow', this.hexToRGBA(primary, 0.5));
            preview.style.setProperty('--secondary-glow', this.hexToRGBA(secondary, 0.7));
        }
    }
    
    applyCustomTheme() {
        const primary = document.getElementById('customPrimary')?.value || '#ff7b00';
        const secondary = document.getElementById('customSecondary')?.value || '#00ff88';
        const accent = document.getElementById('customAccent')?.value || '#6a00ff';
        const bg = document.getElementById('customBg')?.value || '#1a1a2e';
        
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primary);
        root.style.setProperty('--primary-light', this.adjustBrightness(primary, 20));
        root.style.setProperty('--primary-dark', this.adjustBrightness(primary, -20));
        root.style.setProperty('--primary-glow', this.hexToRGBA(primary, 0.3));
        
        root.style.setProperty('--secondary-color', secondary);
        root.style.setProperty('--secondary-dark', this.adjustBrightness(secondary, -20));
        root.style.setProperty('--secondary-glow', this.hexToRGBA(secondary, 0.7));
        
        root.style.setProperty('--accent-color', accent);
        root.style.setProperty('--accent-dark', this.adjustBrightness(accent, -20));
        root.style.setProperty('--accent-glow', this.hexToRGBA(accent, 0.7));
        
        root.style.setProperty('--bg-gradient-start', bg);
        root.style.setProperty('--bg-gradient-mid', this.adjustBrightness(bg, -10));
        root.style.setProperty('--bg-gradient-end', this.adjustBrightness(bg, -20));
        
        root.style.setProperty('--container-border', primary);
        root.style.setProperty('--container-shadow', this.hexToRGBA(primary, 0.3));
        root.style.setProperty('--orbit-color', this.hexToRGBA(primary, 0.3));
        
        // Save custom theme
        const customTheme = { primary, secondary, accent, bg };
        localStorage.setItem('custom-theme', JSON.stringify(customTheme));
        
        document.getElementById('themeCustomizerModal')?.classList.remove('active');
        createThemeChangeEffect();
    }
    
    resetCustomTheme() {
        // Reset to default values
        document.getElementById('customPrimary').value = '#ff7b00';
        document.getElementById('customSecondary').value = '#00ff88';
        document.getElementById('customAccent').value = '#6a00ff';
        document.getElementById('customBg').value = '#1a1a2e';
        this.updateCustomPreview();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Keys 1-6 for quick theme switch
            if (e.key >= '1' && e.key <= '6') {
                const index = parseInt(e.key) - 1;
                if (index < this.themes.length) {
                    this.setTheme(this.themes[index]);
                    this.showThemeNotification(this.themes[index]);
                }
            }
            
            // T key to toggle theme dropdown
            if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey) {
                if (document.activeElement.tagName !== 'INPUT') {
                    themeDropdown.classList.toggle('show');
                }
            }
            
            // R key for random theme
            if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
                e.preventDefault();
                document.getElementById('randomThemeBtn')?.click();
            }
        });
    }
    
    setupThemePreview() {
        themeOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                const themeName = option.getAttribute('data-theme');
                // Could add a preview effect here
                option.style.transform = 'scale(1.05)';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'scale(1)';
            });
        });
    }
    
    showThemeNotification(themeName) {
        const notification = document.createElement('div');
        notification.className = 'theme-quick-notification';
        notification.textContent = `Theme: ${this.formatThemeName(themeName)}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(13, 27, 42, 0.95);
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            padding: 10px 20px;
            color: white;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 0 20px var(--primary-glow);
            animation: theme-notif-slide 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    formatThemeName(name) {
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
    
    // ===== Favorites Management =====
    initializeFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('favorite-themes') || '[]');
        this.setupFavoritesListeners();
        this.updateFavoriteStars();
    }
    
    setupFavoritesListeners() {
        // Favorites button in controls
        const favoritesBtn = document.getElementById('favoritesBtn');
        const favoritesModal = document.getElementById('favoritesModal');
        const closeFavoritesBtn = document.getElementById('closeFavorites');
        
        favoritesBtn?.addEventListener('click', () => {
            this.renderFavorites();
            favoritesModal?.classList.add('active');
            themeDropdown.classList.remove('show');
        });
        
        closeFavoritesBtn?.addEventListener('click', () => {
            favoritesModal?.classList.remove('active');
        });
        
        // Star buttons on theme options
        document.querySelectorAll('.favorite-star').forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeName = star.closest('.theme-option').getAttribute('data-theme');
                this.toggleFavorite(themeName);
            });
        });
    }
    
    toggleFavorite(themeName) {
        const index = this.favorites.indexOf(themeName);
        
        if (index === -1) {
            // Add to favorites
            this.favorites.push(themeName);
        } else {
            // Remove from favorites
            this.favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorite-themes', JSON.stringify(this.favorites));
        this.updateFavoriteStars();
        this.renderFavorites();
    }
    
    updateFavoriteStars() {
        document.querySelectorAll('.favorite-star').forEach(star => {
            const themeName = star.closest('.theme-option').getAttribute('data-theme');
            if (this.favorites.includes(themeName)) {
                star.textContent = '★';
                star.classList.add('favorited');
            } else {
                star.textContent = '☆';
                star.classList.remove('favorited');
            }
        });
    }
    
    renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        
        if (!favoritesList) return;
        
        if (this.favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorite themes yet. Click ☆ on any theme to add it here!</p>';
            return;
        }
        
        favoritesList.innerHTML = this.favorites.map(themeName => {
            const themeColors = this.getThemeColors(themeName);
            return `
                <div class="theme-option" data-theme="${themeName}">
                    <span>${this.formatThemeName(themeName)}</span>
                    <button class="favorite-star favorited" data-theme="${themeName}">★</button>
                </div>
            `;
        }).join('');
        
        // Add click listeners to favorites list items
        favoritesList.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-star')) {
                    const themeName = option.getAttribute('data-theme');
                    this.setTheme(themeName);
                    document.getElementById('favoritesModal')?.classList.remove('active');
                }
            });
        });
        
        // Add listeners to stars in favorites list
        favoritesList.querySelectorAll('.favorite-star').forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeName = star.getAttribute('data-theme');
                this.toggleFavorite(themeName);
            });
        });
    }
    
    getThemeColors(themeName) {
        // Return theme colors for preview (could be expanded)
        return {
            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
        };
    }
    
    // ===== Import/Export Functionality =====
    initializeImportExport() {
        const shareBtn = document.getElementById('shareBtn');
        const shareModal = document.getElementById('shareModal');
        const closeShareBtn = document.getElementById('closeShare');
        
        shareBtn?.addEventListener('click', () => {
            this.exportCurrentTheme();
            shareModal?.classList.add('active');
            themeDropdown.classList.remove('show');
        });
        
        closeShareBtn?.addEventListener('click', () => {
            shareModal?.classList.remove('active');
        });
        
        // Export buttons
        document.getElementById('copyThemeCode')?.addEventListener('click', () => this.copyThemeCode());
        document.getElementById('downloadTheme')?.addEventListener('click', () => this.downloadTheme());
        
        // Import buttons
        document.getElementById('pasteThemeCode')?.addEventListener('click', () => this.pasteThemeCode());
        document.getElementById('uploadTheme')?.addEventListener('click', () => {
            document.getElementById('themeFileUpload')?.click();
        });
        
        document.getElementById('themeFileUpload')?.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
    }
    
    exportCurrentTheme() {
        const currentThemeData = {
            name: this.currentTheme,
            timestamp: new Date().toISOString(),
            colors: {
                primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
                accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
                bg: getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-start').trim()
            }
        };
        
        const themeJSON = JSON.stringify(currentThemeData, null, 2);
        document.getElementById('themeCodeDisplay').value = themeJSON;
    }
    
    copyThemeCode() {
        const themeCode = document.getElementById('themeCodeDisplay');
        themeCode.select();
        document.execCommand('copy');
        
        this.showImportMessage('Theme code copied to clipboard!', 'success');
    }
    
    downloadTheme() {
        const themeCode = document.getElementById('themeCodeDisplay').value;
        const blob = new Blob([themeCode], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentTheme}-theme-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showImportMessage('Theme downloaded successfully!', 'success');
    }
    
    pasteThemeCode() {
        const themeCode = document.getElementById('themeCodeInput').value.trim();
        
        if (!themeCode) {
            this.showImportMessage('Please paste theme code first!', 'error');
            return;
        }
        
        try {
            const themeData = JSON.parse(themeCode);
            this.importTheme(themeData);
        } catch (error) {
            this.showImportMessage('Invalid theme code format!', 'error');
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const themeData = JSON.parse(e.target.result);
                this.importTheme(themeData);
            } catch (error) {
                this.showImportMessage('Invalid theme file format!', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    importTheme(themeData) {
        if (!themeData || !themeData.colors) {
            this.showImportMessage('Invalid theme data!', 'error');
            return;
        }
        
        const { primary, secondary, accent, bg } = themeData.colors;
        
        // Apply the imported theme
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primary);
        root.style.setProperty('--primary-light', this.adjustBrightness(primary, 20));
        root.style.setProperty('--primary-dark', this.adjustBrightness(primary, -20));
        root.style.setProperty('--primary-glow', this.hexToRGBA(primary, 0.3));
        
        root.style.setProperty('--secondary-color', secondary);
        root.style.setProperty('--secondary-dark', this.adjustBrightness(secondary, -20));
        root.style.setProperty('--secondary-glow', this.hexToRGBA(secondary, 0.7));
        
        root.style.setProperty('--accent-color', accent);
        root.style.setProperty('--accent-dark', this.adjustBrightness(accent, -20));
        root.style.setProperty('--accent-glow', this.hexToRGBA(accent, 0.7));
        
        root.style.setProperty('--bg-gradient-start', bg);
        root.style.setProperty('--bg-gradient-mid', this.adjustBrightness(bg, -10));
        root.style.setProperty('--bg-gradient-end', this.adjustBrightness(bg, -20));
        
        this.showImportMessage(`Theme "${themeData.name}" imported successfully!`, 'success');
        document.getElementById('shareModal')?.classList.remove('active');
        createThemeChangeEffect();
        
        // Clear input
        document.getElementById('themeCodeInput').value = '';
    }
    
    showImportMessage(message, type) {
        const existingMsg = document.querySelector('.import-message');
        if (existingMsg) existingMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `import-message ${type}`;
        msgDiv.textContent = message;
        
        const shareSection = document.querySelector('.share-section');
        shareSection.appendChild(msgDiv);
        
        setTimeout(() => msgDiv.remove(), 3000);
    }
}

// Initialize Enhanced Theme Manager
const themeManager = new ThemeManager();

// Toggle dropdown visibility
themeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('show');
    }
});

// Visual effect when changing themes
function createThemeChangeEffect() {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.top = '0';
    effect.style.left = '0';
    effect.style.width = '100vw';
    effect.style.height = '100vh';
    effect.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9999';
    effect.style.opacity = '0';
    effect.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(effect);
    
    requestAnimationFrame(() => {
        effect.style.opacity = '1';
        setTimeout(() => {
            effect.style.opacity = '0';
            setTimeout(() => effect.remove(), 500);
        }, 200);
    });
}

// ====== MUSIC TOGGLE ======
if (musicToggle && bgMusic) {
    // Load saved music preference
    const savedMusicState = localStorage.getItem('galaxyMusicEnabled');
    if (savedMusicState !== null) {
        musicToggle.checked = savedMusicState === 'true';
        if (musicToggle.checked) {
            bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
        }
    }
    
    musicToggle.addEventListener('change', () => {
        if (musicToggle.checked) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        // Save music preference
        localStorage.setItem('galaxyMusicEnabled', musicToggle.checked);
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

// ====== ASTEROID DODGING GAME ======
class AsteroidGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.gameLaunchBtn = document.getElementById('gameLaunchBtn');
        this.closeGameBtn = document.getElementById('closeGame');
        this.restartBtn = document.getElementById('restartGame');
        
        this.player = {
            x: 50,
            y: 200,
            width: 30,
            height: 30,
            speed: 5,
            color: '#00ff88'
        };
        
        this.asteroids = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameRunning = false;
        this.gamePaused = false;
        this.highScore = parseInt(localStorage.getItem('asteroidGameHighScore') || '0');
        
        this.keys = {};
        
        this.init();
    }
    
    init() {
        // Load high score
        document.getElementById('highScore').textContent = this.highScore;
        
        // Event listeners
        this.gameLaunchBtn.addEventListener('click', () => this.openGame());
        this.closeGameBtn.addEventListener('click', () => this.closeGame());
        this.restartBtn.addEventListener('click', () => this.restart());
        
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' && this.gameRunning) {
                e.preventDefault();
                this.gamePaused = !this.gamePaused;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    openGame() {
        this.gameOverlay.classList.add('active');
        this.restart();
    }
    
    closeGame() {
        this.gameOverlay.classList.remove('active');
        this.gameRunning = false;
        this.gamePaused = false;
    }
    
    restart() {
        this.player.x = 50;
        this.player.y = 200;
        this.asteroids = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOverScreen.classList.remove('show');
        
        this.updateUI();
        this.gameLoop();
    }
    
    spawnAsteroid() {
        const size = 20 + Math.random() * 30;
        const asteroid = {
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - size),
            width: size,
            height: size,
            speed: 2 + Math.random() * 3,
            color: '#8b8b8b'
        };
        this.asteroids.push(asteroid);
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                color: color
            });
        }
    }
    
    updatePlayer() {
        // Movement controls
        if (this.keys['arrowup'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
    }
    
    updateAsteroids() {
        // Spawn new asteroids
        if (Math.random() < 0.02) {
            this.spawnAsteroid();
        }
        
        // Update existing asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.x -= asteroid.speed;
            
            // Remove off-screen asteroids and increase score
            if (asteroid.x + asteroid.width < 0) {
                this.asteroids.splice(i, 1);
                this.score += 10;
                this.updateUI();
                continue;
            }
            
            // Collision detection
            if (this.checkCollision(this.player, asteroid)) {
                this.createParticles(asteroid.x, asteroid.y, '#ff0000');
                this.asteroids.splice(i, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = (Date.now() * 0.05 + i * 50) % this.canvas.width;
            const y = (i * 37) % this.canvas.height;
            this.ctx.fillRect(x, y, 2, 2);
        }
        
        // Draw player (spaceship)
        this.ctx.fillStyle = this.player.color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.player.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.width, this.player.y + this.player.height / 2);
        this.ctx.lineTo(this.player.x, this.player.y);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw exhaust
        this.ctx.fillStyle = '#ff7b00';
        this.ctx.globalAlpha = 0.5 + Math.random() * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x, this.player.y + 10);
        this.ctx.lineTo(this.player.x - 10, this.player.y + this.player.height / 2);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height - 10);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        // Draw asteroids
        for (const asteroid of this.asteroids) {
            this.ctx.fillStyle = asteroid.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = asteroid.color;
            this.ctx.beginPath();
            // Draw irregular asteroid shape
            const sides = 6;
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const radius = asteroid.width / 2 + Math.sin(Date.now() * 0.001 + i) * 3;
                const x = asteroid.x + asteroid.width / 2 + Math.cos(angle) * radius;
                const y = asteroid.y + asteroid.height / 2 + Math.sin(angle) * radius;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // Draw particles
        for (const p of this.particles) {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
        
        // Draw pause text
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.font = 'bold 40px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '16px Courier New';
            this.ctx.fillText('Press SPACE to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }
    
    updateUI() {
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLives').textContent = this.lives;
    }
    
    gameOver() {
        this.gameRunning = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('asteroidGameHighScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
        }
        
        document.getElementById('finalScore').textContent = this.score;
        this.gameOverScreen.classList.add('show');
        
        // Create celebration particles
        this.createParticles(this.canvas.width / 2, this.canvas.height / 2, '#00ff88');
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.gamePaused) {
            this.updatePlayer();
            this.updateAsteroids();
            this.updateParticles();
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game
const asteroidGame = new AsteroidGame();

// ====== TOUCH GESTURE CONTROLS FOR MOBILE ======
class TouchGestureHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
        this.lastTap = 0;
        this.initialDistance = 0;
        this.currentScale = 1;
        
        this.minSwipeDistance = 50;
        this.maxSwipeTime = 500;
        this.doubleTapDelay = 300;
        
        this.init();
    }
    
    init() {
        // Single touch events for swipes and taps
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Multi-touch events for pinch zoom
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                this.handlePinchStart(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                this.handlePinchMove(e);
            }
        }, { passive: false });
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
        }
    }
    
    handleTouchMove(e) {
        if (e.touches.length === 1) {
            this.touchEndX = e.touches[0].clientX;
            this.touchEndY = e.touches[0].clientY;
        }
    }
    
    handleTouchEnd(e) {
        if (e.changedTouches.length === 1) {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            const touchDuration = Date.now() - this.touchStartTime;
            
            // Check for double tap
            const currentTime = Date.now();
            if (currentTime - this.lastTap < this.doubleTapDelay) {
                this.handleDoubleTap(e);
                this.lastTap = 0;
            } else {
                this.lastTap = currentTime;
            }
            
            // Check for swipe
            if (touchDuration < this.maxSwipeTime) {
                this.handleSwipe();
            }
        }
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > this.minSwipeDistance || absY > this.minSwipeDistance) {
            if (absX > absY) {
                // Horizontal swipe
                if (deltaX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }
    
    onSwipeLeft() {
        console.log('Swipe Left detected');
        this.createSwipeEffect('left');
        // Cycle to next theme
        const themeOptions = document.querySelectorAll('.theme-option');
        const activeTheme = document.querySelector('.theme-option.active');
        const currentIndex = Array.from(themeOptions).indexOf(activeTheme);
        const nextIndex = (currentIndex + 1) % themeOptions.length;
        themeOptions[nextIndex].click();
    }
    
    onSwipeRight() {
        console.log('Swipe Right detected');
        this.createSwipeEffect('right');
        // Cycle to previous theme
        const themeOptions = document.querySelectorAll('.theme-option');
        const activeTheme = document.querySelector('.theme-option.active');
        const currentIndex = Array.from(themeOptions).indexOf(activeTheme);
        const prevIndex = (currentIndex - 1 + themeOptions.length) % themeOptions.length;
        themeOptions[prevIndex].click();
    }
    
    onSwipeUp() {
        console.log('Swipe Up detected');
        this.createSwipeEffect('up');
        // Toggle music
        const musicToggle = document.getElementById('musicToggle');
        musicToggle.checked = !musicToggle.checked;
        musicToggle.dispatchEvent(new Event('change'));
    }
    
    onSwipeDown() {
        console.log('Swipe Down detected');
        this.createSwipeEffect('down');
        // Open game
        if (!document.getElementById('gameOverlay').classList.contains('active')) {
            asteroidGame.openGame();
        }
    }
    
    handleDoubleTap(e) {
        console.log('Double Tap detected');
        const x = e.changedTouches[0].clientX;
        const y = e.changedTouches[0].clientY;
        
        // Create burst effect at double tap location
        this.createDoubleTapEffect(x, y);
        
        // Trigger warp effect
        const mainRepo = document.getElementById('mainRepo');
        mainRepo.click();
    }
    
    handlePinchStart(e) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        this.initialDistance = this.getDistance(touch1, touch2);
    }
    
    handlePinchMove(e) {
        e.preventDefault();
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = this.getDistance(touch1, touch2);
            
            if (this.initialDistance > 0) {
                const scale = currentDistance / this.initialDistance;
                this.handlePinchZoom(scale);
            }
        }
    }
    
    getDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    handlePinchZoom(scale) {
        console.log('Pinch zoom:', scale);
        
        // Visual feedback: scale pulse effect
        const container = document.querySelector('.container');
        if (scale > 1.1) {
            // Zoom in effect
            container.style.transform = 'scale(1.02)';
            this.createZoomEffect('in');
        } else if (scale < 0.9) {
            // Zoom out effect
            container.style.transform = 'scale(0.98)';
            this.createZoomEffect('out');
        }
        
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 200);
    }
    
    createSwipeEffect(direction) {
        const indicator = document.createElement('div');
        indicator.className = 'gesture-indicator swipe-' + direction;
        indicator.textContent = '← → ↑ ↓'.split(' ')['left right up down'.split(' ').indexOf(direction)];
        
        indicator.style.position = 'fixed';
        indicator.style.fontSize = '60px';
        indicator.style.color = 'var(--primary-color)';
        indicator.style.textShadow = '0 0 20px var(--primary-glow)';
        indicator.style.zIndex = '10000';
        indicator.style.pointerEvents = 'none';
        indicator.style.top = '50%';
        indicator.style.left = '50%';
        indicator.style.transform = 'translate(-50%, -50%)';
        indicator.style.opacity = '0';
        indicator.style.transition = 'all 0.5s ease';
        
        document.body.appendChild(indicator);
        
        requestAnimationFrame(() => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 500);
            }, 300);
        });
    }
    
    createDoubleTapEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
            particle.style.boxShadow = '0 0 10px currentColor';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'ease-out'
            });
            
            setTimeout(() => particle.remove(), 1200);
        }
    }
    
    createZoomEffect(type) {
        const effect = document.createElement('div');
        effect.className = 'zoom-indicator';
        effect.textContent = type === 'in' ? '🔍+' : '🔍−';
        effect.style.position = 'fixed';
        effect.style.fontSize = '40px';
        effect.style.top = '20px';
        effect.style.right = '20px';
        effect.style.zIndex = '10000';
        effect.style.pointerEvents = 'none';
        effect.style.opacity = '0';
        effect.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(effect);
        
        requestAnimationFrame(() => {
            effect.style.opacity = '1';
            setTimeout(() => {
                effect.style.opacity = '0';
                setTimeout(() => effect.remove(), 300);
            }, 300);
        });
    }
}

// Initialize touch gestures for mobile
const touchGestures = new TouchGestureHandler();

// ====== ACHIEVEMENT SYSTEM ======
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_visit',
                name: 'Welcome Aboard!',
                description: 'Visit the Hacktoberfest Galaxy',
                icon: '🌌',
                unlocked: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 'theme_changer',
                name: 'Style Master',
                description: 'Change the theme 3 times',
                icon: '🎨',
                unlocked: false,
                progress: 0,
                maxProgress: 3
            },
            {
                id: 'music_lover',
                name: 'Music Enthusiast',
                description: 'Toggle music on and off 5 times',
                icon: '🎵',
                unlocked: false,
                progress: 0,
                maxProgress: 5
            },
            {
                id: 'click_master',
                name: 'Click Master',
                description: 'Click 50 times anywhere',
                icon: '🖱️',
                unlocked: false,
                progress: 0,
                maxProgress: 50
            },
            {
                id: 'pr_explorer',
                name: 'PR Explorer',
                description: 'Hover over 10 different Pull Requests',
                icon: '🔍',
                unlocked: false,
                progress: 0,
                maxProgress: 10
            },
            {
                id: 'warp_speed',
                name: 'Warp Speed Pilot',
                description: 'Trigger warp speed 3 times',
                icon: '🚀',
                unlocked: false,
                progress: 0,
                maxProgress: 3
            },
            {
                id: 'code_rain',
                name: 'Code Rain Master',
                description: 'Trigger code rain 5 times',
                icon: '💻',
                unlocked: false,
                progress: 0,
                maxProgress: 5
            },
            {
                id: 'galaxy_burst',
                name: 'Particle Artist',
                description: 'Create 10 galaxy bursts',
                icon: '💥',
                unlocked: false,
                progress: 0,
                maxProgress: 10
            },
            {
                id: 'game_player',
                name: 'Space Cadet',
                description: 'Play the asteroid game',
                icon: '🎮',
                unlocked: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 'high_scorer',
                name: 'Asteroid Master',
                description: 'Score 500+ in the asteroid game',
                icon: '🏆',
                unlocked: false,
                progress: 0,
                maxProgress: 500
            }
        ];
        
        this.achievementsToggle = document.getElementById('achievementsToggle');
        this.achievementsDropdown = document.getElementById('achievementsDropdown');
        this.achievementsList = document.getElementById('achievementsList');
        this.achievementNotification = document.getElementById('achievementNotification');
        this.resetBtn = document.getElementById('resetAchievements');
        
        this.loadProgress();
        this.init();
        this.renderAchievements();
        this.updateCounter();
        
        // Auto-unlock first visit
        this.updateProgress('first_visit', 1);
    }
    
    init() {
        // Toggle dropdown
        this.achievementsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.achievementsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.achievementsToggle.contains(e.target) && !this.achievementsDropdown.contains(e.target)) {
                this.achievementsDropdown.classList.remove('show');
            }
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all achievements?')) {
                this.resetProgress();
            }
        });
        
        // Track interactions
        this.setupTrackers();
    }
    
    setupTrackers() {
        // Track theme changes
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.updateProgress('theme_changer', 1);
            });
        });
        
        // Track music toggles
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('change', () => {
                this.updateProgress('music_lover', 1);
            });
        }
        
        // Track clicks
        document.addEventListener('click', () => {
            this.updateProgress('click_master', 1);
        });
        
        // Track PR hovers
        const hoveredPRs = new Set();
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('pr') && !hoveredPRs.has(e.target)) {
                hoveredPRs.add(e.target);
                this.updateProgress('pr_explorer', 1);
            }
        });
        
        // Track warp speed
        const mainRepo = document.getElementById('mainRepo');
        if (mainRepo) {
            mainRepo.addEventListener('click', () => {
                this.updateProgress('warp_speed', 1);
            });
        }
        
        // Track code rain
        const contributors = document.querySelectorAll('.contributor');
        contributors.forEach(contributor => {
            contributor.addEventListener('click', () => {
                this.updateProgress('code_rain', 1);
            });
        });
        
        // Track galaxy bursts
        container.addEventListener('dblclick', () => {
            this.updateProgress('galaxy_burst', 1);
        });
    }
    
    updateProgress(achievementId, amount) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;
        
        achievement.progress = Math.min(achievement.progress + amount, achievement.maxProgress);
        
        // Check if unlocked
        if (achievement.progress >= achievement.maxProgress) {
            achievement.unlocked = true;
            this.showNotification(achievement);
        }
        
        this.saveProgress();
        this.renderAchievements();
        this.updateCounter();
    }
    
    showNotification(achievement) {
        const title = document.getElementById('notificationTitle');
        const description = document.getElementById('notificationDescription');
        
        title.textContent = 'Achievement Unlocked!';
        description.textContent = achievement.name;
        
        this.achievementNotification.classList.add('show');
        
        setTimeout(() => {
            this.achievementNotification.classList.remove('show');
        }, 4000);
    }
    
    renderAchievements() {
        this.achievementsList.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const item = document.createElement('div');
            item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
            
            item.innerHTML = `
                <div class="achievement-item-icon">${achievement.icon}</div>
                <div class="achievement-item-info">
                    <div class="achievement-item-name">${achievement.name}</div>
                    <div class="achievement-item-desc">${achievement.description}</div>
                    ${!achievement.unlocked ? `
                        <div class="achievement-item-progress">
                            <div class="achievement-item-progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            this.achievementsList.appendChild(item);
        });
    }
    
    updateCounter() {
        const unlockedCount = this.achievements.filter(a => a.unlocked).length;
        document.getElementById('achievementCount').textContent = unlockedCount;
        document.getElementById('totalAchievements').textContent = this.achievements.length;
    }
    
    saveProgress() {
        localStorage.setItem('galaxyAchievements', JSON.stringify(this.achievements));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('galaxyAchievements');
        if (saved) {
            try {
                const savedAchievements = JSON.parse(saved);
                savedAchievements.forEach(saved => {
                    const achievement = this.achievements.find(a => a.id === saved.id);
                    if (achievement) {
                        achievement.progress = saved.progress;
                        achievement.unlocked = saved.unlocked;
                    }
                });
            } catch (e) {
                console.error('Failed to load achievements:', e);
            }
        }
    }
    
    resetProgress() {
        this.achievements.forEach(achievement => {
            achievement.progress = 0;
            achievement.unlocked = false;
        });
        this.saveProgress();
        this.renderAchievements();
        this.updateCounter();
        
        // Re-unlock first visit
        setTimeout(() => {
            this.updateProgress('first_visit', 1);
        }, 100);
    }
    
    // Method to be called from game
    updateGameAchievements(score) {
        this.updateProgress('game_player', 1);
        if (score >= 500) {
            this.updateProgress('high_scorer', score);
        }
    }
}

// Initialize achievement system
const achievementSystem = new AchievementSystem();

// Connect achievements to game
if (asteroidGame) {
    const originalGameOver = asteroidGame.gameOver;
    asteroidGame.gameOver = function() {
        originalGameOver.call(this);
        achievementSystem.updateGameAchievements(this.score);
    };
}

// ====== USER PREFERENCES MANAGER ======
class UserPreferencesManager {
    constructor() {
        this.preferences = {
            theme: 'deep-space',
            musicEnabled: false,
            highScore: 0,
            achievements: [],
            stats: {
                totalClicks: 0,
                totalVisits: 0,
                totalGamePlays: 0,
                favoriteTheme: '',
                lastVisit: null
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadPreferences();
        this.updateStats();
        this.displayStats();
        
        // Track page visibility for visit counting
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.savePreferences();
            }
        });
        
        // Save preferences before page unload
        window.addEventListener('beforeunload', () => {
            this.savePreferences();
        });
        
        // Periodic auto-save (every 30 seconds)
        setInterval(() => {
            this.savePreferences();
        }, 30000);
    }
    
    loadPreferences() {
        const saved = localStorage.getItem('galaxyUserPreferences');
        if (saved) {
            try {
                const savedPrefs = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...savedPrefs };
            } catch (e) {
                console.error('Failed to load preferences:', e);
            }
        }
    }
    
    savePreferences() {
        // Update current preferences
        this.preferences.theme = document.documentElement.getAttribute('data-theme');
        this.preferences.musicEnabled = document.getElementById('musicToggle')?.checked || false;
        this.preferences.highScore = parseInt(localStorage.getItem('asteroidGameHighScore') || '0');
        this.preferences.stats.lastVisit = new Date().toISOString();
        
        localStorage.setItem('galaxyUserPreferences', JSON.stringify(this.preferences));
    }
    
    updateStats() {
        this.preferences.stats.totalVisits++;
        
        // Track clicks
        document.addEventListener('click', () => {
            this.preferences.stats.totalClicks++;
        });
        
        // Track game plays
        const gameLaunchBtn = document.getElementById('gameLaunchBtn');
        if (gameLaunchBtn) {
            gameLaunchBtn.addEventListener('click', () => {
                this.preferences.stats.totalGamePlays++;
            });
        }
        
        // Track favorite theme
        const themeOptions = document.querySelectorAll('.theme-option');
        const themeUsage = {};
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                themeUsage[theme] = (themeUsage[theme] || 0) + 1;
                
                // Find most used theme
                let maxUses = 0;
                let favoriteTheme = theme;
                for (const [t, uses] of Object.entries(themeUsage)) {
                    if (uses > maxUses) {
                        maxUses = uses;
                        favoriteTheme = t;
                    }
                }
                this.preferences.stats.favoriteTheme = favoriteTheme;
            });
        });
    }
    
    displayStats() {
        // Create a stats display that can be toggled
        const statsDisplay = document.createElement('div');
        statsDisplay.id = 'userStatsDisplay';
        statsDisplay.style.cssText = `
            position: absolute;
            top: 120px;
            right: 30px;
            background: rgba(13, 27, 42, 0.8);
            border: 1px solid var(--secondary-color);
            border-radius: 10px;
            padding: 15px;
            color: white;
            font-size: 12px;
            z-index: 15;
            backdrop-filter: blur(5px);
            display: none;
        `;
        
        const updateDisplay = () => {
            const lastVisit = this.preferences.stats.lastVisit 
                ? new Date(this.preferences.stats.lastVisit).toLocaleDateString()
                : 'First visit';
            
            statsDisplay.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; color: var(--secondary-color);">📊 Your Stats</div>
                <div style="margin: 5px 0;">Visits: ${this.preferences.stats.totalVisits}</div>
                <div style="margin: 5px 0;">Clicks: ${this.preferences.stats.totalClicks}</div>
                <div style="margin: 5px 0;">Games Played: ${this.preferences.stats.totalGamePlays}</div>
                <div style="margin: 5px 0;">High Score: ${this.preferences.highScore}</div>
                <div style="margin: 5px 0;">Last Visit: ${lastVisit}</div>
                ${this.preferences.stats.favoriteTheme ? `<div style="margin: 5px 0;">Favorite Theme: ${this.preferences.stats.favoriteTheme}</div>` : ''}
            `;
        };
        
        // Add toggle button
        const statsToggle = document.createElement('button');
        statsToggle.textContent = '📊';
        statsToggle.style.cssText = `
            position: absolute;
            top: 90px;
            right: 30px;
            background: rgba(13, 27, 42, 0.8);
            border: 2px solid var(--secondary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 16;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px var(--secondary-glow);
        `;
        
        statsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = statsDisplay.style.display !== 'none';
            statsDisplay.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                updateDisplay();
            }
        });
        
        statsToggle.addEventListener('mouseenter', () => {
            statsToggle.style.transform = 'scale(1.1)';
            statsToggle.style.boxShadow = '0 0 20px var(--secondary-glow)';
        });
        
        statsToggle.addEventListener('mouseleave', () => {
            statsToggle.style.transform = 'scale(1)';
            statsToggle.style.boxShadow = '0 0 10px var(--secondary-glow)';
        });
        
        // Close stats when clicking outside
        document.addEventListener('click', (e) => {
            if (!statsToggle.contains(e.target) && !statsDisplay.contains(e.target)) {
                statsDisplay.style.display = 'none';
            }
        });
        
        document.body.appendChild(statsToggle);
        document.body.appendChild(statsDisplay);
    }
    
    exportData() {
        const data = {
            preferences: this.preferences,
            achievements: localStorage.getItem('galaxyAchievements'),
            highScore: localStorage.getItem('asteroidGameHighScore'),
            theme: localStorage.getItem('galaxy-theme')
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `galaxy-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.preferences) {
                localStorage.setItem('galaxyUserPreferences', JSON.stringify(data.preferences));
            }
            if (data.achievements) {
                localStorage.setItem('galaxyAchievements', data.achievements);
            }
            if (data.highScore) {
                localStorage.setItem('asteroidGameHighScore', data.highScore);
            }
            if (data.theme) {
                localStorage.setItem('galaxy-theme', data.theme);
            }
            
            alert('Data imported successfully! Please refresh the page.');
        } catch (e) {
            alert('Failed to import data: ' + e.message);
        }
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear ALL saved data? This cannot be undone!')) {
            localStorage.removeItem('galaxyUserPreferences');
            localStorage.removeItem('galaxyAchievements');
            localStorage.removeItem('asteroidGameHighScore');
            localStorage.removeItem('galaxy-theme');
            localStorage.removeItem('galaxyMusicEnabled');
            
            alert('All data cleared! The page will now reload.');
            location.reload();
        }
    }
}

// Initialize preferences manager
const preferencesManager = new UserPreferencesManager();

// Add export/import/clear controls to settings
const settingsPanel = document.createElement('div');
settingsPanel.style.cssText = `
    position: absolute;
    bottom: 80px;
    left: 25px;
    z-index: 50;
    display: flex;
    gap: 10px;
`;

const createButton = (text, onClick) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
        background: rgba(13, 27, 42, 0.8);
        border: 2px solid var(--primary-color);
        border-radius: 8px;
        padding: 8px 12px;
        color: white;
        font: 11px 'Courier New', monospace;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px var(--primary-glow);
    `;
    btn.addEventListener('click', onClick);
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 0 20px var(--primary-glow)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 0 10px var(--primary-glow)';
    });
    return btn;
};

settingsPanel.appendChild(createButton('💾 Export', () => preferencesManager.exportData()));
settingsPanel.appendChild(createButton('🗑️ Clear', () => preferencesManager.clearAllData()));

document.body.appendChild(settingsPanel);

console.log('🌌 Hacktoberfest Code Galaxy - Interactive Features Loaded!');
console.log('✨ Features: Mini-Game | Touch Gestures | Achievements | User Preferences');
console.log('🎮 Try the Asteroid Dodger game!');
console.log('📱 On mobile: Swipe to change themes, pinch to zoom, double-tap for effects!');
console.log('🏆 Unlock all 10 achievements by exploring!');