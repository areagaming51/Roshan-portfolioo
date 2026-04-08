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

    // ---- Before/After Slider (supports multiple instances) ----
    const sliderContainers = document.querySelectorAll('.slider-container[data-before-after="true"]');
    if (sliderContainers.length) {
        sliderContainers.forEach((slider) => {
            // apply optional aspect ratio declared on the slider (e.g. data-ratio="4/5" or "16/9")
            const ratioRaw = slider.dataset.ratio || '4/5';
            const ratioParts = ratioRaw.includes('/') ? ratioRaw.split('/').map(s => s.trim()) : [ratioRaw];
            if (ratioParts.length === 2) slider.style.setProperty('aspect-ratio', `${ratioParts[0]} / ${ratioParts[1]}`);
            else slider.style.setProperty('aspect-ratio', ratioRaw);

            const handle = slider.querySelector('.slider-handle');
            const afterImg = slider.querySelector('.after-image');
            let isDragging = false;

            const setPositionFromClientX = (clientX) => {
                const rect = slider.getBoundingClientRect();
                let position = ((clientX - rect.left) / rect.width) * 100;
                position = Math.max(0, Math.min(100, position));
                if (handle) handle.style.left = `${position}%`;
                if (afterImg) afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
            };

            const onPointerMove = (e) => {
                if (!isDragging) return;
                const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
                if (clientX) setPositionFromClientX(clientX);
            };

            const start = (e) => {
                isDragging = true;
                slider.classList.add('dragging');
                const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
                if (clientX) setPositionFromClientX(clientX);
                e.preventDefault?.();
            };

            const stop = () => {
                isDragging = false;
                slider.classList.remove('dragging');
            };

            // Pointer events (unified)
            slider.addEventListener('pointerdown', (e) => {
                try { slider.setPointerCapture?.(e.pointerId); } catch (err) { }
                start(e);
            });
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', stop);

            // click to reposition
            slider.addEventListener('click', (e) => {
                const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
                if (clientX) setPositionFromClientX(clientX);
            });

            // initialize at 50%
            setTimeout(() => {
                const rect = slider.getBoundingClientRect();
                if (rect.width > 0) setPositionFromClientX(rect.left + rect.width / 2);
            }, 80);
        });
    }

    // ---- Gallery tabs (filter) ----
    const tabButtons = document.querySelectorAll('.tab-btn[data-filter]');
    const filterItems = document.querySelectorAll('[data-filter-item]');
    if (tabButtons.length && filterItems.length) {
        const applyFilter = (filter) => {
            filterItems.forEach((el) => {
                const itemFilter = el.getAttribute('data-filter-item') || 'all';
                const shouldShow = filter === 'all' || itemFilter === filter;
                el.style.display = shouldShow ? '' : 'none';
            });
        };

        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                applyFilter(btn.getAttribute('data-filter') || 'all');
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

    // ---- Autoplay muted previews near viewport ----
    const previewVideos = document.querySelectorAll('video[data-preview="true"]');
    if (previewVideos.length && !prefersReducedMotion) {
        const playSafe = async (video) => {
            try {
                video.muted = true;
                await video.play();
            } catch {
                // Autoplay can be blocked; ignore silently.
            }
        };

        const pauseSafe = (video) => {
            try { video.pause(); } catch { }
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (!(video instanceof HTMLVideoElement)) return;
                if (entry.isIntersecting) {
                    playSafe(video);
                } else {
                    pauseSafe(video);
                }
            });
        }, { threshold: 0.35, rootMargin: '150px 0px 150px 0px' });

        previewVideos.forEach(v => io.observe(v));
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
