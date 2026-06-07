(function () {

    const contact = document.querySelector('.contact');
    if (!contact) return;

    const inscription = document.querySelector('.contact-inscription');

    const style = document.createElement('style');
    style.textContent = `
        .ct-dot {
            position: fixed;
            pointer-events: none;
            z-index: 99999;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
            transition: opacity 0.4s ease;
        }

        .ct-cursor {
            position: fixed;
            pointer-events: none;
            z-index: 100000;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            mix-blend-mode: screen;
        }

        .ct-cursor.visible { opacity: 1; }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'ct-cursor';
    cursor.innerHTML = `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="2.2" fill="rgba(230,200,130,0.9)"/>
            <polygon points="18,3 16,9 20,9"   fill="rgba(230,200,130,0.9)"/>
            <polygon points="18,33 16,27 20,27" fill="rgba(230,200,130,0.55)"/>
            <polygon points="33,18 27,16 27,20" fill="rgba(230,200,130,0.7)"/>
            <polygon points="3,18 9,16 9,20"    fill="rgba(230,200,130,0.7)"/>
            <line x1="18" y1="11" x2="18" y2="15" stroke="rgba(230,200,130,0.45)" stroke-width="0.8"/>
            <line x1="18" y1="21" x2="18" y2="25" stroke="rgba(230,200,130,0.3)"  stroke-width="0.8"/>
            <line x1="11" y1="18" x2="15" y2="18" stroke="rgba(230,200,130,0.35)" stroke-width="0.8"/>
            <line x1="21" y1="18" x2="25" y2="18" stroke="rgba(230,200,130,0.35)" stroke-width="0.8"/>
            <circle cx="18" cy="18" r="12" stroke="rgba(210,180,110,0.2)"  stroke-width="0.6" fill="none"/>
            <circle cx="18" cy="18" r="8"  stroke="rgba(210,180,110,0.15)" stroke-width="0.5" fill="none" stroke-dasharray="2 3"/>
        </svg>
    `;
    document.body.appendChild(cursor);

    const DOT_COUNT = 8;
    const dots = [];

    for (let i = 0; i < DOT_COUNT; i++) {
        const d = document.createElement('div');
        d.className = 'ct-dot';
        const t = i / (DOT_COUNT - 1);
        const size  = 5 - t * 3.2;
        const alpha = 0.75 - t * 0.5;
        d.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: rgba(230,200,130,${alpha});
            box-shadow: 0 0 ${4 + t * 6}px rgba(255,190,80,${0.4 - t * 0.2});
            opacity: 0;
        `;
        document.body.appendChild(d);
        dots.push(d);
    }

    let mx = 0, my = 0;
    let raf = null;
    let angle = 0;
    let inside = false;

    function getEmailCenter() {
        if (!inscription) return { x: window.innerWidth / 2, y: window.innerHeight * 0.85 };
        const r = inscription.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function loop() {
        angle += 0.3;
        cursor.querySelector('svg').style.transform = `rotate(${angle}deg)`;

        const email = getEmailCenter();
        dots.forEach((d, i) => {
            const t  = i / (DOT_COUNT - 1);
            const et = t * t;
            d.style.left = (mx + (email.x - mx) * et) + 'px';
            d.style.top  = (my + (email.y - my) * et) + 'px';
        });

        raf = requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                inside = false;
                cursor.classList.remove('visible');
                dots.forEach(d => d.style.opacity = '0');
                if (raf) { cancelAnimationFrame(raf); raf = null; }
            }
        });
    }, { threshold: 0.01 });

    observer.observe(contact);

    contact.addEventListener('mouseenter', () => {
        inside = true;
        cursor.classList.add('visible');
        dots.forEach(d => d.style.opacity = '1');
        if (!raf) raf = requestAnimationFrame(loop);
    });

    contact.addEventListener('mouseleave', () => {
        inside = false;
        cursor.classList.remove('visible');
        dots.forEach(d => d.style.opacity = '0');
        if (raf) { cancelAnimationFrame(raf); raf = null; }
    });

})();