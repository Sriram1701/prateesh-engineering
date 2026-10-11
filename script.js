document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Ensure hero video plays immediately without delay
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const navBackdrop = document.querySelector('.nav-backdrop');
    
    // Mobile menu toggle functions
    const closeMenu = () => {
        navbar.classList.remove('menu-open');
        navLinks.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        menuToggle.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        navbar.classList.add('menu-open');
        navLinks.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        menuToggle.classList.add('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        document.body.style.overflow = 'hidden';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }

    // Close menu when tapping anywhere outside the drawer
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    const navDrawerClose = document.getElementById('navDrawerClose');
    if (navDrawerClose) {
        navDrawerClose.addEventListener('click', closeMenu);
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Form submit button interaction
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.8';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerText = 'Message Sent!';
                submitBtn.style.backgroundColor = '#10B981'; // Success green
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = '';
                    const form = document.querySelector('.contact-form');
                    if (form) form.reset();
                }, 3000);
            }, 1500);
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle current
            question.classList.toggle('active');
            
            // Close others
            faqQuestions.forEach(other => {
                if (other !== question && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
        });
    });

    // Review Slider
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        reviewCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        reviewCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % reviewCards.length;
        showSlide(next);
    }

    if (reviewCards.length > 0) {
        // Auto slide
        slideInterval = setInterval(nextSlide, 5000);
        
        // Dot click
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }

    // Add js-enabled class to document root for progressive enhancement animations
    document.documentElement.classList.add('js-enabled');

    // Smooth Scroll Reveal Animation for Service Cards
    const serviceCards = document.querySelectorAll('.horizontal-service-card');
    if ('IntersectionObserver' in window && serviceCards.length > 0) {
        const serviceObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card-loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        serviceCards.forEach(card => {
            serviceObserver.observe(card);
        });
    } else {
        serviceCards.forEach(card => card.classList.add('card-loaded'));
    }

    // Number Counter Animation for Hero Stats (triggers on scroll when viewed)
    const statSection = document.querySelector('.hero-stats');
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || 0;
            const duration = 1600; // 1.6s smooth easing
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
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
            entries.forEach(entry => {
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

    // Floating Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 250) {
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
