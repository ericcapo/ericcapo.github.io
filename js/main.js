// main.js – SPA with translation toggles + Micromates (loads card data from CSV)
const siteData = {
    currentPage: 'home',
    activePhoto: null,
    pageContent: {},
    newsItems: []
};

// Navigation
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

// Modal functions (for team photos)
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

// News parsing
function parseDateFlexible(dateStr) {
    if (!dateStr) return null;
    let parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
    const monthYearRegex = /(\w+)\s+(\d{4})/;
    const match = dateStr.match(monthYearRegex);
    if (match) {
        const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
        const monthIndex = monthNames.findIndex(m => m.startsWith(match[1].toLowerCase()));
        if (monthIndex !== -1) return new Date(parseInt(match[2]), monthIndex, 1);
    }
    return null;
}

function parseNewsItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newsItems = [];
    const cards = doc.querySelectorAll('.news-card');
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
            let link = '';
            const readMoreLink = card.querySelector('a.read-more');
            if (readMoreLink && readMoreLink.href) link = readMoreLink.href;
            newsItems.push({ date, title, summary: summary.length > 200 ? summary.substring(0,200)+'...' : summary, imageUrl, link });
        }
    });
    newsItems.sort((a,b) => {
        const dateA = parseDateFlexible(a.date);
        const dateB = parseDateFlexible(b.date);
        if (dateA && dateB) return dateB - dateA;
        if (dateA) return -1;
        if (dateB) return 1;
        return 0;
    });
    return newsItems;
}

async function loadPageContent(page) {
    if (siteData.pageContent[page]) return siteData.pageContent[page];
    try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`Failed to load ${page}.html`);
        const content = await response.text();
        siteData.pageContent[page] = content;
        if (page === 'news') siteData.newsItems = parseNewsItems(content);
        return content;
    } catch (error) {
        console.error(error);
        if (page === 'news') return `<div class="news-grid"><div class="news-card"><div class="news-date">Latest</div><div class="news-title">News coming soon</div></div></div>`;
        return `<h1 class="section-title">${page.charAt(0).toUpperCase() + page.slice(1)}</h1><p>Content coming soon...</p>`;
    }
}

function enhancePublications() {
    document.querySelectorAll('.publication-item').forEach(item => {
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

// ----- HOME PAGE TRANSLATION -----
const chineseIntroTranslation = `我们研究水生微生物群落的时空动态及其对环境变化（如气候变化、富营养化、脱氧或汞污染）的功能响应。我们应用分子生态学方法，如元条形码、（古）宏基因组学、基于MAGs的分析和宏转录组学。通过对水柱和下方沉积物档案中的遗传信息进行测序，我们研究水生微生物生命的长期变化，以更好地理解它们当前和未来的发展轨迹。`;
let originalEnglishHTML = '';
let isChineseActive = false;

function initHomePageTranslation() {
    const toggleButton = document.querySelector('.cn-intro-btn');
    if (!toggleButton) return;
    const textParagraph = document.querySelector('.lab-intro-text p');
    if (!textParagraph) return;
    if (!originalEnglishHTML) originalEnglishHTML = textParagraph.innerHTML;
    const newButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newButton, toggleButton);
    newButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isChineseActive) {
            textParagraph.innerHTML = chineseIntroTranslation;
            newButton.textContent = 'ENG';
            isChineseActive = true;
        } else {
            textParagraph.innerHTML = originalEnglishHTML;
            newButton.textContent = '中文';
            isChineseActive = false;
        }
    });
    newButton.textContent = '中文';
    isChineseActive = false;
}

