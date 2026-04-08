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
const chineseIntroTranslation = `<p>我们研究<b>水生微生物群落</b>如何随空间和时间变化，以及它们如何功能性地响应气候变化、富营养化、脱氧作用和汞污染。我们运用<b>分子生态学</b>工具——宏条形码、（古）宏基因组学、MAGs分析以及宏转录组学——从水柱和沉积物档案中获取遗传信息，捕捉微生物生命的高分辨率记录。重建<b>微生物功能的长期变化</b>有助于我们将过去的生态系统状态与当前动态联系起来，从而提高在持续环境变化下对水生生态系统未来轨迹的预测能力。</p>`;
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
    1: `<p>我们研究湖泊表层水体及底层沉积物活性微生物层中的微生物多样性（细菌、古菌、原生生物）。利用新型无人机采样方法，结合沉积物岩芯采集，我们从瑞典数百个湖泊中收集水样。结合宏条形码和宏基因组学，这项工作正在生成首个瑞典湖泊微生物多样性综合目录。</p>
        <p><strong>方法：</strong> 无人机水样采集、沉积物岩芯钻取、宏条形码、宏基因组学</p>
        <p><strong>示例：</strong> 想了解更多？观看 BLADE 项目视频</p>`,
    2: `<p>我们研究微生物群落如何响应由气候变暖和营养盐污染引起的近海系统氧最小区扩张。利用宏基因组学、宏转录组学结合氧梯度培养实验，我们追踪功能变化、代谢适应，以及对氮、硫、碳循环和甲基汞产生的级联效应。我们的目标是预测脱氧作用如何重塑近海生物地球化学过程，并为全球变暖背景下神经毒素产生的减缓策略提供科学依据。</p>
        <p><strong>方法：</strong> 水样采集、沉积物岩芯钻取、宏条形码、宏基因组学、基于基因组的宏转录组学</p>
        <p><strong>示例：</strong> 感兴趣？观看我们的纪录片《峡湾前沿》</p>`,
    3: `<p>我们利用沉积物古DNA（sedDNA）重建淡水和海洋微生物群落数百至数千年的变化。通过分析沉积物岩芯中保存的遗传记录，我们揭示微生物如何响应过去的气候变化、富营养化、脱氧作用及其他环境压力。这一长期视角帮助我们连接过去的生态系统状态与当前动态，从而提高在持续人为压力下对未来演变轨迹的预测能力。</p>
        <p><strong>方法：</strong> 沉积物岩芯钻取、古宏基因组学、系统发育基因组学</p>
        <p><strong>示例：</strong> 想参与更多？观看 SWE25 探险视频！</p>`
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
const MOVE_STEP = 2;          // number of cards to move per click/swipe
let selectedCardIndex = 0;
let cardsData = [];

// Infinite carousel variables
let CLONE_COUNT = 3;           // three copies of the cards
let realCardWidth = 0;
let realGap = 0;
let cardsPerView = 5;

// Cooldown for touchpad scrolling
let wheelCooldown = false;
let wheelTimer = null;

function getCardImagePath(cardNumber) {
    const padded = String(cardNumber).padStart(2, '0');
    return `images/mates/mates${padded}.jpg`;
}

