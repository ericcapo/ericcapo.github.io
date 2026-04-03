// main.js (fully compatible with your existing news.html structure)
// Data storage
const siteData = {
    currentPage: 'home',
    activePhoto: null,
    pageContent: {},
    newsItems: []
};

// Navigation handler
function navigateTo(page) {
    siteData.currentPage = page;
    render();
    updateActiveNav();
}

function updateActiveNav() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        const pageName = link.getAttribute('data-page');
        if (pageName === siteData.currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Modal functions
function openModal(photo) {
    siteData.activePhoto = photo;
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('active');
    renderModal();
}

function closeModal() {
    siteData.activePhoto = null;
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
}

function renderModal() {
    if (!siteData.activePhoto) return;
    const modalContent = document.getElementById('modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="modal-content">
                <img src="${siteData.activePhoto.imageUrl}" alt="${siteData.activePhoto.title}" class="modal-img">
            </div>
        `;
    }
}

// ----- Improved date parser (handles "October 2024" and "March 15, 2025") -----
function parseDateFlexible(dateStr) {
    if (!dateStr) return null;
    // Try full date like "March 15, 2025" or "Oct 15, 2024"
    let parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
    
    // Try "Month Year" format (e.g., "October 2024")
    const monthYearRegex = /(\w+)\s+(\d{4})/;
    const match = dateStr.match(monthYearRegex);
    if (match) {
        const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
        const monthIndex = monthNames.findIndex(m => m.startsWith(match[1].toLowerCase()));
        if (monthIndex !== -1) {
            return new Date(parseInt(match[2]), monthIndex, 1);
        }
    }
    return null;
}

// ----- Parse news from HTML (works with your .news-card structure) -----
function parseNewsItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newsItems = [];
    
    // Select all .news-card elements (your exact structure)
    const cards = doc.querySelectorAll('.news-card');
    console.log(`Found ${cards.length} news cards in news.html`);
    
    cards.forEach(card => {
        const dateElem = card.querySelector('.news-date');
        const titleElem = card.querySelector('.news-title');
        const summaryElem = card.querySelector('.news-summary');
        const imgElem = card.querySelector('.news-image');
        
        if (dateElem && titleElem) {
            const date = dateElem.textContent.trim();
            const title = titleElem.textContent.trim();
            const summary = summaryElem ? summaryElem.textContent.trim() : 'Read more...';
            const imageUrl = imgElem ? imgElem.src : '';
            
            // Extract link if any (your read-more is a span, but we keep compatibility)
            let link = '';
            const readMoreLink = card.querySelector('a.read-more');
            if (readMoreLink && readMoreLink.href) link = readMoreLink.href;
            
            newsItems.push({
                date: date,
                title: title,
                summary: summary.length > 200 ? summary.substring(0,200)+'...' : summary,
                imageUrl: imageUrl,
                link: link
            });
        }
    });
    
    // Sort by date (most recent first)
    newsItems.sort((a,b) => {
        const dateA = parseDateFlexible(a.date);
        const dateB = parseDateFlexible(b.date);
        if (dateA && dateB) return dateB - dateA;
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
    });
    
    console.log(`Parsed ${newsItems.length} news items`);
    return newsItems;
}

// Load HTML content from external files
async function loadPageContent(page) {
    if (siteData.pageContent[page]) {
        return siteData.pageContent[page];
    }
    try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`Failed to load ${page}.html`);
        const content = await response.text();
        siteData.pageContent[page] = content;
        
        if (page === 'news') {
            siteData.newsItems = parseNewsItems(content);
            // If parsing returns 0 items, use fallback (but your news.html has many)
            if (siteData.newsItems.length === 0) {
                console.warn("No news items found, using fallback");
                siteData.newsItems = getFallbackNews();
            }
        }
        return content;
    } catch (error) {
        console.error(error);
        if (page === 'news') {
            // Fallback HTML that matches your structure
            const fallbackHtml = `<div class="news-grid">
                <div class="news-card"><div class="news-date">March 2025</div><div class="news-title">New research grant</div><div class="news-summary">VR grant awarded</div></div>
                <div class="news-card"><div class="news-date">February 2025</div><div class="news-title">New publication</div><div class="news-summary">ISME Journal paper</div></div>
                <div class="news-card"><div class="news-date">January 2025</div><div class="news-title">New PhD student</div><div class="news-summary">Welcome Maria</div></div>
            </div>`;
            siteData.newsItems = parseNewsItems(fallbackHtml);
            return fallbackHtml;
        }
        return `<h1 class="section-title">${page.charAt(0).toUpperCase() + page.slice(1)}</h1><p>Content coming soon...</p>`;
    }
}

function getFallbackNews() {
    return [
        { date: "March 2025", title: "New research grant", summary: "VR grant awarded", imageUrl: "", link: "#" },
        { date: "February 2025", title: "New publication", summary: "ISME Journal paper", imageUrl: "", link: "#" },
        { date: "January 2025", title: "New PhD student", summary: "Welcome Maria", imageUrl: "", link: "#" }
    ];
}

// Enhance publications: make each item clickable with DOI link
function enhancePublications() {
    const publicationItems = document.querySelectorAll('.publication-item');
    publicationItems.forEach(item => {
        const doiLink = item.querySelector('.publication-doi a');
        if (doiLink && doiLink.href) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                if (e.target === doiLink || doiLink.contains(e.target)) return;
                window.open(doiLink.href, '_blank');
            });
            item.classList.add('clickable-publication');
        }
    });
}

// Render home page with top 3 news items (using parsed newsItems)
function renderHome() {
    const topNews = siteData.newsItems.slice(0, 3);
    
    const newsHtml = topNews.length > 0 ? topNews.map(news => {
        const readMoreLink = news.link && news.link !== '#' ? news.link : 'javascript:void(0);';
        const onClickAttr = (!news.link || news.link === '#') ? 'onclick="navigateTo(\'news\'); return false;"' : '';
        return `
            <div class="news-card">
                ${news.imageUrl ? `<img src="${escapeHtml(news.imageUrl)}" alt="${escapeHtml(news.title)}" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=News'">` : ''}
                <div class="news-content">
                    <div class="news-date">${escapeHtml(news.date)}</div>
                    <div class="news-title">${escapeHtml(news.title)}</div>
                    <div class="news-summary">${escapeHtml(news.summary)}</div>
                    <a href="${escapeHtml(readMoreLink)}" class="read-more" target="_blank" ${onClickAttr}>Read more →</a>
                </div>
            </div>
        `;
    }).join('') : `
        <div class="news-card">
            <div class="news-content">
                <div class="news-date">Loading news...</div>
                <div class="news-title">Please check back soon</div>
                <div class="news-summary">News items will appear here once available.</div>
            </div>
        </div>
    `;
    
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p>We explore the life of microorganisms in marine and freshwater systems</p>
        </div>
        
        <div class="lab-intro">
            <div class="lab-intro-text">
                <p>We study the spatio-temporal dynamics of aquatic microbial communities and their functional responses to environmental change, such as climate change, eutrophication, deoxygenation or mercury pollution. We apply molecular ecology methods, such as metabarcoding, (ancient) metagenomics, MAGs-based analysis and metatranscriptomics. By combining genetic information from past (sediment archives) and modern (water) environments, we strive to shed light on the intricate relationships between microbial communities and their environment.</p>
            </div>
            <div class="lab-intro-image">
                <img src="images/team2025.png" alt="Capo Lab Team 2025" onerror="this.src='https://via.placeholder.com/400x200?text=Lab+Photo'">
            </div>
        </div>
        
        <div class="news-section">
            <h2 class="section-title">Latest News</h2>
            <div class="news-grid">
                ${newsHtml}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('news')">View All News →</button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main render function
async function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    const navigation = `
        <nav>
            <div class="nav-container">
                <a href="#" onclick="navigateTo('home'); return false;" class="logo">Capo Lab</a>
                <ul class="nav-links">
                    <li><a href="#" data-page="home" onclick="navigateTo('home'); return false;">Home</a></li>
                    <li><a href="#" data-page="research" onclick="navigateTo('research'); return false;">Research</a></li>
                    <li><a href="#" data-page="team" onclick="navigateTo('team'); return false;">Team</a></li>
                    <li><a href="#" data-page="news" onclick="navigateTo('news'); return false;">News</a></li>
                    <li><a href="#" data-page="publications" onclick="navigateTo('publications'); return false;">Publications</a></li>
                </ul>
            </div>
        </nav>
        <div class="container" id="page-container"></div>
        <footer>
            <p>Contact: <a href="mailto:eric.capo@umu.se">eric.capo@umu.se</a></p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Department of Ecology, Environment and Geoscience, Umeå University, Sweden</p>
        </footer>
        <div id="modal" class="modal"><div id="modal-content"></div></div>
    `;
    
    app.innerHTML = navigation;
    
    // Ensure news items are loaded before rendering home
    if (!siteData.newsItems.length) {
        await loadPageContent('news');
    }
    
    const pageContainer = document.getElementById('page-container');
    let content = '';
    if (siteData.currentPage === 'home') {
        content = renderHome();
    } else {
        content = await loadPageContent(siteData.currentPage);
    }
    pageContainer.innerHTML = content;
    
    if (siteData.currentPage === 'publications') {
        enhancePublications();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    render();
    document.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});
