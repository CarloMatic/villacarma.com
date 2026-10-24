/**
 * Villa Carma - FAQ & Guest Guide Interactive Logic
 * Handles i18n, live search, category filtering, accordion toggling, and mobile navigation.
 */

import faqTranslations from './faq-translations.js';

document.addEventListener('DOMContentLoaded', () => {
    initFaqLanguage();
    initFaqSearch();
    initCategoryFilters();
    initAccordionControls();
    initMobileMenu();
    initScrollHeader();
});

/* --- Language Logic --- */
window.switchFaqLang = function (lang) {
    localStorage.setItem('vilacarma_lang', lang);
    applyFaqLanguage(lang);
};

function initFaqLanguage() {
    const savedLang = localStorage.getItem('vilacarma_lang') || 'en';
    applyFaqLanguage(savedLang);
}

function applyFaqLanguage(lang) {
    document.documentElement.lang = lang;
    const t = faqTranslations[lang] || faqTranslations['en'];
    if (!t) return;

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            // Check if element has linebreaks or html
            if (t[key].includes('\n')) {
                el.innerHTML = t[key].replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
            } else {
                el.textContent = t[key];
            }
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Translate title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key] !== undefined) {
            el.setAttribute('title', t[key]);
        }
    });

    // Update Dropdown Label
    const flags = { 'de': '🇩🇪 DE', 'en': '🇺🇸 EN', 'fr': '🇫🇷 FR', 'es': '🇪🇸 ES' };
    const btn = document.getElementById('current-lang-btn');
    if (btn && flags[lang]) {
        btn.textContent = flags[lang];
    }

    // Refresh search results if search is active
    const searchInput = document.getElementById('faq-search-input');
    if (searchInput && searchInput.value.trim() !== '') {
        performSearch(searchInput.value.trim());
    }
}

/* --- Live Search Logic --- */
function initFaqSearch() {
    const input = document.getElementById('faq-search-input');
    const clearBtn = document.getElementById('faq-search-clear');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim();
        if (clearBtn) {
            clearBtn.style.display = query ? 'flex' : 'none';
        }
        performSearch(query);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            performSearch('');
            input.focus();
        });
    }
}

function performSearch(query) {
    const normalizedQuery = query.toLowerCase();
    const items = document.querySelectorAll('.faq-item, .critical-card');
    const noResultsMsg = document.getElementById('faq-no-results');
    let visibleCount = 0;

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!normalizedQuery || text.includes(normalizedQuery)) {
            item.style.display = '';
            visibleCount++;
            if (normalizedQuery && item.tagName.toLowerCase() === 'details') {
                item.setAttribute('open', '');
            }
        } else {
            item.style.display = 'none';
        }
    });

    // Manage section titles visibility
    document.querySelectorAll('.az-letter-group').forEach(group => {
        const hasVisibleChildren = Array.from(group.querySelectorAll('.faq-item')).some(el => el.style.display !== 'none');
        group.style.display = hasVisibleChildren ? '' : 'none';
    });

    if (noResultsMsg) {
        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

/* --- Category Filters --- */
function initCategoryFilters() {
    const pills = document.querySelectorAll('.filter-pill');
    if (!pills.length) return;

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');
            applyCategoryFilter(filter);
        });
    });
}

function applyCategoryFilter(filter) {
    const items = document.querySelectorAll('.faq-item, .critical-card');
    const letterGroups = document.querySelectorAll('.az-letter-group');
    const criticalSection = document.getElementById('critical-rules');
    const azSection = document.getElementById('az-directory');
    const noResultsMsg = document.getElementById('faq-no-results');

    if (noResultsMsg) noResultsMsg.style.display = 'none';

    if (filter === 'all') {
        items.forEach(el => el.style.display = '');
        letterGroups.forEach(el => el.style.display = '');
        if (criticalSection) criticalSection.style.display = '';
        if (azSection) azSection.style.display = '';
        return;
    }

    if (filter === 'critical') {
        if (criticalSection) criticalSection.style.display = '';
        if (azSection) azSection.style.display = 'none';
        return;
    }

    // Filter by specific category
    if (criticalSection) criticalSection.style.display = 'none';
    if (azSection) azSection.style.display = '';

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const matches = itemCategory.split(' ').includes(filter);
        item.style.display = matches ? '' : 'none';
    });

    letterGroups.forEach(group => {
        const hasVisible = Array.from(group.querySelectorAll('.faq-item')).some(el => el.style.display !== 'none');
        group.style.display = hasVisible ? '' : 'none';
    });
}

/* --- Accordion Expand / Collapse --- */
function initAccordionControls() {
    const expandBtn = document.getElementById('faq-expand-all');
    const collapseBtn = document.getElementById('faq-collapse-all');
    const details = document.querySelectorAll('.faq-item');

    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            details.forEach(el => el.setAttribute('open', ''));
        });
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            details.forEach(el => el.removeAttribute('open'));
        });
    }
}

/* --- Header & Mobile Menu --- */
function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

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

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}