// ----- RESEARCH PAGE TRANSLATIONS -----
const researchChineseTexts = {
    1: `<p>我们研究湖泊表层水和底层沉积物中活跃微生物层的微生物多样性。我们开发了一种无人机采样方法，为大量湖泊采集样本，并首次提供了瑞典湖泊微生物多样性的目录。</p>
        <p><strong>方法：</strong> 无人机水质采样、沉积物岩芯采集、元条形码、宏基因组学</p>`,
    2: `<p>由于气候变暖和营养盐污染，水体氧最小区正在扩大。我们研究微生物群落（细菌、古菌、原生生物）如何响应持续的脱氧过程。我们解析功能转变、代谢适应以及对生物地球化学循环（氮、硫、碳）的级联效应，以及神经毒素甲基汞的形成。</p>
        <p><strong>方法：</strong> 水样采集、沉积物岩芯采集、元条形码、宏基因组学、基于基因组的宏转录组学</p>`,
    3: `<p>我们利用沉积物古DNA（sedDNA）重建淡水与海洋微生物群落数百年至千年尺度的历史变化。通过分析沉积物中保存的遗传记录，揭示微生物组合如何响应气候变迁、富营养化、脱氧及其他环境压力。</p>
        <p><strong>方法：</strong> 沉积物岩芯采集、古宏基因组学、系统发育基因组学</p>`
};

function initResearchPageTranslations() {
    const boxes = document.querySelectorAll('.box-text');
    if (boxes.length === 0) return;
    boxes.forEach((box, idx) => {
        let cardId = box.getAttribute('data-original-html');
        if (!cardId) cardId = (idx + 1).toString();
        const contentDiv = box.querySelector('.box-text-content');
        if (!contentDiv) return;
        if (!contentDiv.hasAttribute('data-original-content')) {
            contentDiv.setAttribute('data-original-content', contentDiv.innerHTML);
        }
        if (box.querySelector('.research-toggle-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'research-toggle-btn';
        btn.textContent = '中文';
        let isChinese = false;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isChinese) {
                contentDiv.innerHTML = researchChineseTexts[cardId];
                btn.textContent = 'ENG';
                isChinese = true;
            } else {
                contentDiv.innerHTML = contentDiv.getAttribute('data-original-content');
                btn.textContent = '中文';
                isChinese = false;
            }
        });
        box.appendChild(btn);
    });
}

// ======================== MICROMATES MODULE (CSV data) ========================
let micromatesInitialized = false;
let currentCarouselOffset = 0;
let TOTAL_CARDS = 0;
const CARDS_VISIBLE = 5;
const MOVE_STEP = 2;
let selectedCardIndex = 0;
let cardsData = [];

function getCardImagePath(cardNumber) {
    const padded = String(cardNumber).padStart(2, '0');
    return `images/mates/mates${padded}.jpg`;
}

function buildMicromatesHTML() {
    return `
        <div class="micromates-wrapper">
            <h1 class="section-title">MicroMates – Oceanic Realms Card Game</h1>
            <div class="game-header">
                <div class="game-text-box">
                    <p><strong>How to play:</strong> Collect all 5 cards of a realm. Ask another player: “Do you have <em>Baltic Cyanobacteria</em> from the <strong>Baltic Sea realm</strong>?” If yes, take it and go again; if not, draw from the pile. First to collect <strong>3 complete realms</strong> wins!</p>
                    <p><strong>Rules (2–6 players):</strong> Shuffle all 55 cards. Deal 7 cards each. Youngest starts. On your turn, ask any player for a card from a realm you already own. If they have it, take it and continue; if not, draw 1 card from the pile. When you complete a realm (all 5 cards), show it and place it face up. First to collect 3 realms wins!</p>
                </div>
                <div class="game-right-img">
                    <img src="images/mates/micromates.png" alt="MicroMates logo" onerror="this.src='https://placehold.co/500x300?text=MicroMates'">
                </div>
            </div>
            <div class="carousel-container" id="micromatesCarousel">
                <div class="carousel-wrapper">
                    <button class="carousel-btn" id="carouselPrev">‹</button>
                    <div class="cards-scroll">
                        <div class="cards-track" id="cardsTrack"></div>
                    </div>
                    <button class="carousel-btn" id="carouselNext">›</button>
                </div>
            </div>
            <div id="detailPanel" class="detail-panel">
                <div class="empty-detail">✨ Click on any card above to see its details ✨</div>
            </div>
        </div>
    `;
}

