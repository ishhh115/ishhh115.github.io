document.addEventListener('DOMContentLoaded', () => {

    // ─── Lenis Smooth Scroll ───
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });
        lenis.on('scroll', () => { if (window.ScrollTrigger) ScrollTrigger.update(); });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        lenis.start(); // Force start on load
    } catch(e) { /* Lenis not loaded, graceful fallback */ }

    // Make lenis globally accessible for other scripts (like transitions)
    window.lenis = lenis;

    // ─── Mobile Menu ───
    const hamburger = document.getElementById('nav-hamburger');
    const overlay = document.getElementById('mobile-overlay');
    const closeBtn = document.getElementById('mobile-close');

    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => overlay.classList.add('active'));
        closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
        overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => overlay.classList.remove('active'));
        });
    }

    // ─── Experience Tab Switcher ───
    document.querySelectorAll('.exp-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = item.dataset.exp;
            document.querySelectorAll('.exp-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            const panel = document.querySelector(`.exp-panel[data-panel="${idx}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    // ─── Archive Toggle ───
    const archiveBtn = document.getElementById('archive-toggle');
    const archiveDrawer = document.getElementById('archive-drawer');
    if (archiveBtn && archiveDrawer) {
        archiveBtn.addEventListener('click', () => {
            const isOpen = archiveDrawer.classList.contains('open');
            archiveDrawer.classList.toggle('open');
            archiveBtn.classList.toggle('expanded');
            archiveBtn.querySelector('span').textContent = isOpen ? 'Explore Project Archive' : 'Close Archive';
        });
    }

    // ─── Photo Uploads ───
    function setupUpload(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (!input || !preview) return;
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    preview.src = ev.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    setupUpload('about-photo-upload', 'about-photo-preview');


    // ─── Contact Form ───
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (form && status) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn--submit');
            const btnText = btn.querySelector('span');
            const original = btnText.textContent;
            btn.disabled = true;
            btnText.textContent = 'Sending...';
            status.style.display = 'block';
            status.style.color = 'var(--gold)';
            status.textContent = 'Sending message...';

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    status.style.color = '#27c93f';
                    status.textContent = '✓ Message sent successfully! I will get back to you soon.';
                    form.reset();
                } else {
                    status.style.color = '#ff5f56';
                    status.textContent = 'Oops! There was a problem. Please try emailing me directly.';
                }
            } catch {
                status.style.color = '#ff5f56';
                status.textContent = 'Network error. Please try emailing me directly at ishhcodes@gmail.com.';
            } finally {
                btn.disabled = false;
                btnText.textContent = original;
            }
        });
    }

    // ─── Smooth Anchor Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -60 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ─── Activities Leadership Journey SVG Line ───
    function drawJourneyLine() {
        const svgPath = document.querySelector('.journey-path');
        const cards = document.querySelectorAll('.journey-card');
        const grid = document.querySelector('.journey-grid');
        
        if (!svgPath || cards.length === 0 || !grid || window.innerWidth <= 768) {
            if (svgPath) svgPath.setAttribute('d', '');
            return;
        }

        const points = [];
        
        // Calculate anchor positions relative to the grid container
        cards.forEach((card) => {
            const milestone = card.querySelector('.milestone-number');
            const targetEl = milestone || card;
            
            const x = card.offsetLeft + targetEl.offsetLeft + targetEl.offsetWidth / 2;
            const y = card.offsetTop + targetEl.offsetTop + targetEl.offsetHeight / 2;
            points.push({ x, y });
        });

        let d = '';
        // Connect points in the snaking path (index 0 -> 1 -> 2 -> 3 -> 4 -> 5)
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (i === 0) {
                d += `M ${p.x} ${p.y}`;
            } else {
                const prev = points[i - 1];
                // Curve handles for snaking transitions:
                if (i === 3) {
                    const cp1x = prev.x + 80;
                    const cp1y = prev.y;
                    const cp2x = p.x + 80;
                    const cp2y = p.y;
                    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
                } else {
                    d += ` L ${p.x} ${p.y}`;
                }
            }
        }

        svgPath.setAttribute('d', d);
    }

    // Run after load and on resize
    window.addEventListener('load', drawJourneyLine);
    window.addEventListener('resize', drawJourneyLine);
    
    // Execute immediately and periodically as components render
    drawJourneyLine();
    setTimeout(drawJourneyLine, 500);
    setTimeout(drawJourneyLine, 1500);

});
