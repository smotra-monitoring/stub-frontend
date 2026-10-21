(() => {
    'use strict';

    const doc = document.documentElement;
    doc.classList.add('js');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header state
    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile navigation
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    const setMenu = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });

    // Reveal on scroll + count-up
    const countUp = (el) => {
        const target = Number(el.dataset.count);
        if (reduceMotion || !target) return;
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                entry.target.querySelectorAll('[data-count]').forEach(countUp);
                if (entry.target.dataset.count) countUp(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal').forEach((el, i) => {
            el.style.transitionDelay = `${(i % 4) * 70}ms`;
            io.observe(el);
        });

        // Active nav link
        const links = new Map();
        menu.querySelectorAll('a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
        const navIo = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const link = links.get(entry.target.id);
                if (!link) return;
                if (entry.isIntersecting) {
                    links.forEach((l) => l.removeAttribute('aria-current'));
                    link.setAttribute('aria-current', 'true');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        links.forEach((_, id) => { const s = document.getElementById(id); if (s) navIo.observe(s); });
    } else {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    }

    // Card spotlight follows pointer
    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    // Architecture scene: fit to width and orbit the camera with the pointer
    const scene = document.querySelector('.scene');
    if (scene) {
        const fit = () => scene.style.setProperty('--s', Math.min(1, scene.clientWidth / 1300).toFixed(3));
        fit();
        if ('ResizeObserver' in window) new ResizeObserver(fit).observe(scene);

        if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
            const BASE_SPIN = -30;
            const BASE_TILT = 56;
            let spin = BASE_SPIN, tilt = BASE_TILT;
            let targetSpin = BASE_SPIN, targetTilt = BASE_TILT;
            let raf = 0;

            // Exponential easing toward the pointer target; stops once settled
            const tick = () => {
                spin += (targetSpin - spin) * 0.08;
                tilt += (targetTilt - tilt) * 0.08;
                scene.style.setProperty('--spin', `${spin.toFixed(3)}deg`);
                scene.style.setProperty('--tilt', `${tilt.toFixed(3)}deg`);
                raf = Math.abs(targetSpin - spin) + Math.abs(targetTilt - tilt) > 0.01 ? requestAnimationFrame(tick) : 0;
            };
            const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

            scene.addEventListener('pointermove', (e) => {
                const r = scene.getBoundingClientRect();
                targetSpin = BASE_SPIN + ((e.clientX - r.left) / r.width - 0.5) * 24;
                targetTilt = BASE_TILT - ((e.clientY - r.top) / r.height - 0.5) * 14;
                kick();
            });
            scene.addEventListener('pointerleave', () => {
                targetSpin = BASE_SPIN;
                targetTilt = BASE_TILT;
                kick();
            });
        }
    }

    // Copy to clipboard
    const status = document.getElementById('copy-status');
    document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.textContent = 'Copied';
                btn.classList.add('is-copied');
                status.textContent = 'Command copied to clipboard';
            } catch {
                status.textContent = 'Copy failed, please select the text manually';
            }
            setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1800);
        });
    });

    // Live console simulation
    const output = document.getElementById('console-output');
    if (output && !reduceMotion) {
        const hosts = ['10.0.0.1     ', '1.1.1.1      ', 'edge-eu-2    ', 'core-us-1    ', 'db-ap-3      ', '8.8.8.8      '];
        const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
        const lines = output.innerHTML.split('\n');
        const head = lines.slice(0, 3);
        let body = lines.slice(3);
        let timer = null;
        const step = () => {
            const host = hosts[Math.floor(Math.random() * hosts.length)];
            const roll = Math.random();
            let line;
            if (roll < 0.06) line = `<span class="c-err">✖</span> icmp ${esc(host)} <span class="c-err">timeout</span> · cached`;
            else {
                const ms = roll < 0.2 ? 100 + Math.random() * 120 : 4 + Math.random() * 40;
                const cls = ms > 100 ? 'c-warn' : 'c-ok';
                line = `<span class="c-info">↻</span> icmp ${esc(host)} <span class="${cls}">${ms.toFixed(1)} ms</span>`;
            }
            body = body.concat(line).slice(-5);
            output.innerHTML = head.concat(body).join('\n');
        };
        const start = () => { if (!timer) timer = setInterval(step, 1300); };
        const stop = () => { clearInterval(timer); timer = null; };
        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
        start();
    }

    // Hero network canvas
    const canvas = document.querySelector('.hero__canvas');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, nodes = [], raf = 0, running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        w = rect.width; h = rect.height;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(70, Math.floor((w * h) / 18000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.8
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const max = 140;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += a.vx; a.y += a.vy;
            if (a.x < 0 || a.x > w) a.vx *= -1;
            if (a.y < 0 || a.y > h) a.vy *= -1;
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < max * max) {
                    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - Math.sqrt(d2) / max) * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
            ctx.fillStyle = i % 5 === 0 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(34, 211, 238, 0.85)';
            ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        }
        raf = requestAnimationFrame(draw);
    };

    const play = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
    const pause = () => { running = false; cancelAnimationFrame(raf); };

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });
    resize();

    // Only animate while the hero is visible and the tab is active
    let inView = true;
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView && !document.hidden ? play() : pause(); }).observe(canvas);
    }
    document.addEventListener('visibilitychange', () => (document.hidden || !inView ? pause() : play()));
    play();
})();
