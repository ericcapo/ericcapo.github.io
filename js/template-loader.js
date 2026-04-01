// template-loader.js
// Centralized template system for consistent UI across all pages

(function() {
    'use strict';

    // Configuration for the template
    const templateConfig = {
        // Top bar configuration
        topBar: {
            enabled: true,
            logoText: '🌊 Capo Lab',
            tagline: 'sedDNA · Paleogenomics · Microbial Ecology',
            navLinks: [
                { text: 'Home', href: 'index.html', icon: '🏠' },
                { text: 'Research', href: 'research.html', icon: '🔬' },
                { text: 'Team', href: 'people.html', icon: '👥' },
                { text: 'Publications', href: 'papers.html', icon: '📄' },
                { text: 'Gallery', href: 'gallery.html', icon: '📸' }
            ]
        },
        
        // Sidebar menu configuration
        sidebar: {
            enabled: true,
            menuItems: [
                { text: 'Capo lab', href: 'index.html', icon: '🏠' },
                { text: 'Research', href: 'research.html', icon: '🔬' },
                { text: 'Team', href: 'people.html', icon: '👥' },
                { text: 'Publications', href: 'papers.html', icon: '📄' },
                { text: 'Gallery', href: 'gallery.html', icon: '📸' }
            ]
        },
        
        // Bottom bar configuration
        bottomBar: {
            enabled: true,
            copyright: '© 2025 Capo Lab · Department of Ecology and Environmental Science · Umeå University',
            footerLinks: [
                { text: 'Home', href: 'index.html' },
                { text: 'Research', href: 'research.html' },
                { text: 'Team', href: 'people.html' },
                { text: 'Publications', href: 'papers.html' },
                { text: 'Gallery', href: 'gallery.html' },
                { text: 'Contact', href: 'contact.html' }
            ],
            credits: '📸 Fieldwork & moments | Background: back.jpg'
        },
        
        // Global styles
        styles: {
            backgroundColor: '#0a0f1c',
            accentColor: '#5f7fcf',
            textColor: '#f0f3fc',
            sidebarWidth: '260px'
        }
    };

    // Create and inject global styles
    function injectGlobalStyles() {
        const styleElement = document.createElement('style');
        styleElement.id = 'global-template-styles';
        styleElement.textContent = `
            /* ========== GLOBAL TEMPLATE STYLES ========== */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background-image: url('back.jpg');
                background-size: cover;
                background-position: center center;
                background-attachment: fixed;
                background-repeat: no-repeat;
                background-color: #1a1e2a;
                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                line-height: 1.5;
                position: relative;
            }

            /* Dark overlay for readability */
            body::before {
                content: "";
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.45);
                z-index: 0;
                pointer-events: none;
            }

            /* Ensure content appears above overlay */
            #sidebar, #main-content, .top-bar, .bottom-bar {
                position: relative;
                z-index: 2;
            }

            /* ========== TOP BAR STYLES ========== */
            .top-bar {
                background-color: #0a0f1c;
                color: #f0f3fa;
                padding: 1rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid #2c3548;
                position: sticky;
                top: 0;
                z-index: 100;
                backdrop-filter: blur(2px);
            }

            .logo-area h1 {
                font-size: 1.7rem;
                font-weight: 600;
                letter-spacing: -0.3px;
                background: linear-gradient(135deg, #e0e7ff, #9bb4ff);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }

            .logo-area p {
                font-size: 0.8rem;
                color: #b9c7e6;
                margin-top: 4px;
            }

            .top-nav-links {
                display: flex;
                gap: 1.8rem;
                flex-wrap: wrap;
            }

            .top-nav-links a {
                color: #e2e8ff;
                text-decoration: none;
                font-weight: 500;
                transition: 0.2s;
                font-size: 1rem;
                padding: 0.4rem 0;
                border-bottom: 2px solid transparent;
            }

            .top-nav-links a:hover {
                color: white;
                border-bottom-color: #5f7fcf;
            }

            /* ========== SIDEBAR STYLES ========== */
            #sidebar {
                position: fixed;
                left: 0;
                top: 0;
                width: 260px;
                height: 100%;
                background-color: rgba(12, 17, 32, 0.93);
                backdrop-filter: blur(12px);
                border-right: 1px solid #2e3a55;
                box-shadow: 3px 0 12px rgba(0, 0, 0, 0.3);
                z-index: 50;
                padding-top: 2rem;
                transition: transform 0.3s ease;
            }

            #sidebar ul {
                list-style: none;
                padding: 0;
                margin-top: 4rem;
            }

            #sidebar ul li {
                margin: 1.2rem 0;
                text-align: center;
            }

            #sidebar ul li a {
                display: block;
                color: #eef4ff;
                text-decoration: none;
                font-size: 1.2rem;
                font-weight: 500;
                padding: 0.6rem 1rem;
                transition: all 0.2s ease;
                border-radius: 40px;
                margin: 0 1rem;
            }

            #sidebar ul li a:hover {
                background-color: #2a3b6e;
                color: white;
                transform: translateX(6px);
            }

            /* Mobile sidebar toggle button */
            .sidebar-toggle {
                display: none;
                position: fixed;
                left: 20px;
                top: 20px;
                z-index: 101;
                background: #0a0f1c;
                color: white;
                border: 1px solid #2c3548;
                border-radius: 8px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 1.2rem;
            }

            /* ========== MAIN CONTENT ========== */
            #main-content {
                margin-left: 260px;
                padding: 2rem 2.5rem;
                background-color: rgba(20, 25, 38, 0.82);
                backdrop-filter: blur(3px);
                border-radius: 28px 28px 0 0;
                min-height: calc(100vh - 70px - 90px);
                transition: margin-left 0.3s ease;
            }

            /* Content styling */
            .section-title {
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #f0f3fc;
                border-left: 5px solid #5f7fcf;
                padding-left: 1rem;
            }

            .underline {
                border-bottom: 2px solid #4a6bb5;
                display: inline-block;
                padding-bottom: 0.3rem;
            }

            /* ========== BOTTOM BAR STYLES ========== */
            .bottom-bar {
                background-color: #0a0f1c;
                color: #cbd5ff;
                padding: 1.2rem 2rem;
                margin-top: 3rem;
                text-align: center;
                font-size: 0.85rem;
                border-top: 1px solid #2c3548;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }

            .bottom-bar .copyright {
                opacity: 0.85;
            }

            .bottom-bar .footer-links a {
                color: #b9c7ff;
                text-decoration: none;
                margin: 0 0.8rem;
                transition: 0.2s;
            }

            .bottom-bar .footer-links a:hover {
                color: white;
                text-decoration: underline;
            }

            /* ========== RESPONSIVE DESIGN ========== */
            @media (max-width: 768px) {
                .sidebar-toggle {
                    display: block;
                }

                #sidebar {
                    transform: translateX(-100%);
                }

                #sidebar.open {
                    transform: translateX(0);
                }

                #main-content {
                    margin-left: 0;
                    padding: 1.5rem;
                }

                .top-bar {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }

                .top-nav-links {
                    justify-content: center;
                }

                .bottom-bar {
                    flex-direction: column;
                    text-align: center;
                }
            }

            /* Utility classes */
            .active-page {
                background-color: #2a3b6e !important;
                color: white !important;
            }

            /* Gallery specific styles (if needed) */
            .gallery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .photo-card {
                background-color: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .photo-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }

            .photo-image {
                width: 100%;
                height: auto;
                display: block;
            }

            .photo-info {
                padding: 15px;
            }

            .photo-title {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 5px;
                color: #0077be;
            }

            .photo-date {
                font-style: italic;
                color: #666;
                margin-bottom: 10px;
                font-size: 0.9em;
            }

            .photo-description {
                font-size: 0.95em;
                line-height: 1.5;
                color: #333;
            }
        `;
        
        document.head.appendChild(styleElement);
    }

    // Create and inject top bar
    function injectTopBar() {
        if (!templateConfig.topBar.enabled) return;
        
        const topBar = document.createElement('div');
        topBar.className = 'top-bar';
        topBar.innerHTML = `
            <div class="logo-area">
                <h1>${templateConfig.topBar.logoText}</h1>
                <p>${templateConfig.topBar.tagline}</p>
            </div>
            <div class="top-nav-links">
                ${templateConfig.topBar.navLinks.map(link => 
                    `<a href="${link.href}" data-page="${link.text.toLowerCase()}">${link.icon || ''} ${link.text}</a>`
                ).join('')}
            </div>
        `;
        
        document.body.insertBefore(topBar, document.body.firstChild);
        
        // Highlight current page in top bar
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const topLinks = topBar.querySelectorAll('.top-nav-links a');
        topLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.style.borderBottomColor = '#5f7fcf';
                link.style.color = 'white';
            }
        });
    }

    // Create and inject sidebar
    function injectSidebar() {
        if (!templateConfig.sidebar.enabled) return;
        
        // Check if sidebar already exists
        if (document.getElementById('sidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.id = 'sidebar';
        sidebar.innerHTML = `
            <ul>
                ${templateConfig.sidebar.menuItems.map(item => 
                    `<li><a href="${item.href}" data-sidebar-page="${item.text.toLowerCase()}">${item.icon || ''} ${item.text}</a></li>`
                ).join('')}
            </ul>
        `;
        
        document.body.appendChild(sidebar);
        
        // Highlight current page in sidebar
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active-page');
            }
        });
        
        // Add mobile toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰ Menu';
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('open');
        };
        document.body.appendChild(toggleBtn);
        
        // Close sidebar when clicking on a link (mobile)
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // Create and inject bottom bar
    function injectBottomBar() {
        if (!templateConfig.bottomBar.enabled) return;
        
        const bottomBar = document.createElement('div');
        bottomBar.className = 'bottom-bar';
        bottomBar.innerHTML = `
            <div class="copyright">
                ${templateConfig.bottomBar.copyright}
            </div>
            <div class="footer-links">
                ${templateConfig.bottomBar.footerLinks.map(link => 
                    `<a href="${link.href}">${link.text}</a>`
                ).join('')}
            </div>
            <div class="footer-credits">
                ${templateConfig.bottomBar.credits}
            </div>
        `;
        
        document.body.appendChild(bottomBar);
    }

    // Wrap existing content in main-content div
    function wrapContent() {
        // Find the main content area - either existing #content or body children
        let contentElement = document.getElementById('content');
        
        if (!contentElement) {
            // If no content div exists, wrap all body children except template elements
            const templateElements = ['.top-bar', '#sidebar', '.bottom-bar', '.sidebar-toggle'];
            const wrapper = document.createElement('div');
            wrapper.id = 'main-content';
            
            const children = Array.from(document.body.children);
            children.forEach(child => {
                const isTemplateElement = templateElements.some(selector => 
                    child.matches && child.matches(selector)
                );
                if (!isTemplateElement && child !== wrapper) {
                    wrapper.appendChild(child.cloneNode(true));
                    if (child.parentNode) {
                        child.parentNode.removeChild(child);
                    }
                }
            });
            
            document.body.appendChild(wrapper);
        } else {
            // Rename existing content to main-content for consistency
            contentElement.id = 'main-content';
        }
    }

    // Initialize the template system
    function initTemplate() {
        injectGlobalStyles();
        injectTopBar();
        injectSidebar();
        wrapContent();
        injectBottomBar();
        
        // Add active class to current page in navigation
        const currentPath = window.location.pathname;
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
                link.classList.add('active-page');
            }
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTemplate);
    } else {
        initTemplate();
    }
})();
