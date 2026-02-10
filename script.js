/* ============================
   ANDREA & ASSOCIATES
   Premium Landing Page Scripts
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- NAVBAR SCROLL BEHAVIOR ----------
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ---------- MOBILE MENU TOGGLE ----------
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- ACTIVE NAV LINK ON SCROLL ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---------- SCROLL REVEAL ANIMATIONS ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ---------- COUNTER ANIMATION ----------
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * target);

            el.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    counters.forEach(counter => animateCounter(counter));
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        counterObserver.observe(statsSection);
    }

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- CONTACT FORM HANDLING ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10" />
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 12 2 2 4-4"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                    Message Sent!
                `;
                submitBtn.style.background = '#40916C';
                submitBtn.style.opacity = '1';

                // Reset after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ---------- HERO VIDEO FALLBACK ----------
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {
            // If autoplay fails, try muted autoplay
            heroVideo.muted = true;
            heroVideo.play().catch(() => {
                // If still fails, show poster/fallback
                console.log('Video autoplay not supported');
            });
        });
    }

    // ---------- PARALLAX-LIKE SCROLL EFFECTS ----------
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    function handleParallax() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;

            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - progress * 1.5;
            }

            if (scrollIndicator) {
                scrollIndicator.style.opacity = Math.max(0, 0.7 - progress * 3);
            }
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ---------- STAGGER GRID CHILDREN ----------
    document.querySelectorAll('.team-grid, .services-grid, .programs-grid').forEach(grid => {
        grid.classList.add('stagger-children');
    });

    // ---------- SPECIALTY TAG HOVER EFFECT ----------
    const specialtyTags = document.querySelectorAll('.specialty-tag');
    specialtyTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transitionDelay = '0s';
        });
    });

    // ---------- INITIAL HERO ANIMATION ----------
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 300 + (i * 150));
        });
    }, 500);

    // ---------- PRELOAD KEY RESOURCES ----------
    const preloadImages = [
        'https://static.wixstatic.com/media/b9cbd60281ff4008a51e4838cdb07e72.jpg/v1/fill/w_800,h_1152,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/pexels-matheus-natan-3297593-(1)%20(2).jpg'
    ];

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

});

// ---------- CSS SPINNER ANIMATION ----------
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
