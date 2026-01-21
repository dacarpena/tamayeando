document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links (polyfill-like behavior if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Form Validation/Handling (Client side feedback)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            // Web3Forms handles the submission via AJAX
            e.preventDefault();
            const data = new FormData(contactForm);

            formStatus.textContent = "Enviando mensaje...";
            formStatus.style.color = "var(--text-color)";

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const jsonData = await response.json();

                if (response.ok && jsonData.success) {
                    formStatus.textContent = "¡Gracias! Tu mensaje ha sido enviado correctamente.";
                    formStatus.style.color = "#4CAF50";
                    contactForm.reset();
                } else {
                    formStatus.textContent = jsonData.message || "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
                    formStatus.style.color = "#E07A5F";
                }
            } catch (error) {
                formStatus.textContent = "Hubo un error de conexión. Por favor, inténtalo de nuevo.";
                formStatus.style.color = "#E07A5F";
            }
        });
    }

    // Scroll Header Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            header.style.padding = "10px 0";
        } else {
            header.style.boxShadow = "none";
            header.style.padding = "15px 0";
        }
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Hero Parallax Effect
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            if (scrollValue < window.innerHeight) {
                // Parallax for background (slower)
                heroBg.style.transform = `translateY(${scrollValue * 0.5}px)`;
                // Parallax for content (slightly faster fade out/up)
                heroContent.style.transform = `translateY(${scrollValue * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollValue / 700);
            }
        });
    }

    // Page Load Transition
    document.body.classList.add('loaded');

    // Mouse Move Glow Effect (Only for devices with hover capability)
    if (window.matchMedia('(hover: hover)').matches) {
        const cards = document.querySelectorAll('.tour-card, .destination-card, .contact-wrapper, .testimonial-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Subtle Tilt Effect
                const xPct = (x / rect.width) - 0.5;
                const yPct = (y / rect.height) - 0.5;

                // Limit tilt to small angles (e.g., 5deg) for elegance
                card.style.transform = `perspective(1000px) rotateX(${yPct * -4}deg) rotateY(${xPct * 4}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
                card.style.setProperty('--mouse-x', `50%`);
                card.style.setProperty('--mouse-y', `50%`);
            });
        });
    }

    // Custom Cursor Follower
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.querySelector('.cursor-follower');
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Linear interpolation for smooth following
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .tour-card, .destination-card, input, textarea');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
