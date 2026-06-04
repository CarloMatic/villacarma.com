/**
 * Villa Carma - Main Application Script
 * Handles smooth scrolling, animations, and other interactive elements.
 */

import translations from './translations.js';

/**
 * Villa Carma - Main Application Script
 * Handles smooth scrolling, animations, slide, and i18n.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initRevealAnimations();
    initHeroSlider();
    initGallery();
    initLanguage();
    initScrollHeader();
    initMobileMenu();
    initConsentManager();
    initEmailProtection();
    initLightbox();
});

function initScrollHeader() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --- I18N LOGIC --- */
window.switchLang = function (lang) {
    localStorage.setItem('vilacarma_lang', lang);
    applyLanguage(lang);
}

function initLanguage() {
    const savedLang = localStorage.getItem('vilacarma_lang') || 'de';
    applyLanguage(savedLang);
}

function applyLanguage(lang) {
    document.documentElement.lang = lang; // Update SEO lang attribute
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update Buttons State
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Dropdown Label
    const flags = { 'de': '🇩🇪 DE', 'en': '🇺🇸 EN', 'fr': '🇫🇷 FR', 'es': '🇪🇸 ES' };
    const btn = document.getElementById('current-lang-btn');
    if (btn && flags[lang]) {
        btn.textContent = flags[lang];
    }

    // Update Booking Widget
    document.querySelectorAll('.calendarWidget').forEach(el => el.classList.remove('active'));

    // Construct ID based on lang
    const widgetId = `smoobuApartment1361225${lang}`;
    const widget = document.getElementById(widgetId);

    if (widget) {
        widget.classList.add('active');
    } else {
        // Fallback to DE if specific lang widget missing
        const fallback = document.getElementById('smoobuApartment1361225de');
        if (fallback) fallback.classList.add('active');
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/**
 * Simple Intersection Observer for scroll animations
 * Adds 'visible' class to elements when they come into view.
 */
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.feature-card, .section-title, .lead-text');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });
}

/**
 * Cookie Banner Logic
 */
/**
 * Consent Manager (GDPR)
 */
function initConsentManager() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const settingsBtn = document.getElementById('cookie-settings-btn');
    const reopenBtn = document.getElementById('cookie-reopen-btn'); // Floating button
    const localKey = 'cookiesAccepted';

    // 1. Check Status on Load
    const status = localStorage.getItem(localKey); // 'true', 'false', or null

    if (status === 'true') {
        unlockThirdPartyContent();
        triggerAnalytics();
        showReopenButton();
    } else if (status === 'false') {
        showReopenButton();
    } else {
        // No choice yet -> Show Banner
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }

    // 2. Accept Action
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            grantConsent();
        });
    }

    // 3. Reject Action
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            denyConsent();
        });
    }

    // 4. Settings Re-open (Footer)
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            banner.classList.add('show');
            hideReopenButton();
        });
    }

    // 5. Floating Re-open
    if (reopenBtn) {
        reopenBtn.addEventListener('click', () => {
            banner.classList.add('show');
            hideReopenButton();
        });
    }

    // 6. Content Triggers
    document.querySelectorAll('.accept-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            grantConsent();
        });
    });

    function grantConsent() {
        localStorage.setItem(localKey, 'true');
        banner.classList.remove('show');
        unlockThirdPartyContent();
        triggerAnalytics();
        showReopenButton();
    }

    function denyConsent() {
        localStorage.setItem(localKey, 'false');
        banner.classList.remove('show');
        showReopenButton();
    }

    function showReopenButton() {
        if (reopenBtn) reopenBtn.style.display = 'flex';
    }

    function hideReopenButton() {
        if (reopenBtn) reopenBtn.style.display = 'none';
    }

    function unlockThirdPartyContent() {
        document.querySelectorAll('.consent-wrapper').forEach(wrapper => {
            const iframe = wrapper.querySelector('iframe.lazy-iframe');
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
            }
            const placeholder = wrapper.querySelector('.consent-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        });
    }

    function triggerAnalytics() {
        const GTM_ID = 'GTM-NXGT8CB9'; // Insert GTM ID here (e.g. 'GTM-XXXXXXX') to load GTM instead of direct GA4
        const GA4_ID = 'G-RJX4PM40Y5'; // Fallback direct GA4 Measurement ID

        if (GTM_ID) {
            loadGoogleTagManager(GTM_ID);
        } else if (GA4_ID) {
            loadGoogleAnalytics(GA4_ID);
        }
    }

    function loadGoogleAnalytics(measurementId) {
        if (window.gaLoaded) return;
        window.gaLoaded = true;

        // 1. Inject the Google Tag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // 2. Initialize dataLayer and gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', measurementId, {
            'anonymize_ip': true
        });
    }

    function loadGoogleTagManager(containerId) {
        if (window.gtmLoaded) return;
        window.gtmLoaded = true;

        // 1. Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        // 2. Inject GTM script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
        document.head.appendChild(script);
    }
}

