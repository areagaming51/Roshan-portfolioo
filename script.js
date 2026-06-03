/* =====================================================
   Roshan AI Studios — Port 2 Portfolio — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

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

    // ---- Email float: hide near footer ----
    const emailFloatEl = document.getElementById('emailFloat');
    if (emailFloatEl) {
        window.addEventListener('scroll', () => {
            const footer = document.querySelector('.footer');
            if (!footer) return;
            const footerTop = footer.getBoundingClientRect().top;
            emailFloatEl.style.opacity = footerTop < window.innerHeight - 20 ? '0' : '1';
            emailFloatEl.style.pointerEvents = footerTop < window.innerHeight - 20 ? 'none' : '';
        }, { passive: true });
    }

    // ---- Before/After Slider ----
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(slider => {
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
            if (e.type !== 'touchstart') {
                const x = e.clientX;
                updateSlider(x);
            }
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
    });

    // ---- Portfolio Vault Category Filtering ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item, .reel-card');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Adjust Active State Styling
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.dataset.target || 'all';

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category') || 'stills';
                    if (target === 'all' || itemCategory === target) {
                        item.style.display = '';
                        setTimeout(() => item.classList.add('visible'), 50);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('visible');
                    }
                });

                // Toggle visibility of section headers/walls based on filter
                const eCommerceHeader = document.querySelector('.reels-wall-header-ecom');
                const eCommerceWall = document.querySelector('.reels-wall-ecom');
                const saasHeader = document.querySelector('.reels-wall-header-saas');
                const saasWall = document.querySelector('.reels-wall-saas');
                const motionHeader = document.querySelector('.reels-wall-header-motion');
                const motionWall = document.querySelector('.reels-wall-motion');
                const stillsHeader = document.querySelector('.stills-header');
                const stillsWall = document.querySelector('.gallery-masonry');

                if (eCommerceHeader) eCommerceHeader.style.display = (target === 'all' || target === 'ads') ? '' : 'none';
                if (eCommerceWall) eCommerceWall.style.display = (target === 'all' || target === 'ads') ? '' : 'none';
                if (saasHeader) saasHeader.style.display = (target === 'all' || target === 'saas') ? '' : 'none';
                if (saasWall) saasWall.style.display = (target === 'all' || target === 'saas') ? '' : 'none';
                if (motionHeader) motionHeader.style.display = (target === 'all' || target === 'automation') ? '' : 'none';
                if (motionWall) motionWall.style.display = (target === 'all' || target === 'automation') ? '' : 'none';
                if (stillsHeader) stillsHeader.style.display = (target === 'all' || target === 'stills') ? '' : 'none';
                if (stillsWall) stillsWall.style.display = (target === 'all' || target === 'stills') ? '' : 'none';
            });
        });
    }

    // ---- Media modal (image/video) ----
    const modal = document.getElementById('mediaModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');

    const closeModal = () => {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalBody) modalBody.innerHTML = '';
        if (modalTitle) modalTitle.textContent = '';
        if (modalTags) modalTags.textContent = '';
    };

    const openModal = ({ kind, src, title, tags }) => {
        if (!modal || !modalBody) return;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalTitle) modalTitle.textContent = title || '';
        if (modalTags) modalTags.textContent = tags || '';

        if (kind === 'video') {
            const v = document.createElement('video');
            v.src = src;
            v.controls = true;
            v.playsInline = true;
            v.preload = 'metadata';
            v.autoplay = true;
            v.muted = false;
            modalBody.appendChild(v);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = title || 'Media';
            img.loading = 'eager';
            modalBody.appendChild(img);
        }
    };

    document.querySelectorAll('.js-open-modal').forEach((el) => {
        el.addEventListener('click', () => {
            const kind = el.getAttribute('data-modal-kind') || 'image';
            const src = el.getAttribute('data-src') || '';
            const title = el.getAttribute('data-title') || '';
            const tags = el.getAttribute('data-tags') || '';
            if (!src) return;
            openModal({ kind, src, title, tags });
        });
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.matches('[data-modal-close="true"]')) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
        });
    }

    // ---- High-Performance Scroll Play Triggering & Lazy Loading ----
    const lazyVideos = document.querySelectorAll('.lazy-video');

    if (lazyVideos.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                const source = video.querySelector('source');

                if (entry.isIntersecting) {
                    // Lazy load video data stream if source isn't applied yet
                    if (!video.src && source && source.dataset.src) {
                        video.src = source.dataset.src;
                        video.load();
                    }
                    
                    // Attempt clean play execution
                    video.play().catch(() => { /* Prevent uncaught DOM exceptions if muted blocks run */ });
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.25, // Triggers when 25% of card surface frame is fully visible
            rootMargin: "100px"
        });

        lazyVideos.forEach(video => videoObserver.observe(video));
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
