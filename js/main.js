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
            // Formspree handles the submission, but we can intercept to show loading state
            // If using Formspree AJAX:
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
                
                if (response.ok) {
                    formStatus.textContent = "¡Gracias! Tu mensaje ha sido enviado correctamente.";
                    formStatus.style.color = "green";
                    contactForm.reset();
                } else {
                    const jsonData = await response.json();
                    if (Object.hasOwn(jsonData, 'errors')) {
                         formStatus.textContent = jsonData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
                    }
                    formStatus.style.color = "red";
                }
            } catch (error) {
                formStatus.textContent = "Hubo un error de conexión. Por favor, inténtalo de nuevo.";
                formStatus.style.color = "red";
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
});
