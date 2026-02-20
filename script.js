/* =====================================================
   Roshan AI Studios — Port 2 Portfolio — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ---- Navbar hide/show on scroll ----
    let lastScrollY = 0;
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                navbar.style.transform = 'translateX(-50%) translateY(120%)';
                navbar.style.opacity = '0';
            } else {
                navbar.style.transform = 'translateX(-50%) translateY(0)';
                navbar.style.opacity = '1';
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            navLinksEl.classList.toggle('open');
        });
        // Close menu when a link is clicked
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksEl.classList.remove('open');
            });
        });
    }

    // ---- Sticker wiggle ----
    document.querySelectorAll('.sticker').forEach(sticker => {
        sticker.addEventListener('mouseenter', () => {
            sticker.style.animation = 'wiggle 0.4s ease';
            setTimeout(() => { sticker.style.animation = ''; }, 400);
        });
    });

    // ---- Smooth scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Drag-to-scroll for AI Showcase ----
    const showcaseWrapper = document.getElementById('showcaseWrapper');
    if (showcaseWrapper) {
        let isDown = false;
        let startX, scrollLeft;

        showcaseWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - showcaseWrapper.offsetLeft;
            scrollLeft = showcaseWrapper.scrollLeft;
        });
        showcaseWrapper.addEventListener('mouseleave', () => { isDown = false; });
        showcaseWrapper.addEventListener('mouseup', () => { isDown = false; });
        showcaseWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - showcaseWrapper.offsetLeft;
            showcaseWrapper.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
    }

    // ---- WhatsApp float: hide near footer ----
    const waFloat = document.getElementById('whatsappFloat');
    if (waFloat) {
        window.addEventListener('scroll', () => {
            const footer = document.querySelector('.footer');
            if (!footer) return;
            const footerTop = footer.getBoundingClientRect().top;
            waFloat.style.opacity = footerTop < window.innerHeight - 20 ? '0' : '1';
            waFloat.style.pointerEvents = footerTop < window.innerHeight - 20 ? 'none' : '';
        }, { passive: true });
    }

    // ---- Before/After Slider ----
    const slider = document.getElementById('beforeAfterSlider');
    if (slider) {
        const handle = slider.querySelector('.slider-handle');
        const afterImg = slider.querySelector('.after-image');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            handle.style.left = `${position}%`;
            afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };

        const startDragging = (e) => {
            isDragging = true;
            slider.classList.add('dragging');
            onMove(e);
        };

        const stopDragging = () => {
            isDragging = false;
            slider.classList.remove('dragging');
        };

        slider.addEventListener('mousedown', startDragging);
        slider.addEventListener('touchstart', startDragging, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
    }

});

// ---- Wiggle keyframes ----
const style = document.createElement('style');
style.textContent = `
  @keyframes wiggle {
    0%   { transform: rotate(0deg); }
    25%  { transform: rotate(5deg); }
    50%  { transform: rotate(-5deg); }
    75%  { transform: rotate(3deg); }
    100% { transform: rotate(0deg); }
  }
`;
document.head.appendChild(style);