function renderCarouselTrack() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    let html = '';
    for (let i = 0; i < TOTAL_CARDS; i++) {
        const cardNum = i + 1;
        const imgPath = getCardImagePath(cardNum);
        const isSelected = (selectedCardIndex === i);
        html += `
            <div class="card-item ${isSelected ? 'selected' : ''}" data-card-index="${i}">
                <img src="${imgPath}" class="card-img" onerror="this.src='https://placehold.co/160x240?text=Card+${cardNum}'">
            </div>
        `;
    }
    track.innerHTML = html;
    document.querySelectorAll('.card-item').forEach(card => {
        const idx = parseInt(card.dataset.cardIndex);
        card.addEventListener('click', () => {
            selectedCardIndex = idx;
            renderCarouselTrack();
            updateCarouselPosition();
            updateDetailPanel(selectedCardIndex);
        });
    });
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    const cardWidth = 160 + 12; // width + gap
    const maxStartIndex = Math.max(0, TOTAL_CARDS - CARDS_VISIBLE);
    let newOffset = currentCarouselOffset;
    if (newOffset > maxStartIndex) newOffset = maxStartIndex;
    if (newOffset < 0) newOffset = 0;
    currentCarouselOffset = newOffset;
    const translateX = - (currentCarouselOffset * cardWidth);
    track.style.transform = `translateX(${translateX}px)`;
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) prevBtn.disabled = (currentCarouselOffset === 0);
    if (nextBtn) nextBtn.disabled = (currentCarouselOffset >= maxStartIndex);
}

function moveCarousel(direction) {
    const maxStart = Math.max(0, TOTAL_CARDS - CARDS_VISIBLE);
    if (direction === 'prev') {
        currentCarouselOffset = Math.max(0, currentCarouselOffset - MOVE_STEP);
    } else if (direction === 'next') {
        currentCarouselOffset = Math.min(maxStart, currentCarouselOffset + MOVE_STEP);
    }
    updateCarouselPosition();
}

function updateDetailPanel(cardIdx) {
    const panel = document.getElementById('detailPanel');
    if (!panel) return;
    const card = cardsData[cardIdx];
    const cardNum = cardIdx + 1;
    const imgSrc = getCardImagePath(cardNum);
    const doiLink = card.doi ? `https://doi.org/${card.doi}` : '#';
    const webLink = card.weblink ? card.weblink : doiLink;
    panel.innerHTML = `
        <div class="detail-image">
            <img src="${imgSrc}" alt="${card.mate_name}" onerror="this.src='https://placehold.co/280x420?text=Card+${cardNum}'">
        </div>
        <div class="detail-text">
            <h3>${card.mate_name} <span style="font-size:1rem;">(#${cardNum})</span></h3>
            <div class="detail-description"><strong>${card.mate_function}</strong><br>${card.description}</div>
            <div class="detail-doi">
                <strong>Reference:</strong> <a href="${webLink}" target="_blank" rel="noopener noreferrer">doi:${card.doi || 'no DOI'}</a>
            </div>
        </div>
    `;
}

// Simple CSV parser that handles quoted fields
function parseCSV(csvText) {
    const rows = [];
    const regex = /(?:,|^)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    let lines = csvText.split(/\r?\n/);
    for (let line of lines) {
        if (line.trim() === '') continue;
        let row = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
            row.push(match[1] !== undefined ? match[1].replace(/""/g, '"') : (match[2] || ''));
        }
        if (row.length > 0) rows.push(row);
        regex.lastIndex = 0;
    }
    return rows;
}

