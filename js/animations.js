document.addEventListener('DOMContentLoaded', () => {
    // ─── Wait for GSAP ───
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 100);
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        runAnimations();
    }
    initGSAP();

    function runAnimations() {
        // Only run home-page animations if home-page elements exist
        const isHomePage = document.getElementById('intro-scene');
        
        if (isHomePage) {
            // ─── Intro Scene — Cinematic Entrance ───
            const introEntrance = gsap.timeline({ delay: 0.15 });
            introEntrance
                .to('#intro-atmosphere', { opacity: 1, duration: 1.8, ease: 'power2.out' })
                .to('.intro-title-line--first span', { y: 0, duration: 1.4, ease: 'expo.out' }, '-=1.4')
                .to('.intro-title-line--last span', { y: 0, duration: 1.5, ease: 'expo.out' }, '-=1.1')
                .to('.intro-orb', { opacity: 1, duration: 1.6, stagger: 0.2, ease: 'power2.out' }, '-=1.2')
                .to('.intro-progress-bar', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.8');

            // ─── Intro Scene — Scroll-Driven Parallax Exit & Fade ───
            const introExit = gsap.timeline({
                scrollTrigger: {
                    trigger: '#intro-scene',
                    start: 'top top',
                    end: '+=100%',
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                }
            });
            introExit
                .to('.intro-fade-overlay', { opacity: 1, duration: 1, ease: 'none' }, 0)
                .to('.intro-atmosphere-img', { scale: 1.12, duration: 1, ease: 'none' }, 0)
                .to('.intro-content-container', { y: -80, duration: 1, ease: 'none' }, 0)
                .to('.intro-progress-line-fill', { height: '100%', duration: 1, ease: 'none' }, 0)
                .to('.intro-progress-bar', { yPercent: -15, duration: 1, ease: 'none' }, 0);

            // ─── Intro Mouse Parallax (desktop) ───
            if (window.innerWidth > 768) {
                const introEl = document.querySelector('.intro-inner');
                if (introEl) {
                    introEl.addEventListener('mousemove', (e) => {
                        const nx = (e.clientX / window.innerWidth) - 0.5;
                        const ny = (e.clientY / window.innerHeight) - 0.5;
                        gsap.to('.intro-orb--1', { x: nx * 40, y: ny * 30, duration: 1.2, ease: 'power2.out' });
                        gsap.to('.intro-orb--2', { x: nx * -35, y: ny * -25, duration: 1.2, ease: 'power2.out' });
                        gsap.to('.intro-atmosphere-img', { x: nx * 12, y: ny * 8, duration: 1.4, ease: 'power2.out' });
                        gsap.to('.intro-content-container', { x: nx * 15, y: ny * 10, duration: 1.4, ease: 'power2.out' });
                    });
                }
            }

            // ─── Navbar scroll state ───
            const nav = document.getElementById('main-nav');
            if (nav) {
                // Initialize nav visibility based on current position (e.g. on page refresh)
                if (window.scrollY > 120) {
                    nav.classList.add('visible');
                } else {
                    nav.classList.remove('visible');
                }
                if (window.scrollY > 300) {
                    nav.classList.add('scrolled');
                }

                ScrollTrigger.create({
                    start: 'top top',
                    onUpdate: (self) => {
                        // Hide navbar at the top (hero), show once scrolled past 120px
                        if (self.scroll() > 120) {
                            nav.classList.add('visible');
                        } else {
                            nav.classList.remove('visible');
                        }

                        // Apply scrolled background style once past 300px
                        if (self.scroll() > 300) {
                            nav.classList.add('scrolled');
                        } else {
                            nav.classList.remove('scrolled');
                        }
                    }
                });
            }

            // ─── About Section Redesigned Animations ───
            gsap.to('.about-circle-svg', {
                rotation: 360,
                duration: 150,
                ease: 'none',
                repeat: -1,
                transformOrigin: "center center"
            });

            gsap.to('.about-circle-satellite', {
                rotation: 360,
                duration: 110,
                ease: 'none',
                repeat: -1,
                transformOrigin: "100px 100px"
            });

            gsap.to('.about-watermark--build', {
                y: -50,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
            gsap.to('.about-watermark--create', {
                y: -90,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
            gsap.to('.about-watermark--impact', {
                y: -70,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                }
            });

            // Staggered Storytelling Reveal Timeline
            const aboutEntrance = gsap.timeline({
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 65%',
                    toggleActions: 'play none none none'
                }
            });

            aboutEntrance
                .to('.about-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
                .to('.about-portrait-reveal-wrap', { 
                    opacity: 1, 
                    scale: 1, 
                    filter: 'blur(0px)', 
                    duration: 0.9, 
                    ease: 'power2.out' 
                }, 0.05)
                .to('.about-editorial-heading .heading-line', { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.1, 
                    stagger: 0.15, 
                    ease: 'power3.out' 
                }, '-=0.5')
                .to('.about-editorial-line', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
                .to('.about-editorial-paragraphs p', { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.15, 
                    ease: 'power2.out' 
                }, '-=0.5')
                .to('.about-social-links', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
                .to('.about-signature-quote-wrap', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
                .call(() => {
                    document.querySelectorAll('.gold-sweep').forEach(el => el.classList.add('active-sweep'));
                }, null, '-=0.5');

            gsap.to('.about-portrait-floating-wrap', {
                y: 3,
                duration: 5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });

            if (window.innerWidth > 768) {
                const card = document.querySelector('.about-portrait-card');
                if (card) {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width/2;
                        const y = e.clientY - rect.top - rect.height/2;
                        const px = x / (rect.width/2);
                        const py = y / (rect.height/2);
                        gsap.to(card, {
                            rotationY: px * 2,
                            rotationX: -py * 2,
                            transformPerspective: 1000,
                            ease: 'power2.out',
                            duration: 0.8
                        });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, {
                            rotationY: 0,
                            rotationX: 0,
                            ease: 'power2.out',
                            duration: 1.0
                        });
                    });
                }
            }

            gsap.to('.about-editorial-heading', {
                opacity: 0.4,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'bottom 50%',
                    end: 'bottom top',
                    scrub: true
                }
            });

            gsap.to('.about-portrait-exit-wrap', {
                scale: 1.05,
                opacity: 0.5,
                scrollTrigger: {
                    trigger: '#about',
                    start: 'bottom 50%',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // ─── Skills Section Atmospheric Rotation ───
            gsap.to('.skills-atmos-orbit', {
                rotation: -360,
                duration: 180,
                ease: 'none',
                repeat: -1,
                transformOrigin: "center center"
            });
        }

        // ─── Scroll Reveal (IntersectionObserver-powered for performance) ───
        // This is safe to run on all pages
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length > 0) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const parent = entry.target.parentElement;
                        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
                        const siblingIndex = siblings.indexOf(entry.target);
                        const delay = siblingIndex * 0.08;

                        gsap.to(entry.target, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: delay,
                            ease: 'expo.out',
                        });
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

            reveals.forEach(el => revealObserver.observe(el));
        }
    }
});
