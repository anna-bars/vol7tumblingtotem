(function () {

    const style = document.createElement('style');
    style.textContent = `
        * { cursor: none !important; }

        .ct-global-cursor {
            position: fixed;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'ct-global-cursor';
    cursor.innerHTML = `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="2.2" fill="rgba(230,200,130,0.9)"/>
            <polygon points="18,3 16,9 20,9" fill="rgba(230,200,130,0.9)"/>
            <polygon points="18,33 16,27 20,27" fill="rgba(230,200,130,0.55)"/>
            <polygon points="33,18 27,16 27,20" fill="rgba(230,200,130,0.7)"/>
            <polygon points="3,18 9,16 9,20" fill="rgba(230,200,130,0.7)"/>
            <line x1="18" y1="11" x2="18" y2="15" stroke="rgba(230,200,130,0.45)" stroke-width="0.8"/>
            <line x1="18" y1="21" x2="18" y2="25" stroke="rgba(230,200,130,0.3)" stroke-width="0.8"/>
            <line x1="11" y1="18" x2="15" y2="18" stroke="rgba(230,200,130,0.35)" stroke-width="0.8"/>
            <line x1="21" y1="18" x2="25" y2="18" stroke="rgba(230,200,130,0.35)" stroke-width="0.8"/>
            <circle cx="18" cy="18" r="12" stroke="rgba(210,180,110,0.2)" stroke-width="0.6" fill="none"/>
            <circle cx="18" cy="18" r="8"  stroke="rgba(210,180,110,0.15)" stroke-width="0.5" fill="none" stroke-dasharray="2 3"/>
        </svg>
    `;
    document.body.appendChild(cursor);

    let angle = 0;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    }, { passive: true });

    (function loop() {
        angle += 0.3;
        cursor.querySelector('svg').style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(loop);
    })();

})();