document.addEventListener('DOMContentLoaded', () => {

    const heroContent = document.getElementById('heroContent');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const progressBar = document.getElementById('scroll-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const el = entry.target;
                if (el.classList.contains('type-text') && !el.dataset.typed) {
                    el.dataset.typed = 'true';
                    typeText(el);
                }
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.highlight-card').forEach(card => {
        observer.observe(card);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            card.style.animation = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.animation = '';
        });
    });

    function typeText(el) {
        const fullText = el.dataset.text || el.textContent;
        el.style.visibility = 'visible';

        function loop() {
            el.textContent = '';
            let i = 0;
            const cursor = document.createElement('span');
            cursor.className = 'type-cursor';
            el.appendChild(cursor);

            function type() {
                if (i < fullText.length) {
                    const span = document.createElement('span');
                    span.className = 'typed-char';
                    span.textContent = fullText[i];
                    el.insertBefore(span, cursor);
                    i++;
                    setTimeout(type, 80 + Math.random() * 50);
                } else {
                    setTimeout(() => {
                        cursor.remove();
                        setTimeout(loop, 2000);
                    }, 2500);
                }
            }
            type();
        }
        loop();
    }

    function onScroll() {
        const scrollY = window.scrollY;
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        const scrollPercent = scrollY / (docHeight - winHeight);
        progressBar.style.width = `${scrollPercent * 100}%`;

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 60);
        }

        if (heroContent) {
            const heroProgress = Math.min(scrollY / winHeight, 1);
            const scale = 1 - heroProgress * 0.12;
            const opacity = 1 - heroProgress * 0.8;
            const translateY = heroProgress * 60;
            heroContent.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            heroContent.style.opacity = opacity;
        }

        if (scrollIndicator) {
            const heroProgress = Math.min(scrollY / winHeight, 1);
            scrollIndicator.style.opacity = 1 - heroProgress * 2;
            scrollIndicator.style.transform = `translateX(-50%) translateY(${heroProgress * 30}px)`;
        }
    }

    // ─── MOBILE MENU ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
