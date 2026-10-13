/**
 * PRATEESH ENGINEERING ENTERPRISES - SCRIPT
 * 
 * Clean, modular script organized strictly by sequential page layout:
 * 1. Global Setup & Performance Optimization
 * 2. Navigation Bar & Mobile Drawer Menu
 * 3. Hero Section (Video playback & Animated Stats Counters)
 * 4. Services Section (Scroll Reveal Animations)
 * 5. FAQ Section (Accordion)
 * 6. Reviews Section (Client Testimonials Slider & Dots)
 * 7. Contact Section (Quote & Contact Form Handler)
 * 8. Footer & Floating Action Buttons (Scroll-to-top)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. GLOBAL SETUP & PERFORMANCE OPTIMIZATION
       ========================================================================== */
    // Mark JS enabled for progressive enhancement animations
    document.documentElement.classList.add('js-enabled');

    // Throttled scroll runner using requestAnimationFrame for 60fps performance
    let isScrolling = false;
    const scrollCallbacks = [];

    const registerScrollCallback = (fn) => {
        scrollCallbacks.push(fn);
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY || window.pageYOffset;
                for (let i = 0; i < scrollCallbacks.length; i++) {
                    scrollCallbacks[i](scrollY);
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    /* ==========================================================================
       2. NAVIGATION BAR & MOBILE DRAWER MENU
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navDrawerClose = document.getElementById('navDrawerClose');
    const navAnchorLinks = document.querySelectorAll('.nav-links a');

    // Navbar Scrolled Glassmorphism State
    if (navbar) {
        registerScrollCallback((scrollY) => {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Drawer Control
    const closeMenu = () => {
        if (navbar) navbar.classList.remove('menu-open');
        if (navLinks) navLinks.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        if (navbar) navbar.classList.add('menu-open');
        if (navLinks) navLinks.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        if (menuToggle) {
            menuToggle.classList.add('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
        document.body.style.overflow = 'hidden';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks && navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }

    if (navDrawerClose) {
        navDrawerClose.addEventListener('click', closeMenu);
    }

    // Close menu when tapping anywhere outside the drawer
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close mobile menu when any navigation link is clicked
    navAnchorLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================================================
       3. HERO SECTION (Video Playback & Animated Stats Counter)
       ========================================================================== */
    // Ensure Hero Video starts immediately without blocking
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }

    // Number Counter Animation for Hero Stats
    const statSection = document.querySelector('.hero-stats');
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target') || 0;
            const duration = 1600; // 1.6s smooth easing
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic curve
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeOut * target);

                counter.innerText = currentVal + '+';

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + '+';
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    if ('IntersectionObserver' in window && statSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        statsObserver.observe(statSection);
    } else {
        startCounters();
    }

    /* ==========================================================================
       4. SCROLL REVEAL & TEXT ANIMATIONS
       ========================================================================== */
    const revealSelectors = [
        '.section-header',
        '.about-intro',
        '.infrastructure',
        '.about-right',
        '.stat-card',
        '.horizontal-service-card',
        '.marquee-wrapper',
        '.project-card',
        '.all-works-title',
        '.showcase-category',
        '.project-experience-card',
        '.agencies',
        '.gallery-item',
        '.gallery-cta-wrapper',
        '.advantage-card',
        '.faq-item',
        '.review-slider-container',
        '.btn-leave-review',
        '.contact-info-block',
        '.contact-form-block',
        '.map-card',
        '.service-page-header',
        '.gallery-full-heading'
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    revealElements.forEach((el) => {
        el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach((el) => {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach((el) => {
            el.classList.add('is-revealed');
        });
    }

    /* ==========================================================================
       5. FAQ SECTION (Accordion Interactions)
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question) => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');

            // Close all items
            faqQuestions.forEach((other) => {
                other.classList.remove('active');
            });

            // Toggle selected item
            if (!isActive) {
                question.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       6. REVIEWS SECTION (Testimonial Slider & Dots)
       ========================================================================== */
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval = null;

    const showSlide = (index) => {
        if (!reviewCards.length) return;
        reviewCards.forEach((card) => card.classList.remove('active'));
        dots.forEach((dot) => dot.classList.remove('active'));

        currentSlide = (index + reviewCards.length) % reviewCards.length;
        if (reviewCards[currentSlide]) reviewCards[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    if (reviewCards.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }

    /* ==========================================================================
       7. CONTACT SECTION (Form Submission Feedback)
       ========================================================================== */
    const submitBtn = document.querySelector('.btn-submit');
    const contactForm = document.querySelector('.contact-form');

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.classList.add('submitting');

            // Simulate form submission feedback
            setTimeout(() => {
                submitBtn.innerText = 'Message Sent!';
                submitBtn.classList.remove('submitting');
                submitBtn.classList.add('sent-success');

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.classList.remove('sent-success');
                    if (contactForm) contactForm.reset();
                }, 3000);
            }, 1200);
        });
    }

    /* ==========================================================================
       8. FOOTER & FLOATING SCROLL-TO-TOP BUTTON
       ========================================================================== */
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        registerScrollCallback((scrollY) => {
            if (scrollY > 250) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