/**
 * Hero Slider Logic (Nav + Pagination)
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const pagination = document.querySelector('.slider-pagination');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let current = 0;

    if (slides.length === 0) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            updateSlide(index);
            resetInterval();
        });
        pagination.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function updateSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = index;
        if (current < 0) current = slides.length - 1;
        if (current >= slides.length) current = 0;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function nextSlide() {
        updateSlide(current + 1);
    }

    function prevSlide() {
        updateSlide(current - 1);
    }

    let interval = setInterval(nextSlide, 5000);

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }

    // Event Listeners for click zones
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    // Swipe gestures & overlay fading logic
    const hero = document.querySelector('.hero');
    let touchStartX = 0;
    let touchEndX = 0;
    let interactionTimeout;

    function triggerInteraction() {
        if (hero) {
            hero.classList.add('interaction-active');
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                hero.classList.remove('interaction-active');
            }, 3000); // Overlay fades back in after 3 seconds of no interaction
        }
    }

    if (hero) {
        // Swiping gestures
        hero.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            triggerInteraction();
        }, { passive: true });

        hero.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                nextSlide();
                resetInterval();
            } else if (touchEndX > touchStartX + threshold) {
                prevSlide();
                resetInterval();
            }
            triggerInteraction();
        }, { passive: true });

        // Hover or click interaction to dim overlay on desktop/touch
        prevBtn && prevBtn.addEventListener('mouseenter', triggerInteraction);
        nextBtn && nextBtn.addEventListener('mouseenter', triggerInteraction);
        pagination && pagination.addEventListener('mouseenter', triggerInteraction);

        prevBtn && prevBtn.addEventListener('click', triggerInteraction);
        nextBtn && nextBtn.addEventListener('click', triggerInteraction);
        pagination && pagination.addEventListener('click', triggerInteraction);
    }
}

/**
 * Gallery Logic (Main + Auto Thumbs)
 */
function initGallery() {
    const mainImg = document.getElementById('gallery-active-img');
    const track = document.getElementById('gallery-thumbs');

    if (!mainImg || !track) return;

    // All available images
    const images = [
        'hero.webp', 'house1.webp', 'house2.webp', 'house3.webp', 'house4.webp',
        'pool2.webp', 'pool3.webp', 'pool4.webp', 'pool5.webp',
        'view1.webp', 'view2.webp', 'garden.webp',
        'livingroom_up1.webp', 'livingroom_up2.webp',
        'livingroom_down1.webp', 'livingroom_down2.webp', 'livingroom_down3.webp',
        'livingroom_down4.webp', 'livingroom_down5.webp', 'livingroom_down6.webp', 'livingroom_down7.webp',
        'terasse_up.webp', 'terasse_down.webp',
        'bedroom.webp', 'bedroom_up_front1.webp', 'bedroom_up_front2.webp',
        'bedroom_up_back1.webp', 'bedroom_up_back2.webp',
        'bedroom_down_front1.webp', 'bedroom_down_front2.webp',
        'bedroom_down_back1.webp',
        'bathroom1.webp', 'bathroom_up_front1.webp', 'bathroom_up_front2.webp',
        'bathroom_up_back1.webp', 'bathroom_up_back2.webp', 'bathroom_down_front1.webp',
        'coffeemachine1.webp', 'coffee.webp', 'sala1.webp', 'sala2.webp'
    ];

    let currentIndex = 0;
    let autoPlayInterval;

    // Initial Render
    mainImg.src = `images/${images[0]}`;

    // Render Thumbs
    images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="images/${img}" loading="lazy" alt="Gallery Thumb ${index}">`;

        thumb.addEventListener('click', () => {
            setGalleryIndex(index);
            resetGalleryTimer();
        });

        track.appendChild(thumb);
    });

    function setGalleryIndex(index) {
        currentIndex = index;

        const nextSrc = `images/${images[currentIndex]}`;
        
        // Start fading out the current image (dim it to 0.3 for a smooth transition)
        mainImg.style.opacity = '0.3';
        
        // Preload next image to ensure no white flashing while the browser downloads/decodes the image
        const tempImg = new Image();
        tempImg.onload = () => {
            // Swap src once the new image is fully loaded in memory, then fade back to 1
            mainImg.src = nextSrc;
            mainImg.style.opacity = '1';
        };
        tempImg.src = nextSrc;

        // Update Thumbs
        document.querySelectorAll('.gallery-thumb').forEach((el, i) => {
            if (i === currentIndex) {
                el.classList.add('active');

                // Safe scroll that doesn't move the main page
                if (track) {
                    const left = el.offsetLeft - (track.clientWidth / 2) + (el.clientWidth / 2);
                    track.scrollTo({ left: left, behavior: 'smooth' });
                }
            } else {
                el.classList.remove('active');
            }
        });
    }

    function nextImage() {
        let next = currentIndex + 1;
        if (next >= images.length) next = 0;
        setGalleryIndex(next);
    }

    function resetGalleryTimer() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextImage, 3000); // Change every 3 seconds
    }

    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let prev = currentIndex - 1;
            if (prev < 0) prev = images.length - 1;
            setGalleryIndex(prev);
            resetGalleryTimer();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextImage();
            resetGalleryTimer();
        });
    }

    // Start Autoplay
    resetGalleryTimer();
}

/**
 * Mobile Menu Logic
 */
function initMobileMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
            burger.setAttribute('aria-expanded', !expanded);
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Anti-spambot email link protection
 * Dynamically constructs the mailto target when the document loads,
 * preventing email scrapers parsing the static HTML from harvesting the address.
 */
function initEmailProtection() {
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        const u = 'hi';
        const d = 'villacarma.com';
        emailLink.setAttribute('href', `mailto:${u}@${d}`);
    }
}

/**
 * Responsive Lightbox logic for content images.
 * Dynamically overlays clicked images and closes via overlay clicks, escape key, or close button.
 */
function initLightbox() {
    // 1. Create Lightbox markup if it doesn't exist
    let overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Schließen">&times;</button>
                <img src="" alt="Vergrößertes Bild">
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const lightboxImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    // 2. Open Lightbox on clickable image click
    const selectors = '.intro-image img, .feature-card img, #gallery-active-img';
    document.addEventListener('click', (e) => {
        if (e.target.matches(selectors)) {
            const src = e.target.getAttribute('src');
            if (src) {
                lightboxImg.src = src;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Disable background scrolling
            }
        }
    });

    // 3. Close Lightbox handler
    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
        setTimeout(() => {
            lightboxImg.src = ''; // Clean image source after transition
        }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close when clicking outside of the image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

