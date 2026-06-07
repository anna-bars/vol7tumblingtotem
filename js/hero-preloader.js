(function () {

    const HERO_IMAGES = [
        './img/hero/background.webp',
        './img/hero/darkness.webp',
        './img/hero/layer-1-sky.webp',
        './img/hero/layer-2-mountains.webp',
        './img/hero/layer-3-hills-back.webp',
        './img/hero/layer-4-temple.webp',
        './img/hero/0layer-5-jungle-mid.webp',
        './img/hero/0layer-6-jungle-front.webp',
        './img/hero/0layer-7-foreground.webp',
        './img/hero/bottom-line.webp',
        './img/hero/leaves-vines-left.webp',
        './img/hero/leaves-vines-right.webp',
        './img/hero/fog/fog_olips_left.webp',
        './img/hero/fog/fog_olips_right.webp',
        './img/hero/fog/fog-triangle-left.png',
        './img/hero/fog/fog-triangle-right.png',
        './img/hero/fog/fog-triangle-top.png',
    ];

    // --- Styles injected into <head> immediately (sync, before any paint) ---
    const style = document.createElement('style');
    style.textContent = `
        body.tt-loading { overflow: hidden; }

        #tt-loader {
            position: fixed; inset: 0; z-index: 999999;
            background: #060e10;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            overflow: hidden;
        }
        #tt-loader canvas { position: absolute; inset: 0; width: 100%; height: 100%; }

        .tt-center { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 32px; }

        .tt-glyph { width: 120px; height: 120px; position: relative; display: flex; align-items: center; justify-content: center; }
        .tt-glyph svg { position: absolute; inset: 0; width: 100%; height: 100%; }

        .tt-ring-outer { stroke-dasharray: 340; stroke-dashoffset: 340; animation: ttRingFill 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }
        .tt-ring-inner { stroke-dasharray: 220; stroke-dashoffset: 220; animation: ttRingFill 1.4s 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        .tt-cross-h    { stroke-dasharray: 80;  stroke-dashoffset: 80;  animation: ttLineFill 0.7s 0.6s ease forwards; }
        .tt-cross-v    { stroke-dasharray: 80;  stroke-dashoffset: 80;  animation: ttLineFill 0.7s 0.8s ease forwards; }
        .tt-diamond    { opacity: 0; animation: ttFadeIn 0.5s 1.1s ease forwards; }
        .tt-ticks      { opacity: 0; animation: ttFadeIn 0.4s 1.3s ease forwards; }

        @keyframes ttRingFill { to { stroke-dashoffset: 0; } }
        @keyframes ttLineFill { to { stroke-dashoffset: 0; } }
        @keyframes ttFadeIn   { to { opacity: 1; } }

        .tt-spin     { transform-origin: 60px 60px; animation: ttSpin 12s linear infinite; }
        .tt-spin-rev { transform-origin: 60px 60px; animation: ttSpin 8s linear infinite reverse; }
        @keyframes ttSpin { to { transform: rotate(360deg); } }

        .tt-progress-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0; animation: ttFadeIn 0.5s 0.8s ease forwards; }
        .tt-bar-track { width: 140px; height: 1px; background: rgba(210,180,110,0.12); position: relative; overflow: visible; }
        .tt-bar-fill  { height: 1px; width: 0%; background: linear-gradient(90deg, rgba(180,140,70,0.6), rgba(240,210,130,0.95)); transition: width 0.25s ease; position: relative; }
        .tt-bar-fill::after { content: ''; position: absolute; right: -1px; top: -3px; width: 2px; height: 7px; background: rgba(240,210,130,0.9); box-shadow: 0 0 6px 2px rgba(255,200,80,0.5); }
        .tt-pct { font-family: 'Urbanist', sans-serif; font-size: 10px; letter-spacing: 0.3em; color: rgba(210,180,110,0.35); }

        #tt-loader::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, #060e10 100%); z-index: 1; pointer-events: none; }
        #tt-loader.reveal { transition: opacity 1.1s cubic-bezier(0.4,0,0.2,1); opacity: 0; pointer-events: none; }
    `;
    document.head.appendChild(style);

    // Dark background on <html> immediately — visible even before body parses
    document.documentElement.style.background = '#060e10';

    // --- Everything touching document.body waits for DOM ---
    document.addEventListener('DOMContentLoaded', function () {

        // Show body (was hidden by tt-init-hide in <head>) — loader will cover it
        document.body.style.visibility = 'visible';
        const initHide = document.getElementById('tt-init-hide');
        if (initHide) initHide.remove();

        document.body.classList.add('tt-loading');

        const loader = document.createElement('div');
        loader.id = 'tt-loader';
        loader.innerHTML = `
            <canvas id="tt-canvas"></canvas>
            <div class="tt-center">
                <div class="tt-glyph">
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g class="tt-spin">
                            <circle class="tt-ring-outer" cx="60" cy="60" r="54" stroke="rgba(210,180,110,0.25)" stroke-width="0.7"/>
                            <g class="tt-ticks" stroke="rgba(210,180,110,0.4)" stroke-width="0.8">
                                <line x1="60" y1="6"   x2="60"  y2="12"/>
                                <line x1="60" y1="108" x2="60"  y2="114"/>
                                <line x1="6"  y1="60"  x2="12"  y2="60"/>
                                <line x1="108" y1="60" x2="114" y2="60"/>
                                <line x1="22.1" y1="22.1" x2="26.3" y2="26.3"/>
                                <line x1="93.7" y1="93.7" x2="97.9" y2="97.9"/>
                                <line x1="97.9" y1="22.1" x2="93.7" y2="26.3"/>
                                <line x1="26.3" y1="93.7" x2="22.1" y2="97.9"/>
                            </g>
                        </g>
                        <g class="tt-spin-rev">
                            <circle class="tt-ring-inner" cx="60" cy="60" r="35" stroke="rgba(210,180,110,0.15)" stroke-width="0.5" stroke-dasharray="4 5"/>
                        </g>
                        <line class="tt-cross-h" x1="20" y1="60" x2="100" y2="60" stroke="rgba(210,180,110,0.3)" stroke-width="0.6"/>
                        <line class="tt-cross-v" x1="60" y1="20" x2="60" y2="100" stroke="rgba(210,180,110,0.3)" stroke-width="0.6"/>
                        <polygon class="tt-diamond" points="60,14 57,26 63,26"  fill="rgba(230,200,130,0.9)"/>
                        <polygon class="tt-diamond" points="60,106 57,94 63,94" fill="rgba(230,200,130,0.45)"/>
                        <polygon class="tt-diamond" points="106,60 94,57 94,63" fill="rgba(230,200,130,0.6)"/>
                        <polygon class="tt-diamond" points="14,60 26,57 26,63"  fill="rgba(230,200,130,0.6)"/>
                        <circle class="tt-diamond" cx="60" cy="60" r="3" fill="rgba(230,200,130,0.95)"/>
                        <circle class="tt-diamond" cx="60" cy="60" r="6" stroke="rgba(230,200,130,0.25)" stroke-width="0.6" fill="none"/>
                    </svg>
                </div>
                <div class="tt-progress-wrap">
                    <div class="tt-bar-track"><div class="tt-bar-fill" id="ttBar"></div></div>
                    <span class="tt-pct" id="ttPct">0%</span>
                </div>
            </div>
        `;
        document.body.prepend(loader);

        const canvas = document.getElementById('tt-canvas');
        const ctx    = canvas.getContext('2d');

        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        const particles = Array.from({ length: 55 }, () => ({
            x:       Math.random() * window.innerWidth,
            y:       Math.random() * window.innerHeight,
            size:    Math.random() * 1.4 + 0.3,
            speedY:  -(Math.random() * 0.4 + 0.1),
            speedX:  (Math.random() - 0.5) * 0.15,
            alpha:   Math.random() * 0.5 + 0.1,
            flicker: Math.random() * Math.PI * 2,
        }));

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.flicker += 0.03;
                const a = p.alpha * (0.7 + 0.3 * Math.sin(p.flicker));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,185,100,${a})`;
                ctx.fill();
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        const bar = document.getElementById('ttBar');
        const pct = document.getElementById('ttPct');
        let loaded = 0;
        const total = HERO_IMAGES.length;
        const startTime = Date.now();

        function onLoad() {
            loaded++;
            const p = Math.round((loaded / total) * 100);
            bar.style.width  = p + '%';
            pct.textContent  = p + '%';
            if (loaded >= total) scheduleReveal();
        }

        HERO_IMAGES.forEach(src => {
            const img = new Image();
            img.onload  = onLoad;
            img.onerror = onLoad;
            img.src = src;
        });

        let revealed = false;
        function scheduleReveal() {
            if (revealed) return;
            revealed = true;
            const elapsed   = Date.now() - startTime;
            const remaining = Math.max(1500 - elapsed, 300);
            setTimeout(() => {
                loader.classList.add('reveal');
                document.body.classList.remove('tt-loading');
                document.documentElement.style.background = '';
                loader.addEventListener('transitionend', () => loader.remove(), { once: true });
            }, remaining);
        }

        setTimeout(scheduleReveal, 7000);
    });

})();
