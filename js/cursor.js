document.addEventListener('DOMContentLoaded', () => {
    // ─── Custom Cursor ───
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot && ring && window.innerWidth > 768) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        });

        (function animateRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(animateRing);
        })();

        // Hover states
        const applyCursorHovers = () => {
            document.querySelectorAll('.hover-target, a, button').forEach(el => {
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
                el.addEventListener('mouseenter', addHoverClass);
                el.addEventListener('mouseleave', removeHoverClass);
            });
        };

        function addHoverClass() { document.body.classList.add('cursor-hover'); }
        function removeHoverClass() { document.body.classList.remove('cursor-hover'); }

        applyCursorHovers();

        // Re-apply hover states when DOM dynamically changes
        const observer = new MutationObserver(applyCursorHovers);
        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }
});
