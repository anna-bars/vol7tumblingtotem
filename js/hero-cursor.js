(() => {
    let mouse = { x: 0, y: 0 };
    let smooth = { x: 0, y: 0 };

    const LERP = 0.06;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    const items = document.querySelectorAll('[data-parallax]');

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function tick() {
        requestAnimationFrame(tick);

        smooth.x = lerp(smooth.x, mouse.x, LERP);
        smooth.y = lerp(smooth.y, mouse.y, LERP);

        items.forEach((el) => {

            const depth = parseFloat(el.dataset.depth || 10);

            const x = smooth.x * depth;
            const y = smooth.y * depth;

            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    tick();

})();