function buildMicromatesHTML() {
    return `
        <div class="micromates-wrapper">
            <h1 class="section-title">MicroMates Card Game</h1>
            <div class="game-header">
                <div class="game-text-box">
                    <h3 class="section-title">MicroMates Oceanic Realms</h3>
                    <p style="text-align: justify;"><strong>How to play</strong> (2–6 players): Shuffle all 55 cards. Deal 7 cards each. Youngest starts. 
                    On your turn, ask any player for a card from a realm (Baltic Sea, Cariaco Basin,...) you already own. 
                    If they have it, take it and continue; if not, draw 1 card from the pile. 
                    When you complete a realm (5 card types), show it and place it face up. 
                    First to collect <strong>3 complete realms</strong> wins!<br><br>
                    <strong>Card types</strong> (one per realm):<br>
                    <img src="images/others/yellow.png" alt="Light" style="height:1.2rem; vertical-align:middle;"> Light &nbsp;&nbsp;
                    <img src="images/others/pink.png" alt="Nitrogen" style="height:1.2rem; vertical-align:middle;"> Nitrogen &nbsp;&nbsp;
                    <img src="images/others/blue.png" alt="Sulfur" style="height:1.2rem; vertical-align:middle;"> Sulfur &nbsp;&nbsp;
                    <img src="images/others/green.png" alt="Carbon" style="height:1.2rem; vertical-align:middle;"> Carbon &nbsp;&nbsp;
                    <img src="images/others/purple.png" alt="Special" style="height:1.2rem; vertical-align:middle;"> Special
                    </p>
                </div>
                <div class="game-right-img">
                    <img src="images/mates/micromates.png" alt="MicroMates logo" onerror="this.src='https://placehold.co/500x300?text=MicroMates'">
                </div>
            </div>
            <div class="carousel-box">
                <h3 class="carousel-title">Oceanic Realms Collection</h3>
                <div class="carousel-container" id="micromatesCarousel">
                    <div class="carousel-wrapper">
                        <button class="carousel-btn" id="carouselPrev">‹</button>
                        <div class="cards-scroll">
                            <div class="cards-track" id="cardsTrack"></div>
                        </div>
                        <button class="carousel-btn" id="carouselNext">›</button>
                    </div>
                </div>
            </div>
            <div id="detailPanel" class="detail-panel">
                <div class="empty-detail">✨ Click on any card above to see its details ✨</div>
            </div>
            
            <!-- NEW HISTORY SECTION (text left, image right) -->
            <div class="game-header history-section" style="margin-top: 2rem;">
                <div class="game-text-box">
                    <h3 class="section-title">The Story Behind MicroMates</h3>
                    <p style="text-align: justify;">
                        MicroMates was born from a passion for both microbiology and card gaming. 
                        The idea came during a late‑night lab meeting when researchers realised that the 
                        incredible diversity of microbial metabolism – from light‑harvesting to sulfur cycling – 
                        could be turned into a fun, educational card game. 
                        Each card represents a real microbial process or organism, carefully illustrated 
                        and linked to scientific references. The game has been play‑tested by scientists, 
                        students, and families to ensure it is both accurate and engaging. 
                        Today, MicroMates is used in classrooms and at conferences to spark curiosity 
                        about the hidden world of microbes.
                 This idea started from the collaboration of two scientists Dr Eric Capo and Meifang Zhong from Umeå University (Umeå, Sweden), and the artist Thomas Cerigny from Mikimo studio (Bordeaux, France).
                    </p>
                    <p style="text-align: justify; margin-top: 1rem;">
                        <strong>Version 1.0</strong> – 55 cards, 11 realms, endless strategies. 
                        Stay tuned for expansion packs featuring deep‑sea vents and polar microbiomes!
                    </p>
                </div>
                <div class="game-right-img">
                    <img src="images/mates/history.jpg" alt="History of MicroMates" onerror="this.src='https://placehold.co/500x300?text=History+of+MicroMates'">
                </div>
            </div>
        </div>
    `;
}


// Attach touchpad and touch swipe events
function attachCarouselSwipeEvents() {
    const scrollContainer = document.querySelector('.cards-scroll');
    if (!scrollContainer) return;
    
    let touchStartX = 0;
    let isSwiping = false;
    
    scrollContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            if (wheelCooldown) return;
            if (e.deltaX > 0) moveCarousel('next');
            else if (e.deltaX < 0) moveCarousel('prev');
            wheelCooldown = true;
            if (wheelTimer) clearTimeout(wheelTimer);
            wheelTimer = setTimeout(() => { wheelCooldown = false; }, 150);
        }
    }, { passive: false });
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
    });
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const deltaX = e.touches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) moveCarousel('prev');
            else moveCarousel('next');
            isSwiping = false;
        }
    });
    scrollContainer.addEventListener('touchend', () => { isSwiping = false; });
}

