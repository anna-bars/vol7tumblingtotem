(function () {
    function splitWords(el) {
        const nodes = Array.from(el.childNodes);
        el.innerHTML = '';

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                words.forEach(part => {
                    if (part.trim() === '') {
                        el.appendChild(document.createTextNode(part));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.textContent = part;
                        el.appendChild(span);
                    }
                });
            } else if (node.nodeName === 'BR') {
                el.appendChild(node.cloneNode());
            } else {
                el.appendChild(node);
            }
        });
    }

    let scrollHandler = null;

    function init() {
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler, { passive: true });
            scrollHandler = null;
        }

        const h1 = document.querySelector('.about-text h1');
        if (h1) splitWords(h1);

        const p          = document.querySelector('.about-text .about-second-cont p');
        const exploreBtn = document.querySelector('.about-text .about-second-cont span');

        const allUnits = [
            ...Array.from(document.querySelectorAll('.about-text h1 .word')),
            ...(p          ? [p]          : []),
            ...(exploreBtn ? [exploreBtn] : []),
        ];

        const UNIT_COUNT = allUnits.length;

        allUnits.forEach(el => {
            el.style.opacity   = '0.08';
            el.style.transform = 'translateY(12px)';
        });

        let lastScrollY   = window.scrollY;
        let highWaterMark = window.scrollY;

        const aboutSection = document.querySelector('.about');

        function getScrollRange() {
            if (!aboutSection) return { start: 0, end: 1000 };
            const rect  = aboutSection.getBoundingClientRect();
            const scrollY = window.scrollY;
            const start = scrollY + rect.top - window.innerHeight * 0.65;
            const end   = start + window.innerHeight * 0.35;
            return { start, end };
        }

        function lerp(a, b, t) {
            return a + (b - a) * Math.max(0, Math.min(1, t));
        }

        function update() {
            const scrollY = window.scrollY;
            const scrollingDown = scrollY >= lastScrollY;
            lastScrollY = scrollY;

            if (scrollingDown && scrollY > highWaterMark) {
                highWaterMark = scrollY;
            }

            const { start, end } = getScrollRange();
            const progress = (highWaterMark - start) / (end - start);

            allUnits.forEach((unit, i) => {
                const unitProgress = (progress * UNIT_COUNT) - i;
                const t = Math.max(0, Math.min(1, unitProgress));
                unit.style.opacity   = lerp(0.08, 1, t);
                unit.style.transform = `translateY(${lerp(12, 0, t)}px)`;
            });
        }

        scrollHandler = update;
        window.addEventListener('scroll', scrollHandler, { passive: true });
        update();
    }

    window.reinitAboutAnimation = init;

    init();

})();
