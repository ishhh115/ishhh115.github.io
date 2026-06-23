document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.transition-overlay');

    // ─── 1. PAGE ENTRANCE TRANSITION ───
    if (overlay) {
        // If we just loaded a page, start with overlay active and fade it out
        overlay.classList.add('active');
        
        // Disable scroll temporarily during transition
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        setTimeout(() => {
            overlay.classList.add('exit');
            overlay.classList.remove('active');
            
            // Re-enable scrolling
            if (window.lenis) window.lenis.start();
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            // Staggered reveal for case study page elements
            if (typeof gsap !== 'undefined') {
                gsap.from('.case-study-hero-title', {
                    y: 80,
                    opacity: 0,
                    duration: 1.4,
                    ease: 'expo.out',
                    delay: 0.2
                });
                gsap.from('.case-study-hero-subtitle', {
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'expo.out',
                    delay: 0.4
                });
                gsap.from('.case-study-meta-item', {
                    y: 20,
                    opacity: 0,
                    duration: 1.0,
                    stagger: 0.15,
                    ease: 'expo.out',
                    delay: 0.6
                });
                gsap.from('.case-study-hero-visual', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 1.6,
                    ease: 'power2.out',
                    delay: 0.5
                });
            }
        }, 100);

        // Cleanup exit class after transition completes
        setTimeout(() => {
            overlay.classList.remove('exit');
        }, 1000);
    }

    // ─── 2. VIEW CASE STUDY CLICK INTERCEPTION (EXIT TRANSITION) ───
    const handleNavigation = (e, href) => {
        e.preventDefault();
        
        if (!overlay) {
            window.location.href = href;
            return;
        }

        // Disable scrolling during transition
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Check if the click came from a featured project card
        const card = e.currentTarget.closest('.featured-project');
        if (card && typeof gsap !== 'undefined') {
            const rect = card.getBoundingClientRect();
            
            // Cinematic sequence:
            // 1. Darken background and fade out other page elements
            const timeline = gsap.timeline();
            
            // Fade out siblings, navigation, and other sections
            timeline.to('header, section:not(#work), footer, .section-header', {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: 'power2.out'
            }, 0);

            // Fade out other project cards
            const siblings = Array.from(document.querySelectorAll('.featured-project')).filter(s => s !== card);
            timeline.to(siblings, {
                opacity: 0,
                scale: 0.95,
                duration: 0.5,
                ease: 'power2.out'
            }, 0);

            // 2. Expand the clicked project visual and text slightly
            timeline.to(card, {
                scale: 1.02,
                duration: 0.6,
                ease: 'power3.inOut'
            }, 0);

            // 3. Scale up transition overlay to cover the viewport
            setTimeout(() => {
                overlay.classList.add('active');
            }, 300);

            // 4. Redirect to the new page after the overlay covers the screen
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        } else {
            // General link transition (e.g. from Experience panel or back-to-portfolio button)
            if (typeof gsap !== 'undefined') {
                gsap.to('body > *', {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            }
            overlay.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 800);
        }
    };

    // Bind to all case study links
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.view-case-study');
        if (link) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) {
                handleNavigation(e, href);
            }
        }

        const backLink = e.target.closest('.back-to-portfolio');
        if (backLink) {
            const href = backLink.getAttribute('href');
            if (href) {
                handleNavigation(e, href);
            }
        }
    });
});