// Attach click events without rebuilding the track (smooth centering)
function attachCardClickEvents() {
    document.querySelectorAll('.card-item').forEach(card => {
        // Clone to remove any previous listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        const originalIndex = parseInt(newCard.dataset.cardIndex);
        newCard.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedCardIndex === originalIndex) return;
            
            selectedCardIndex = originalIndex;
            
            // Update 'selected' class on all cards (only middle copy gets highlight)
            document.querySelectorAll('.card-item').forEach(c => {
                const idx = parseInt(c.dataset.cardIndex);
                const copy = parseInt(c.dataset.copy);
                if (idx === selectedCardIndex && copy === 1) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            });
            
            centerOnCard(selectedCardIndex);
            updateDetailPanel(selectedCardIndex);
        });
    });
}

function renderCarouselTrack() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    
    let html = '';
    for (let copy = 0; copy < CLONE_COUNT; copy++) {
        for (let i = 0; i < TOTAL_CARDS; i++) {
            const cardNum = i + 1;
            const imgPath = getCardImagePath(cardNum);
            const isSelected = (selectedCardIndex === i && copy === 1);
            html += `
                <div class="card-item ${isSelected ? 'selected' : ''}" data-card-index="${i}" data-copy="${copy}">
                    <img src="${imgPath}" class="card-img" onerror="this.src='https://placehold.co/160x240?text=Card+${cardNum}'">
                </div>
            `;
        }
    }
    track.innerHTML = html;
    
    attachCardClickEvents();
    
    const firstCard = track.querySelector('.card-item');
    if (firstCard) {
        realCardWidth = firstCard.offsetWidth;
        const style = window.getComputedStyle(track);
        realGap = parseFloat(style.gap) || 0;
    }
    
    currentCarouselOffset = TOTAL_CARDS * 1;
    updateCarouselPosition(true);
}

function updateCarouselPosition(skipTransition = false) {
    const track = document.getElementById('cardsTrack');
    if (!track || realCardWidth === 0) return;
    
    const fullCardWidth = realCardWidth + realGap;
    const container = document.querySelector('.cards-scroll');
    const containerWidth = container ? container.clientWidth : 0;
    cardsPerView = Math.floor(containerWidth / fullCardWidth);
    if (cardsPerView < 1) cardsPerView = 1;
    
    if (skipTransition) track.style.transition = 'none';
    else track.style.transition = 'transform 0.3s ease-out';
    
    track.style.transform = `translateX(-${currentCarouselOffset * fullCardWidth}px)`;
    
    if (skipTransition) {
        track.offsetHeight; // force reflow
        track.style.transition = '';
    }
    
    // Infinite loop reset logic
    const totalVirtualCards = TOTAL_CARDS * CLONE_COUNT;
    if (currentCarouselOffset >= TOTAL_CARDS * (CLONE_COUNT - 1)) {
        currentCarouselOffset -= TOTAL_CARDS;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentCarouselOffset * fullCardWidth}px)`;
        track.offsetHeight;
        track.style.transition = '';
    } else if (currentCarouselOffset < TOTAL_CARDS) {
        currentCarouselOffset += TOTAL_CARDS;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentCarouselOffset * fullCardWidth}px)`;
        track.offsetHeight;
        track.style.transition = '';
    }
}

function moveCarousel(direction) {
    if (!realCardWidth) return;
    const fullCardWidth = realCardWidth + realGap;
    if (direction === 'prev') currentCarouselOffset -= MOVE_STEP;
    else if (direction === 'next') currentCarouselOffset += MOVE_STEP;
    updateCarouselPosition(false);
}

