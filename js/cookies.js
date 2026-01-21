/**
 * Cookie Consent Manager - GDPR Compliant
 * Tamayeando - 2026
 */

(function() {
    'use strict';

    const CONSENT_KEY = 'tamayeando_cookie_consent';
    const CONSENT_VERSION = '1.0';

    // Cookie categories
    const CATEGORIES = {
        essential: {
            name: 'Esenciales',
            description: 'Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.',
            required: true
        },
        analytics: {
            name: 'Analíticas',
            description: 'Nos ayudan a entender cómo usas el sitio para mejorarlo.',
            required: false
        },
        marketing: {
            name: 'Marketing',
            description: 'Permiten mostrarte contenido personalizado.',
            required: false
        }
    };

    // Get saved consent
    function getConsent() {
        try {
            const saved = localStorage.getItem(CONSENT_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.version === CONSENT_VERSION) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error reading consent:', e);
        }
        return null;
    }

    // Save consent
    function saveConsent(preferences) {
        const consent = {
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        applyConsent(preferences);
        hideBanner();
        hideModal();
    }

    // Apply consent (enable/disable scripts based on preferences)
    function applyConsent(preferences) {
        // Enable analytics scripts if consented
        if (preferences.analytics) {
            enableAnalytics();
        }
        // Enable marketing scripts if consented
        if (preferences.marketing) {
            enableMarketing();
        }
    }

    // Placeholder functions for future scripts
    function enableAnalytics() {
        // Add analytics scripts here when needed
        // Example: Google Analytics initialization
        console.log('Analytics enabled');
    }

    function enableMarketing() {
        // Add marketing scripts here when needed
        console.log('Marketing enabled');
    }

    // Accept all cookies
    function acceptAll() {
        saveConsent({
            essential: true,
            analytics: true,
            marketing: true
        });
    }

    // Reject non-essential cookies
    function rejectAll() {
        saveConsent({
            essential: true,
            analytics: false,
            marketing: false
        });
    }

    // Save custom preferences
    function savePreferences() {
        const preferences = {
            essential: true, // Always true
            analytics: document.getElementById('cookie-analytics')?.checked || false,
            marketing: document.getElementById('cookie-marketing')?.checked || false
        };
        saveConsent(preferences);
    }

    // Show cookie banner
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    }

    // Hide cookie banner
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('visible');
        }
    }

    // Show preferences modal
    function showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            
            // Set checkboxes based on current consent
            const consent = getConsent();
            if (consent) {
                const analyticsCheckbox = document.getElementById('cookie-analytics');
                const marketingCheckbox = document.getElementById('cookie-marketing');
                if (analyticsCheckbox) analyticsCheckbox.checked = consent.preferences.analytics;
                if (marketingCheckbox) marketingCheckbox.checked = consent.preferences.marketing;
            }
        }
    }

    // Hide preferences modal
    function hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    // Create cookie banner HTML
    function createBannerHTML() {
        return `
            <div id="cookie-banner" class="cookie-banner">
                <div class="cookie-banner-content">
                    <div class="cookie-text">
                        <h3>🍪 Usamos cookies</h3>
                        <p>Utilizamos cookies para mejorar tu experiencia. Puedes aceptar todas, rechazar las no esenciales o personalizar tus preferencias.</p>
                    </div>
                    <div class="cookie-buttons">
                        <button id="cookie-reject" class="btn btn-cookie-secondary">Rechazar</button>
                        <button id="cookie-customize" class="btn btn-cookie-secondary">Configurar</button>
                        <button id="cookie-accept" class="btn btn-cookie-primary">Aceptar todas</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create preferences modal HTML
    function createModalHTML() {
        return `
            <div id="cookie-modal" class="cookie-modal">
                <div class="cookie-modal-overlay"></div>
                <div class="cookie-modal-content">
                    <h3>Preferencias de Cookies</h3>
                    <p>Gestiona tus preferencias de cookies. Las cookies esenciales no se pueden desactivar ya que son necesarias para el funcionamiento del sitio.</p>
                    
                    <div class="cookie-categories">
                        <div class="cookie-category">
                            <div class="category-header">
                                <label>
                                    <input type="checkbox" checked disabled>
                                    <span class="category-name">Esenciales</span>
                                </label>
                                <span class="category-badge">Siempre activas</span>
                            </div>
                            <p class="category-description">Necesarias para el funcionamiento básico del sitio. Incluyen preferencias de sesión y funcionalidad del formulario.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="category-header">
                                <label>
                                    <input type="checkbox" id="cookie-analytics">
                                    <span class="category-name">Analíticas</span>
                                </label>
                            </div>
                            <p class="category-description">Nos ayudan a entender cómo interactúas con el sitio para poder mejorarlo.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="category-header">
                                <label>
                                    <input type="checkbox" id="cookie-marketing">
                                    <span class="category-name">Marketing</span>
                                </label>
                            </div>
                            <p class="category-description">Permiten mostrarte contenido relevante y personalizado.</p>
                        </div>
                    </div>
                    
                    <div class="cookie-modal-buttons">
                        <button id="cookie-modal-reject" class="btn btn-cookie-secondary">Rechazar todas</button>
                        <button id="cookie-modal-save" class="btn btn-cookie-primary">Guardar preferencias</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize cookie consent
    function init() {
        // Inject banner and modal HTML
        const container = document.createElement('div');
        container.innerHTML = createBannerHTML() + createModalHTML();
        document.body.appendChild(container);

        // Check if consent already given
        const consent = getConsent();
        if (!consent) {
            // Show banner after a short delay for better UX
            setTimeout(showBanner, 1000);
        } else {
            // Apply saved consent
            applyConsent(consent.preferences);
        }

        // Event listeners
        document.getElementById('cookie-accept')?.addEventListener('click', acceptAll);
        document.getElementById('cookie-reject')?.addEventListener('click', rejectAll);
        document.getElementById('cookie-customize')?.addEventListener('click', () => {
            hideBanner();
            showModal();
        });

        document.getElementById('cookie-modal-save')?.addEventListener('click', savePreferences);
        document.getElementById('cookie-modal-reject')?.addEventListener('click', rejectAll);
        
        // Close modal on overlay click
        document.querySelector('.cookie-modal-overlay')?.addEventListener('click', hideModal);

        // Manage cookies button (in footer)
        document.querySelectorAll('[data-manage-cookies]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal();
            });
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions globally for external use
    window.CookieConsent = {
        show: showBanner,
        showPreferences: showModal,
        getConsent: getConsent
    };
})();
