// Render home page with top 3 news items
function renderHome() {
    // Get top 3 news items (most recent 3)
    const topNews = siteData.newsItems.slice(0, 3);
    
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p>We explore the life of microorganisms in marine and freshwater systems</p>
        </div>
        
        <div class="lab-intro">
            <div class="lab-intro-text">
                <p>We study the spatio-temporal dynamics of microbial communities and their functional responses to environmental change, such as climate change, eutrophication, mercury pollution or coral bleaching. One of our research lines is about the consequences of deoxygenation of water columns on microbial processes and related ecosystem services. We apply molecular ecology methods, such as metabarcoding, (ancient) metagenomics, MAGs-based analysis and metatranscriptomics. We rely on molecular paleoecology approaches, based on sedimentary DNA sequencing to reconstruct past changes in aquatic ecosystems. By combining genetic information from past and modern environments, we strive to shed light on the intricate relationships between microbial communities and their environment.</p>
            </div>
            <div class="lab-intro-image">
                <img src="images/team2025.png" alt="Capo Lab Team 2025" onerror="this.src='https://via.placeholder.com/400x300?text=Team+Photo+2025'">
            </div>
        </div>
        
        <div class="news-section">
            <h2 class="section-title">Latest News</h2>
            <div class="news-grid">
                ${topNews.map(news => `
                    <div class="news-card" onclick="window.location.href='#news'">
                        <img src="images/team2025.png" alt="${news.title}" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=News+Image'">
                        <div class="news-content">
                            <div class="news-date">${news.date}</div>
                            <div class="news-title">${news.title}</div>
                            <div class="news-summary">${news.summary}</div>
                            <span class="read-more">Read more →</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('news')">View All News →</button>
            </div>
        </div>
    `;
}
