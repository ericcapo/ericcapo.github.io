// main.js
// Data storage
const siteData = {
    currentPage: 'home',
    activePhoto: null,
    pageContent: {}, // Cache for loaded HTML content
    newsItems: [] // Store parsed news items
};

// Navigation handler
function navigateTo(page) {
    siteData.currentPage = page;
    render();
    updateActiveNav();
}

// Update active navigation link
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

// Parse news HTML to extract items - IMPROVED VERSION
function parseNewsItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newsItems = [];
    
    // Try multiple selectors to find news items
    // Look for news cards - typical patterns from the news page structure
    let items = [];
    
    // Try to find news items by common classes
    items = doc.querySelectorAll('.news-card, .news-item, .news-cards, .post-card, article');
    
    // If no items found with specific classes, look for structured content blocks
    if (items.length === 0) {
        // Try to find containers that might hold news entries
        const possibleContainers = doc.querySelectorAll('.news-grid > div, .news-list > div, .posts-list > div');
        if (possibleContainers.length > 0) {
            items = possibleContainers;
        } else {
            // Last resort: look for any divs containing date and title patterns
            const allDivs = doc.querySelectorAll('div');
            items = Array.from(allDivs).filter(div => {
                const hasDate = div.querySelector('.date, .news-date, .post-date');
                const hasTitle = div.querySelector('h3, .title, .news-title, .post-title');
                return hasDate && hasTitle;
            });
        }
    }
    
    items.forEach(item => {
        // Try to find date element
        let dateElem = item.querySelector('.news-date, .date, .post-date, .entry-date');
        let titleElem = item.querySelector('.news-title, .title, h3, .post-title, .entry-title');
        let summaryElem = item.querySelector('.news-summary, .summary, .excerpt, .post-excerpt, p');
        
        // If still not found, try to extract from raw HTML structure
        if (!dateElem) {
            // Look for any element that might contain a date (e.g., with text like "Jan 15, 2024")
            const allElements = item.querySelectorAll('*');
            for (const el of allElements) {
                const text = el.textContent.trim();
                // Simple date pattern matching
                if (text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/)) {
                    dateElem = el;
                    break;
                }
            }
        }
        
        if (!titleElem) {
            // Look for heading elements
            titleElem = item.querySelector('h1, h2, h3, h4, h5, h6');
        }
        
        if (dateElem && titleElem) {
            const date = dateElem.textContent.trim();
            const title = titleElem.textContent.trim();
            let summary = '';
            
            if (summaryElem) {
                summary = summaryElem.textContent.trim();
            } else {
                // Extract first paragraph or some text as summary
                const firstParagraph = item.querySelector('p');
                if (firstParagraph) {
                    summary = firstParagraph.textContent.trim().substring(0, 200);
                } else {
                    summary = 'Read more about this news...';
                }
            }
            
            newsItems.push({
                date: date,
                title: title,
                summary: summary.length > 200 ? summary.substring(0, 200) + '...' : summary
            });
        }
    });
    
    // Sort news items by date (most recent first)
    newsItems.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        if (dateA && dateB) {
            return dateB - dateA;
        }
        return 0;
    });
    
    console.log(`Parsed ${newsItems.length} news items from ${items.length} potential containers`);
    if (newsItems.length > 0) {
        console.log('Latest news items:', newsItems.slice(0, 3));
    }
    
    return newsItems;
}

// Helper function to parse various date formats
function parseDate(dateString) {
    // Try to parse common date formats
    const formats = [
        /(\w+)\s+(\d{1,2}),?\s+(\d{4})/, // "Jan 15, 2024" or "Jan 15 2024"
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // "15/1/2024" or "1/15/2024"
        /(\d{4})-(\d{1,2})-(\d{1,2})/    // "2024-01-15"
    ];
    
    const months = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    for (const format of formats) {
        const match = dateString.match(format);
        if (match) {
            if (format === formats[0]) {
                // Named month format
                const month = months[match[1].toLowerCase().substring(0, 3)];
                if (month !== undefined) {
                    return new Date(parseInt(match[3]), month, parseInt(match[2]));
                }
            } else if (format === formats[1]) {
                // Numeric month/day/year
                return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
            } else if (format === formats[2]) {
                // Year-month-day
                return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
            }
        }
    }
    
    // Try direct Date parsing as fallback
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }
    
    return null;
}

// Load HTML content from external files
async function loadPageContent(page) {
    // Check if content is already cached
    if (siteData.pageContent[page]) {
        return siteData.pageContent[page];
    }
    
    try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`Failed to load ${page}.html`);
        const content = await response.text();
        siteData.pageContent[page] = content;
        
        // If loading news page, parse and store news items
        if (page === 'news') {
            siteData.newsItems = parseNewsItems(content);
        }
        
        return content;
    } catch (error) {
        console.error(error);
        // Provide fallback content for missing pages
        if (page === 'news') {
            return `
                <div class="page-header">
                    <h1 class="section-title">News</h1>
                </div>
                <div class="news-list">
                    <div class="news-item">
                        <div class="news-date">November 15, 2024</div>
                        <div class="news-title">Welcome to Capo Lab</div>
                        <div class="news-summary">We are excited to announce the launch of our new website. Stay tuned for updates on our research and team activities.</div>
                    </div>
                    <div class="news-item">
                        <div class="news-date">October 1, 2024</div>
                        <div class="news-title">New Research Grant Awarded</div>
                        <div class="news-summary">Capo Lab has received a new research grant to study microbial communities in freshwater systems.</div>
                    </div>
                    <div class="news-item">
                        <div class="news-date">September 15, 2024</div>
                        <div class="news-title">Lab Joins Umeå University</div>
                        <div class="news-summary">We are happy to announce that Capo Lab has joined the Department of Ecology, Environment and Geoscience at Umeå University.</div>
                    </div>
                </div>
            `;
        }
        return `<h1 class="section-title">${page.charAt(0).toUpperCase() + page.slice(1)}</h1><p>Content coming soon...</p>`;
    }
}

// Render home page with top 3 news items
function renderHome() {
    // Get top 3 news items (most recent 3)
    const topNews = siteData.newsItems.slice(0, 3);
    
    // If no news items found yet, show placeholder
    const newsHtml = topNews.length > 0 ? topNews.map(news => `
        <div class="news-card" onclick="navigateTo('news')">
            <div class="news-content">
                <div class="news-date">${escapeHtml(news.date)}</div>
                <div class="news-title">${escapeHtml(news.title)}</div>
                <div class="news-summary">${escapeHtml(news.summary)}</div>
                <span class="read-more">Read more →</span>
            </div>
        </div>
    `).join('') : `
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

// Helper function to escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main render function
async function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Navigation
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
        
        <div class="container" id="page-container">
            <!-- Dynamic content will be loaded here -->
        </div>
        
        <footer>
            <p>Contact: <a href="mailto:eric.capo@umu.se">eric.capo@umu.se</a></p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Department of Ecology, Environment and Geoscience, Umeå University, Sweden</p>
        </footer>
        
        <div id="modal" class="modal">
            <div id="modal-content"></div>
        </div>
    `;
    
    app.innerHTML = navigation;
    
    // Pre-load news content to get news items for home page
    if (!siteData.newsItems.length) {
        await loadPageContent('news');
    }
    
    // Load content for current page
    const pageContainer = document.getElementById('page-container');
    let content = '';
    
    if (siteData.currentPage === 'home') {
        content = renderHome();
    } else {
        // Load from external HTML files for research, team, news, publications
        content = await loadPageContent(siteData.currentPage);
    }
    
    pageContainer.innerHTML = content;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    render();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
