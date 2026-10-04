document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. MODO OSCURO GLOBAL (PERSISTENTE EN LOCALSTORAGE)
    =================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Modo Claro';
        } else {
            document.body.classList.remove('dark-theme');
            document.documentElement.classList.remove('dark-theme');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Modo Oscuro';
        }
    };

    // Inicializar tema guardado
    if (currentTheme === 'dark') {
        applyTheme(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-theme');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    /* ===================================================
       2. LÓGICA DEL CARRUSEL Y BUSCADOR EN TIEMPO REAL
    =================================================== */
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('carousel-counter');
    const searchInput = document.getElementById('project-search');
    const noProjectsMsg = document.getElementById('no-projects-msg');

    let allProjectCards = Array.from(document.querySelectorAll('.project-card'));
    let filteredCards = [...allProjectCards];
    let currentIndex = 0;

    function updateCarousel() {
        if (filteredCards.length === 0) {
            if (carousel) carousel.style.transform = `translateX(0)`;
            if (counter) counter.textContent = `0 de 0`;
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            if (noProjectsMsg) noProjectsMsg.style.display = 'block';
            return;
        }

        if (noProjectsMsg) noProjectsMsg.style.display = 'none';

        // Ajustar límites de índice
        if (currentIndex >= filteredCards.length) {
            currentIndex = filteredCards.length - 1;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        // Mover carrusel
        const offset = -currentIndex * 100;
        if (carousel) carousel.style.transform = `translateX(${offset}%)`;

        // Actualizar contador visual
        if (counter) counter.textContent = `${currentIndex + 1} de ${filteredCards.length}`;

        // Habilitar / deshabilitar navegación
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === filteredCards.length - 1;
    }

    // Botones Siguiente / Anterior
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < filteredCards.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    // Buscador interactivo
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            allProjectCards.forEach(card => {
                const searchData = card.getAttribute('data-title')?.toLowerCase() || '';
                const matches = searchData.includes(query);

                if (matches) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Actualizar lista activa y resetear posición
            filteredCards = allProjectCards.filter(card => card.style.display !== 'none');
            currentIndex = 0;
            updateCarousel();
        });
    }

    // Inicializar carrusel al cargar
    updateCarousel();

    /* ===================================================
       3. EFECTO DE ESCRITURA EN EL SUBTÍTULO
    =================================================== */
    const heroText = document.querySelector('.hero p');
    if (heroText) {
        const textToType = heroText.textContent;
        heroText.textContent = '';
        let index = 0;

        function typeEffect() {
            if (index < textToType.length) {
                heroText.textContent += textToType.charAt(index);
                index++;
                setTimeout(typeEffect, 30);
            }
        }
        typeEffect();
    }

    /* ===================================================
       4. INTERACTIVIDAD EN ETIQUETAS DE HABILIDADES
    =================================================== */
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active-skill');
            const skillName = tag.textContent.replace(/[()]/g, '').trim();
            if (searchInput) {
                searchInput.value = skillName;
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });

    /* ===================================================
       5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    =================================================== */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Enviar';
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                alert(`¡Gracias ${name}! Tu mensaje ha sido recibido con éxito.`);
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }, 1200);
        });
    }

    /* ===================================================
       6. ANIMACIÓN DE APARICIÓN AL DESPLAZARSE (SCROLL)
    =================================================== */
    const observerOptions = {
        threshold: 0.15
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sectionsToAnimate = document.querySelectorAll('.wireframe-box, .section-divider');
    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in');
        revealOnScroll.observe(section);
    });
});