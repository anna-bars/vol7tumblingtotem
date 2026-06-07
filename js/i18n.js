(function () {

    const translations = {
        nl: {
            // Hero
            'hero-est':         'EST. 2025',
            'hero-scroll':      'Scroll to Explore↓',
            'hero-location':    'Belgium/Remote',

            // About
            'about-h1':         'Duik dieper\nen ontdek de grenzeloze wereld\nvan 3D Animatie.',
            'about-p':          'Tumbling Totem maakt visuals voor jouw project, eindeloze mogelijkheden op maat van jouw wensen.',
            'about-explore':    'Ontdek ↓',

            // Works
            'works-title':      'Uitgelicht',
            'works-title-span': 'Werk',
            'more-title':       'Meer',
            'more-title-span':  'Werk',
            'drag-hint':        'HOUD VAST\nEN SLEEP',

            // Work items
            'cat-recovery':     '// herstel',
            'cat-mystic':       '// mystiek',
            'cat-ancient':      '// oud',

            'work1-title':      'Bosscène',
            'work1-desc':       'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
            'work1-tag1':       'Omgeving',
            'work1-tag2':       '3D Render',
            'work1-tag3':       'Sfeervol',

            'work2-title':      'Mystieke Tuin',
            'work2-desc':       'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
            'work2-tag1':       'Natuur',
            'work2-tag2':       '3D Render',
            'work2-tag3':       'Cinematisch',

            'work3-title':      'Oud Pad',
            'work3-desc':       'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
            'work3-tag1':       'Architectuur',
            'work3-tag2':       '3D Render',
            'work3-tag3':       'Sfeervol',

            // Contact
            'contact-label':    'NEEM CONTACT OP',
        },
        en: {
            // Hero
            'hero-est':         'EST. 2025',
            'hero-scroll':      'Scroll to Explore↓',
            'hero-location':    'Belgium/Remote',

            // About
            'about-h1':         'Dive deeper\nand discover the boundless world\nof 3D Animation.',
            'about-p':          'Tumbling Totem creates visuals for your project, endless possibilities tailored to your needs.',
            'about-explore':    'Explore ↓',

            // Works
            'works-title':      'Featured',
            'works-title-span': 'Works',
            'more-title':       'More',
            'more-title-span':  'Works',
            'drag-hint':        'HOLD AND\nDRAG',

            // Work items
            'cat-recovery':     '// recovery',
            'cat-mystic':       '// mystic',
            'cat-ancient':      '// ancient',

            'work1-title':      'Forest Scene',
            'work1-desc':       'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
            'work1-tag1':       'Environment',
            'work1-tag2':       '3D Render',
            'work1-tag3':       'Atmospheric',

            'work2-title':      'Mystic Garden',
            'work2-desc':       'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
            'work2-tag1':       'Nature',
            'work2-tag2':       '3D Render',
            'work2-tag3':       'Cinematic',

            'work3-title':      'Ancient Path',
            'work3-desc':       'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
            'work3-tag1':       'Architecture',
            'work3-tag2':       '3D Render',
            'work3-tag3':       'Moody',

            // Contact
            'contact-label':    'GET IN TOUCH',
        }
    };

    let currentLang = localStorage.getItem('tt-lang') || 'nl';

    function applyLang(lang) {
        const t = translations[lang];
        document.documentElement.lang = lang;

        // Helper
        function set(sel, key, attr) {
            const el = document.querySelector(sel);
            if (!el) return;
            if (attr) { el.setAttribute(attr, t[key]); return; }
            el.innerHTML = t[key].replace(/\n/g, '<br>');
        }
        function setAll(sel, key) {
            document.querySelectorAll(sel).forEach(el => {
                el.innerHTML = t[key].replace(/\n/g, '<br>');
            });
        }

        // Hero
        set('[data-i18n="hero-est"]',      'hero-est');
        set('[data-i18n="hero-scroll"]',   'hero-scroll');
        set('[data-i18n="hero-location"]', 'hero-location');

        // About
        set('[data-i18n="about-h1"]',      'about-h1');
        set('[data-i18n="about-p"]',       'about-p');
        set('[data-i18n="about-explore"]', 'about-explore');

        // about.js 
        if (typeof window.reinitAboutAnimation === 'function') {
            window.reinitAboutAnimation();
        }

        // Works titles
        set('[data-i18n="works-title"]',      'works-title');
        set('[data-i18n="works-title-span"]', 'works-title-span');
        set('[data-i18n="more-title"]',       'more-title');
        set('[data-i18n="more-title-span"]',  'more-title-span');

        // Drag hints
        setAll('[data-i18n="drag-hint"]', 'drag-hint');

        // Work tracks
        const track1 = document.getElementById('worksTrack');
        const track2 = document.getElementById('worksTrack2');
        if (track1 && typeof buildTrackHTML === 'function') {
            track1.innerHTML = buildTrackHTML(WORKS1, lang, translations);
        }
        if (track2 && typeof buildTrackHTML === 'function') {
            track2.innerHTML = buildTrackHTML(WORKS2, lang, translations);
        }

        // Re-init WorksSlider 
        if (typeof WorksSlider === 'function') {
            // Remove old cursor elements first
            document.querySelectorAll('.works-cursor').forEach(c => c.remove());
            // Double rAF — ensures browser has flushed layout before offsetLeft is read
            requestAnimationFrame(() => requestAnimationFrame(() => {
                document.querySelectorAll('.featured-works').forEach(section => {
                    new WorksSlider(section);
                });
            }));
        }

        // Contact
        set('[data-i18n="contact-label"]', 'contact-label');

        // Toggle button label
        const btn = document.getElementById('tt-lang-toggle');
        if (btn) {
            btn.querySelector('.tt-lang-label').textContent = lang === 'nl' ? 'EN' : 'NL';
        }

        currentLang = lang;
        localStorage.setItem('tt-lang', lang);
    }

    function buildToggle() {
        const btn = document.createElement('button');
        btn.id = 'tt-lang-toggle';
        btn.setAttribute('aria-label', 'Switch language');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span class="tt-lang-label">${currentLang === 'nl' ? 'EN' : 'NL'}</span>
        `;

        btn.addEventListener('click', () => {
            applyLang(currentLang === 'nl' ? 'en' : 'nl');
        });

        const style = document.createElement('style');
        style.textContent = `
            #tt-lang-toggle {
                position: fixed;
                top: 20px;
                right: 24px;
                z-index: 99999;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 7px 14px 7px 10px;
                border: none;
                border-radius: 999px;
                cursor: pointer;
                color: rgba(255,255,255,0.92);
                font-family: 'Urbanist', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;

                /* Glassmorphism */
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(12px) saturate(150%);
                -webkit-backdrop-filter: blur(12px) saturate(150%);
                border: 1px solid rgba(255,255,255,0.15);
                box-shadow: 0 4px 24px rgba(0,0,0,0.18);

                transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
            }
            #tt-lang-toggle:hover {
                background: rgba(255,255,255,0.15);
                box-shadow: 0 6px 30px rgba(0,0,0,0.25);
                transform: translateY(-1px);
            }
            #tt-lang-toggle:active {
                transform: translateY(0);
            }
            #tt-lang-toggle svg {
                width: 15px;
                height: 15px;
                opacity: 0.85;
                flex-shrink: 0;
            }
            .tt-lang-label {
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { buildToggle(); applyLang(currentLang); });
    } else {
        buildToggle();
        applyLang(currentLang);
    }

})();