function centerOnCard(cardOriginalIndex) {
    if (!realCardWidth) return;
    const fullCardWidth = realCardWidth + realGap;
    const targetOffset = TOTAL_CARDS * 1 + cardOriginalIndex;
    const container = document.querySelector('.cards-scroll');
    const containerWidth = container ? container.clientWidth : 0;
    const currentCardsPerView = Math.floor(containerWidth / fullCardWidth);
    const desiredOffset = Math.max(0, targetOffset - Math.floor(currentCardsPerView / 2));
    currentCarouselOffset = desiredOffset;
    updateCarouselPosition(false);
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
            <h3>${escapeHtml(card.mate_name)} <span style="font-size:1rem;">(#${cardNum})</span></h3>
            <div class="detail-description"><strong>${escapeHtml(card.mate_function)}</strong><br>${escapeHtml(card.description)}</div>
            <div class="detail-doi">
                <strong>Reference:</strong> <a href="${escapeHtml(webLink)}" target="_blank" rel="noopener noreferrer">doi:${escapeHtml(card.doi || 'no DOI')}</a>
            </div>
        </div>
    `;
}

// Robust CSV parser (handles quotes, missing fields, trailing newlines)
function parseCSV(csvText) {
    const rows = [];
    const lines = csvText.split(/\r?\n/);
    for (let line of lines) {
        line = line.trim();
        if (line === '') continue;
        const row = [];
        let inQuotes = false;
        let current = '';
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                row.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        row.push(current); // last field
        // Remove surrounding quotes and unescape double quotes
        const cleaned = row.map(f => f.replace(/^"|"$/g, '').replace(/""/g, '"'));
        rows.push(cleaned);
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
        cardsData = [];
        for (let i = 1; i < rows.length; i++) {
            let cols = rows[i];
            // Ensure at least 6 columns (weblink may be missing)
            while (cols.length < 6) cols.push('');
            const [location, mate_name, mate_function, description, doi, weblink] = cols;
            const finalWeblink = weblink || (doi ? `https://doi.org/${doi}` : '#');
            cardsData.push({
                location, mate_name, mate_function, description, doi,
                weblink: finalWeblink
            });
        }
        TOTAL_CARDS = cardsData.length;
        if (TOTAL_CARDS !== 55) console.warn(`Expected 55 cards, got ${TOTAL_CARDS}`);
        micromatesInitialized = true;
        rebuildMicromatesCarousel();
    } catch (error) {
        console.error('Failed to load micromates.csv:', error);
        const container = document.querySelector('.micromates-wrapper');
        if (container) {
            container.innerHTML = '<p style="color:#ff8888; text-align:center;">❌ Failed to load card data. Make sure <strong>micromates.csv</strong> exists in the root folder.</p>';
        }
    }
}

function rebuildMicromatesCarousel() {
    if (cardsData.length === 0) return;
    currentCarouselOffset = TOTAL_CARDS * 1;
    selectedCardIndex = 0;
    renderCarouselTrack();
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener('click', () => moveCarousel('prev'));
    }
    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener('click', () => moveCarousel('next'));
    }
    attachCarouselSwipeEvents();
    updateDetailPanel(0);
}

function initMicromatesPage() {
    if (micromatesInitialized && cardsData.length > 0) {
        rebuildMicromatesCarousel();
    } else {
        loadCSVAndInit();
    }
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
<p>We study how <b>aquatic microbial communities</b> change across space and time, and how they functionally respond to climate change, eutrophication, deoxygenation, and mercury pollution. We apply <b>molecular ecology</b> tools—metabarcoding, (ancient) metagenomics, MAGs analysis, and metatranscriptomics from the genetic information from water columns and sediment archives, capturing a high-resolution record of microbial life. Reconstructing <b>long-term microbial changes</b> helps us link past ecosystem states to present dynamics, improving predictions of future aquatic ecosystem trajectories under ongoing environmental change.</p>
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