async function loadCSVAndInit() {
    try {
        const response = await fetch('micromates.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        if (rows.length < 2) throw new Error('CSV has no data rows');
        const headers = rows[0];
        cardsData = [];
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i];
            if (cols.length < 6) continue;
            cardsData.push({
                location: cols[0],
                mate_name: cols[1],
                mate_function: cols[2],
                description: cols[3],
                doi: cols[4],
                weblink: cols[5]
            });
        }
        TOTAL_CARDS = cardsData.length;
        if (TOTAL_CARDS !== 55) console.warn(`Expected 55 cards, got ${TOTAL_CARDS}`);
        micromatesInitialized = false;
        const container = document.querySelector('.micromates-wrapper');
        if (container) {
            renderCarouselTrack();
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');
            if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel('prev'));
            if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel('next'));
            selectedCardIndex = 0;
            renderCarouselTrack();
            updateDetailPanel(0);
        }
        micromatesInitialized = true;
    } catch (error) {
        console.error('Failed to load micromates.csv:', error);
        const container = document.querySelector('.micromates-wrapper');
        if (container) {
            container.innerHTML = '<p style="color:#ff8888; text-align:center;">❌ Failed to load card data. Make sure <strong>micromates.csv</strong> exists in the root folder.</p>';
        }
    }
}

function initMicromatesPage() {
    if (micromatesInitialized) return;
    setTimeout(() => {
        loadCSVAndInit();
    }, 50);
}

// ----- RENDER HOME -----
function renderHome() {
    const topNews = siteData.newsItems.slice(0, 3);
    const newsHtml = topNews.length > 0 ? topNews.map(news => `
        <div class="news-card">
            ${news.imageUrl ? `<img src="${escapeHtml(news.imageUrl)}" alt="${escapeHtml(news.title)}" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=News'">` : ''}
            <div class="news-content">
                <div class="news-date">${escapeHtml(news.date)}</div>
                <div class="news-title">${escapeHtml(news.title)}</div>
                <div class="news-summary">${escapeHtml(news.summary)}</div>
                <a href="${escapeHtml(news.link)}" class="read-more" target="_blank">Read more →</a>
            </div>
        </div>
    `).join('') : `<div class="news-card"><div class="news-content"><div class="news-date">Loading news...</div><div class="news-title">Please check back soon</div><div class="news-summary">News items will appear here once available.</div></div></div>`;
    
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p><b>We explore the past life of microorganisms in marine and freshwater systems</b></p>
        </div>
        <div class="lab-intro">
            <div class="lab-intro-text">
                <p>We study the spatio-temporal dynamics of <b>aquatic microbial communities</b> and their functional responses to environmental change, such as climate change, eutrophication, deoxygenation or mercury pollution. We apply <b>molecular ecology</b> methods, such as metabarcoding, (ancient) metagenomics, MAGs-based analysis and metatranscriptomics. By sequencing the genetic information from <b>water columns</b> and underlying <b>sedimentary archives</b>, we investigate the long-term changes in aquatic microbial life for a better understanding of their current and future trajectories.</p>
                <button class="cn-intro-btn" aria-label="Toggle Chinese/English">中文</button>
            </div>
            <div class="lab-intro-image">
                <img src="images/team2025.png" alt="Capo Lab Team 2025" onerror="this.src='https://via.placeholder.com/400x200?text=Lab+Photo'">
            </div>
        </div>
        <div class="news-section">
            <h2 class="section-title">Latest News</h2>
            <div class="news-grid">${newsHtml}</div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('news')">More News →</button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main render
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
                    <li><a href="#" data-page="micromates" onclick="navigateTo('micromates'); return false;">MicroMates</a></li>
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
    if (!siteData.newsItems.length) await loadPageContent('news');
    const pageContainer = document.getElementById('page-container');
    let content = '';
    if (siteData.currentPage === 'home') {
        content = renderHome();
        pageContainer.innerHTML = content;
        initHomePageTranslation();
    } else if (siteData.currentPage === 'micromates') {
        content = buildMicromatesHTML();
        pageContainer.innerHTML = content;
        initMicromatesPage();
    } else if (siteData.currentPage === 'research') {
        content = await loadPageContent('research');
        pageContainer.innerHTML = content;
        initResearchPageTranslations();
    } else {
        content = await loadPageContent(siteData.currentPage);
        pageContainer.innerHTML = content;
        if (siteData.currentPage === 'publications') enhancePublications();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    render();
    document.addEventListener('click', (e) => { if (e.target === document.getElementById('modal')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});

window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.openModal = openModal;
