const layers = {
    sky: document.querySelector(".layer-1-sky"),
    mountains: document.querySelector(".layer-2-mountains"),
    hills: document.querySelector(".layer-3-hills-back"),
    temple: document.querySelector(".layer-4-temple"),
    jungleMid: document.querySelector(".layer-5-jungle-mid"),
    jungleFront: document.querySelector(".layer-6-jungle-front"),
    foreground: document.querySelector(".layer-7-foreground"),
    leavesLeft: document.querySelector(".leaves-left"),
    leavesRight: document.querySelector(".leaves-right"),
};

const isMobile = window.innerWidth <= 768;
const scale = isMobile ? 1.3 : 1.1;

const desktopDepth = {
    sky: 0.08, mountains: 0.15, hills: 0.25,
    temple: 0.45, jungleMid: 0.70, jungleFront: 1.00, foreground: 1.45,
};
const mobileDepth = {
    sky: 0.03, mountains: 0.06, hills: 0.10,
    temple: 0.18, jungleMid: 0.28, jungleFront: 0.40, foreground: 0.60,
};
const depth = isMobile ? mobileDepth : desktopDepth;

const lerp = (start, end, amount) => start + (end - start) * amount;

let targetScroll = 0, currentScroll = 0;
let targetMouseX = 0, mouseX = 0;

window.addEventListener("mousemove", (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
});
window.addEventListener("scroll", () => {
    targetScroll = window.scrollY;
});

const logo = document.querySelector(".logo");

if (logo) {
    logo.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.4s ease";

    let isHovering = false;

    logo.addEventListener("mouseenter", () => { isHovering = true; });

    logo.addEventListener("mousemove", (e) => {
        const rect = logo.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        logo.style.transform = `translate(${x * 4}px, ${y * 2.5}px) scale(1.015)`;
    });

    logo.addEventListener("mouseleave", () => {
        isHovering = false;
        logo.style.transform = "translate(0px, 0px) scale(1)";
    });

    document.addEventListener("mousemove", (e) => {
        if (isHovering) return; 

        const rect = logo.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const radius = 400;

if (dist < radius) {
    const pull = 1 - dist / radius;
    const pullFast = Math.pow(pull, 0.5); 
    const glowPx = pullFast * 28;
    const bright = 1 + pullFast * 0.25;
    logo.style.transform = `scale(${1 + pullFast * 0.015})`;
    logo.style.filter = `brightness(${bright}) drop-shadow(0px 0px ${glowPx}px rgba(255, 210, 100, 0.65))`;
} else {
    logo.style.transform = "scale(1)";
    logo.style.filter = "brightness(1) drop-shadow(0px 0px 0px transparent)";
}
    });

    logo.addEventListener("click", () => {
        logo.style.transition = "transform 0.1s ease, filter 0.1s ease";
        logo.style.transform = "scale(0.97)";
        logo.style.filter = "brightness(1.4) drop-shadow(0px 0px 26px rgba(255, 200, 80, 0.85))";
        setTimeout(() => {
            logo.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.6s ease";
            logo.style.transform = "scale(1)";
            logo.style.filter = "brightness(1) drop-shadow(0px 0px 0px transparent)";
        }, 120);
    });
}

function animate() {
    requestAnimationFrame(animate);

    currentScroll = lerp(currentScroll, targetScroll, 0.08);
    mouseX = lerp(mouseX, targetMouseX, 0.06);

    const progress = Math.min(currentScroll / window.innerHeight, 1);
    const move = isMobile ? progress * 240 : progress * 450;

    // Reduced mouse strength
    const mouseStrength = isMobile ? 1.5 : 3;

    const apply = (el, d) => {
        if (!el) return;
        el.style.transform = `translate(${mouseX * mouseStrength * d}px, ${-move * d}px) scale(${scale})`;
    };

    apply(layers.sky, depth.sky);
    apply(layers.mountains, depth.mountains);
    apply(layers.hills, depth.hills);
    apply(layers.temple, depth.temple);
    apply(layers.jungleMid, depth.jungleMid);
    apply(layers.jungleFront, depth.jungleFront);
    apply(layers.foreground, depth.foreground);

    if (layers.leavesLeft) {
        layers.leavesLeft.style.transform = `translate(${mouseX * 4 - progress * 40}px, ${-progress * 90}px) scale(1.05)`;
    }
    if (layers.leavesRight) {
        layers.leavesRight.style.transform = `translate(${mouseX * 4 + progress * 40}px, ${-progress * 90}px) scale(1.05)`;
    }
}

animate();