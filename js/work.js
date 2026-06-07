class WorksSlider {

    constructor(section) {
        this.section    = section;
        this.cursorZone = section.querySelector(".featured-works-cont");
        this.track      = section.querySelector(".featured-works-track");
        const hint      = section.querySelector(".drag-hint");
        if (hint) hint.style.display = "none";

        this.slides       = Array.from(this.track.children);
        this.currentIndex = 1;
        this.isDragging   = false;
        this.startX       = 0;
        this.isHoveringActive = false;
        this._hoverTimer  = null;
        this._rafId       = null;
        this._sectionVisible = false;

        this.slides.forEach(slide => {
            const title = slide.dataset.overlayTitle || '';
            const desc  = slide.dataset.overlayDesc  || '';
            if (!title && !desc) return;
            const ov = document.createElement('div');
            ov.className = 'work-item-click-overlay';
            ov.innerHTML = `<p class="overlay-title">${title}</p><p class="overlay-desc">${desc}</p>`;
            ov.style.pointerEvents = 'none';
            slide.appendChild(ov);
        });

        this.cursor = document.createElement("div");
        this.cursor.className = "works-cursor";
        this.cursor.innerHTML = `<span class="works-cursor-label">SWIPE</span>`;
        document.body.appendChild(this.cursor);

        this.cursorLabel = this.cursor.querySelector('.works-cursor-label');

        this.cursorX = 0; this.cursorY = 0;
        this.smoothX = 0; this.smoothY = 0;

        this._bindEvents();
        this._bindProgressScrub();
        this._animateCursor();
        this.centerSlide(false);
        this._bindSectionObserver();
    }

    // ─── Section observer ────────────────────────────────────────────────────
    _bindSectionObserver() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                this._sectionVisible = entry.isIntersecting;
                if (this._sectionVisible) {
                    this._updateVideo();
                } else {
                    this._pauseAll();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(this.section);
    }

    _pauseAll() {
        if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
        this.slides.forEach(slide => {
            const video = slide.querySelector('video.work-item-video');
            if (video && !video.paused) video.pause();
        });
    }

    // ─── Video ───────────────────────────────────────────────────────────────
    _updateVideo() {
        if (!this._sectionVisible) return;

        this.slides.forEach((slide, idx) => {
            const video = slide.querySelector('video.work-item-video');

            if (idx === this.currentIndex) {
                if (!video) return;

                if (!video.src && video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                }

                const startVideo = () => {
                    video.classList.add('is-ready');
                    slide.classList.add('video-playing');
                    const p = video.play();
                    if (p) p.catch(() => {});
                    this._startProgress(video, slide);
                };

                if (video.readyState >= 3) {
                    startVideo();
                } else {
                    video.addEventListener('canplay', startVideo, { once: true });
                    const p = video.play();
                    if (p) p.catch(() => {});
                }
            } else {
                if (video && !video.paused) video.pause();
                slide.classList.remove('video-playing');
                if (video) video.classList.remove('is-ready');
            }
        });
    }

    _startProgress(video, slide) {
        if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }

        const fill  = slide.querySelector('.work-item-progress-fill');
        const thumb = slide.querySelector('.work-item-progress-thumb');
        if (!fill) return;

        const tick = () => {
            if (video.duration && video.duration > 0) {
                const pct = (video.currentTime / video.duration) * 100;
                fill.style.width = pct + '%';
                if (thumb) thumb.style.left = pct + '%';
            }
            this._rafId = requestAnimationFrame(tick);
        };
        this._rafId = requestAnimationFrame(tick);
    }

    // ─── Progress scrub ──────────────────────────────────────────────────────
    _bindProgressScrub() {
        this.track.addEventListener('mousedown', e => {
            const hit = e.target.closest('.work-item-progress-hit, .work-item-progress');
            if (!hit) return;
            e.stopPropagation();
            e.preventDefault();
            const slide = hit.closest('.featured-work-item');
            const video = slide && slide.querySelector('video.work-item-video');
            if (!video) return;
            const bar = slide.querySelector('.work-item-progress');

            const seek = clientX => {
                if (!video.duration) return;
                const rect = bar.getBoundingClientRect();
                const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                video.currentTime = pct * video.duration;
            };

            seek(e.clientX);
            const onMove = ev => seek(ev.clientX);
            const onUp   = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
    }

    // ─── Cursor ──────────────────────────────────────────────────────────────
    lerp(a, b, t) { return a + (b - a) * t; }

    _animateCursor() {
        this.smoothX = this.lerp(this.smoothX, this.cursorX, 0.12);
        this.smoothY = this.lerp(this.smoothY, this.cursorY, 0.12);
        this.cursor.style.transform =
            `translate(${this.smoothX}px, ${this.smoothY}px) translate(-50%, -50%)`;
        requestAnimationFrame(() => this._animateCursor());
    }

    _setLabel(text) {
        this.cursorLabel.style.opacity = '0';
        setTimeout(() => {
            this.cursorLabel.innerHTML = text;
            this.cursorLabel.style.opacity = '1';
        }, 200);
    }

    _onEnterActive() {
        this._setLabel('SWIPE');
        clearTimeout(this._hoverTimer);
        this._hoverTimer = setTimeout(() => {
            if (this.isHoveringActive && !this.isDragging) this._setLabel('CLICK');
        }, 2000);
    }

    _onLeaveActive() {
        clearTimeout(this._hoverTimer);
        this._setLabel('SWIPE');
    }

    // ─── Slide state ─────────────────────────────────────────────────────────
    updateClasses() {
        this.slides.forEach(s =>
            s.classList.remove("is-active", "is-prev", "is-next", "is-revealed"));
        this.slides[this.currentIndex]?.classList.add("is-active");
        this.slides[this.currentIndex - 1]?.classList.add("is-prev");
        this.slides[this.currentIndex + 1]?.classList.add("is-next");
    }

    // ✅ ՀԻՆ centerSlide - անփոփոխ
    centerSlide(animated = true) {
        const active = this.slides[this.currentIndex];
        const offset =
            active.offsetLeft -
            (window.innerWidth / 2) +
            (active.offsetWidth / 2);

        this.track.style.transition = animated
            ? "transform .8s cubic-bezier(.77,0,.18,1)"
            : "none";
        this.track.style.transform = `translateX(${-offset}px)`;
        this.updateClasses();
        this.isHoveringActive = false;
        clearTimeout(this._hoverTimer);
        this._setLabel('SWIPE');
    }

    // ✅ ՀԻՆ _reorderAndRecenter - անփոփոխ
    _reorderAndRecenter() {
        this.track.style.transition = "none";
        this.track.style.transform  = "translateX(0px)";
        void this.track.offsetWidth;
        this.centerSlide(false);
    }

    // ✅ ՀԻՆ nextSlide - + _updateVideo կանչ
    nextSlide() {
        if (this.track.dataset.animating === "true") return;
        this.track.dataset.animating = "true";
        this.currentIndex++;
        this.centerSlide(true);
        this.track.addEventListener("transitionend", () => {
            if (this.currentIndex >= this.slides.length - 1) {
                const first = this.slides.shift();
                this.track.appendChild(first);
                this.slides.push(first);
                this.currentIndex--;
                this._reorderAndRecenter();
            }
            this._updateVideo();
            this.track.dataset.animating = "false";
        }, { once: true });
    }

    // ✅ ՀԻՆ prevSlide - + _updateVideo կանչ
    prevSlide() {
        if (this.track.dataset.animating === "true") return;
        this.track.dataset.animating = "true";
        this.currentIndex--;
        this.centerSlide(true);
        this.track.addEventListener("transitionend", () => {
            if (this.currentIndex <= 0) {
                const last = this.slides.pop();
                this.track.prepend(last);
                this.slides.unshift(last);
                this.currentIndex++;
                this._reorderAndRecenter();
            }
            this._updateVideo();
            this.track.dataset.animating = "false";
        }, { once: true });
    }

    _toggleOverlay(clickedSlide) {
        const isRevealed = clickedSlide.classList.contains('is-revealed');
        this.slides.forEach(s => s.classList.remove('is-revealed'));
        if (!isRevealed) clickedSlide.classList.add('is-revealed');
    }

    // ─── Events ──────────────────────────────────────────────────────────────
    _bindEvents() {
        const zone = this.cursorZone;

        zone.addEventListener("mouseenter", () => {
            this.cursor.classList.add("is-visible");
        });
        zone.addEventListener("mouseleave", () => {
            this.cursor.classList.remove("is-visible", "is-dragging");
            this.isDragging = false;
            if (this.isHoveringActive) {
                this.isHoveringActive = false;
                this._onLeaveActive();
            }
        });

        window.addEventListener("mousemove", e => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;

            // progress bar-ի վրա cursor-ը թաքցնել
            if (e.target.closest('.work-item-progress-wrap')) {
                this.cursor.classList.remove("is-visible");
                return;
            } else if (this.cursorZone.contains(e.target)) {
                this.cursor.classList.add("is-visible");
            }

            if (this.isDragging) {
                const move = e.clientX - this.startX;
                this.cursor.style.setProperty("--drag-offset", `${move * 0.18}px`);
                return;
            }

            const active = this.slides[this.currentIndex];
            if (active) {
                const rect = active.getBoundingClientRect();
                const over =
                    e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top  && e.clientY <= rect.bottom;

                if (over && !this.isHoveringActive) {
                    this.isHoveringActive = true;
                    this._onEnterActive();
                } else if (!over && this.isHoveringActive) {
                    this.isHoveringActive = false;
                    this._onLeaveActive();
                }
            }
        });

        zone.addEventListener("mousedown", e => {
            if (e.target.closest('.work-item-progress-wrap')) return;
            this.isDragging = true;
            this.startX = e.clientX;
            this.cursor.classList.add("is-dragging");
            clearTimeout(this._hoverTimer);
            this.cursorLabel.style.opacity = '1';
            this.cursorLabel.innerHTML = 'SWIPE';
            this._clickTarget = this.slides.find(s => s.contains(e.target)) || null;
        });

        window.addEventListener("mouseup", e => {
            if (!this.isDragging) return;
            const diff = e.clientX - this.startX;
            this.cursor.classList.remove("is-dragging");
            this.cursor.style.setProperty("--drag-offset", "0px");

            if (Math.abs(diff) < 10) {
                if (this._clickTarget) this._toggleOverlay(this._clickTarget);
            } else if (diff < -80) {
                this.nextSlide();
            } else if (diff > 80) {
                this.prevSlide();
            }

            this.isDragging = false;
            this._clickTarget = null;
            const active = this.slides[this.currentIndex];
            if (active && this.isHoveringActive) this._onEnterActive();
        });

        zone.addEventListener("touchstart", e => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this._clickTarget = this.slides.find(s => s.contains(e.target)) || null;
        });
        window.addEventListener("touchend", e => {
            if (!this.isDragging) return;
            const diff = e.changedTouches[0].clientX - this.startX;
            if (Math.abs(diff) < 10) {
                if (this._clickTarget) this._toggleOverlay(this._clickTarget);
            } else if (diff < -80) {
                this.nextSlide();
            } else if (diff > 80) {
                this.prevSlide();
            }
            this.isDragging = false;
            this._clickTarget = null;
        });

        window.addEventListener("resize", () => this.centerSlide(false));
    }
}
