// Data storage
const siteData = {
    currentPage: 'home',
    photos: [
        {
            id: 1,
            title: "Baltic Sea Expedition",
            date: "September 2024",
            description: "Collecting sediment samples from the Baltic Sea for sedDNA analysis.",
            imageUrl: "images/gallery/fieldwork-2024.jpg",
            category: "recent"
        },
        {
            id: 2,
            title: "Lab Meeting",
            date: "August 2024",
            description: "Weekly lab meeting discussing recent findings and future experiments.",
            imageUrl: "images/gallery/lab-meeting.jpg",
            category: "recent"
        },
        {
            id: 3,
            title: "Conference 2023",
            date: "November 2023",
            description: "Presenting research at the International Marine Science Conference.",
            imageUrl: "images/gallery/conference.jpg",
            category: "archive"
        },
        {
            id: 4,
            title: "Field Equipment Testing",
            date: "June 2024",
            description: "Testing new sediment coring equipment in the coastal zone.",
            imageUrl: "images/gallery/equipment-testing.jpg",
            category: "recent"
        }
    ],
    activePhoto: null
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
    modal.classList.add('active');
    renderModal();
}

function closeModal() {
    siteData.activePhoto = null;
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
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

// Page renderers
function renderHome() {
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p>We explore the life of microorganisms in marine and freshwater systems</p>
        </div>
        
        <div class="lab-intro">
            <div class="lab-intro-text">
                <h2>Our Research</h2>
                <p>We aim to understand the spatio-temporal dynamics of microbial communities and their functional responses to environmental change, such as climate change, eutrophication, mercury pollution or coral bleaching. One of our research lines are centered on investigating the consequences of deoxygenation of water columns on microbial processes and related ecosystem services. We apply molecular ecology methods, such as metabarcoding, (ancient) metagenomics, MAGs-based analysis and metatranscriptomics. We rely on molecular paleoecology approaches, based on sedimentary DNA sequencing to reconstruct past changes in aquatic ecosystems. By combining genetic information from past and modern environments, we strive to shed light on the intricate relationships between microbial communities and their environment.</p>
            </div>
            <div class="lab-intro-image">
                <img src="images/team2025.png" alt="Capo Lab Team 2025" onerror="this.src='https://via.placeholder.com/400x300?text=Team+Photo+2025'">
            </div>
        </div>
        
        <div class="gallery-section">
            <h2 class="section-title">Lab News</h2>
            <div class="gallery-grid">
                ${siteData.photos.filter(p => p.category === 'recent').slice(0, 3).map(photo => `
                    <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                        <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        <div class="photo-info">
                            <div class="photo-title">${photo.title}</div>
                            <div class="photo-date">${photo.date}</div>
                            <div class="photo-description">${photo.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('gallery')">View Full Gallery →</button>
            </div>
        </div>
    `;
}

function renderResearch() {
    return `
        <h1 class="section-title">Research</h1>
        <p>Our research focuses on understanding aquatic microbial ecosystems through cutting-edge molecular and ecological approaches.</p>
        
        <div class="research-grid">
            <div class="research-card">
                <h3>Molecular Paleoecology</h3>
                <p>Using sedimentary DNA (sedDNA) to reconstruct past changes in aquatic ecosystems over centuries to millennia.</p>
            </div>
            
            <div class="research-card">
                <h3>Microbial Community Dynamics</h3>
                <p>Understanding temporal dynamics of bacteria, archaea, and protists in response to environmental change.</p>
            </div>
            
            <div class="research-card">
                <h3>Deoxygenation Impacts</h3>
                <p>Investigating consequences of water column deoxygenation on microbial processes and ecosystem services.</p>
            </div>
            
            <div class="research-card">
                <h3>Environmental Stressors</h3>
                <p>Studying microbial responses to climate change, eutrophication, mercury pollution, and coral bleaching.</p>
            </div>
            
            <div class="research-card">
                <h3>Metagenomics & Metatranscriptomics</h3>
                <p>Applying advanced molecular methods including metabarcoding, ancient metagenomics, and MAGs-based analysis.</p>
            </div>
            
            <div class="research-card">
                <h3>Ecosystem Services</h3>
                <p>Linking microbial functional responses to ecosystem services in changing environments.</p>
            </div>
        </div>
    `;
}

function renderTeam() {
    return `
        <h1 class="section-title">Our Team</h1>
        <p>Meet the researchers, students, and collaborators who make our work possible.</p>
        
        <div class="team-grid">
            <div class="team-card">
                <img src="images/team/pi.jpg" alt="Principal Investigator" class="team-image" onerror="this.src='https://via.placeholder.com/280x280?text=Photo+Coming+Soon'">
                <div class="team-info">
                    <div class="team-name">Dr. Eric Capo</div>
                    <div class="team-role">Principal Investigator</div>
                    <div class="team-bio">Leading research on microbial ecology, sedDNA, and ecosystem dynamics. Passionate about understanding long-term environmental changes.</div>
                </div>
            </div>
            
            <div class="team-card">
                <img src="images/team/postdoc1.jpg" alt="Postdoctoral Researcher" class="team-image" onerror="this.src='https://via.placeholder.com/280x280?text=Photo+Coming+Soon'">
                <div class="team-info">
                    <div class="team-name">Dr. Anna Johnson</div>
                    <div class="team-role">Postdoctoral Researcher</div>
                    <div class="team-bio">Specializing in molecular ecology and bioinformatics. Working on sedDNA time-series analyses and metagenomics.</div>
                </div>
            </div>
            
            <div class="team-card">
                <img src="images/team/phd1.jpg" alt="PhD Student" class="team-image" onerror="this.src='https://via.placeholder.com/280x280?text=Photo+Coming+Soon'">
                <div class="team-info">
                    <div class="team-name">Maria Rodriguez</div>
                    <div class="team-role">PhD Candidate</div>
                    <div class="team-bio">Investigating microbial community dynamics in coastal sediments using ancient DNA approaches.</div>
                </div>
            </div>
            
            <div class="team-card">
                <img src="images/team/phd2.jpg" alt="PhD Student" class="team-image" onerror="this.src='https://via.placeholder.com/280x280?text=Photo+Coming+Soon'">
                <div class="team-info">
                    <div class="team-name">Thomas Chen</div>
                    <div class="team-role">PhD Candidate</div>
                    <div class="team-bio">Exploring climate change impacts on marine biodiversity using sedimentary archives.</div>
                </div>
            </div>
        </div>
    `;
}

function renderNews() {
    return `
        <h1 class="section-title">News & Updates</h1>
        <p>Stay updated with the latest from Capo Lab.</p>
        
        <div style="margin-top: 2rem;">
            <div class="news-item">
                <div class="news-date">March 15, 2024</div>
                <div class="news-title">New Paper Published in Nature Communications</div>
                <div class="news-summary">Our latest research on sedimentary DNA reveals unprecedented details about historical microbial community changes over the past 10,000 years.</div>
            </div>
            
            <div class="news-item">
                <div class="news-date">February 10, 2024</div>
                <div class="news-title">Capo Lab Awarded €2M ERC Grant</div>
                <div class="news-summary">The lab receives funding to advance sedDNA techniques for reconstructing aquatic biodiversity across millennia.</div>
            </div>
            
            <div class="news-item">
                <div class="news-date">January 20, 2024</div>
                <div class="news-title">Baltic Sea Expedition Successfully Completed</div>
                <div class="news-summary">Our team returned from a 3-week sampling cruise collecting sediment cores from 15 sites across the Baltic Sea.</div>
            </div>
            
            <div class="news-item">
                <div class="news-date">December 5, 2023</div>
                <div class="news-title">Capo Lab Welcomes New PhD Students</div>
                <div class="news-summary">We're excited to welcome two new PhD students who will be working on marine microbial ecology and paleoecology projects.</div>
            </div>
        </div>
    `;
}

function renderPublications() {
    return `
        <h1 class="section-title">Publications</h1>
        <p>Selected publications from Capo Lab members.</p>
        
        <div style="margin-top: 2rem;">
            <div class="publication-item">
                <div class="pub-year">2024</div>
                <div class="pub-title">Sedimentary DNA reveals historical biodiversity changes in the Baltic Sea over the last millennium</div>
                <div class="pub-authors">Smith, J., Capo, E., Johnson, A., et al.</div>
                <div class="pub-journal">Marine Ecology Progress Series, 712, 45-62</div>
            </div>
            
            <div class="publication-item">
                <div class="pub-year">2023</div>
                <div class="pub-title">Ancient DNA from sediment cores: A new frontier in marine paleoecology</div>
                <div class="pub-authors">Johnson, A., Capo, E., Giguet-Covex, C., et al.</div>
                <div class="pub-journal">Nature Reviews Earth & Environment, 4, 234-248</div>
            </div>
            
            <div class="publication-item">
                <div class="pub-year">2023</div>
                <div class="pub-title">Long-term dynamics of marine microbial communities revealed by sedimentary DNA</div>
                <div class="pub-authors">Capo, E., Rodriguez, M., Chen, T., et al.</div>
                <div class="pub-journal">The ISME Journal, 16, 1245-1256</div>
            </div>
            
            <div class="publication-item">
                <div class="pub-year">2022</div>
                <div class="pub-title">Tracking human impacts on coastal ecosystems using sedDNA metabarcoding</div>
                <div class="pub-authors">Rodriguez, M., Capo, E., & Smith, J.</div>
                <div class="pub-journal">Molecular Ecology, 31, 4892-4907</div>
            </div>
            
            <div class="publication-item">
                <div class="pub-year">2021</div>
                <div class="pub-title">Optimizing sedDNA extraction protocols for ancient marine sediments</div>
                <div class="pub-authors">Capo, E., Chen, T., & Johnson, A.</div>
                <div class="pub-journal">Methods in Ecology and Evolution, 12, 1892-1905</div>
            </div>
        </div>
    `;
}

function renderGallery() {
    const recentPhotos = siteData.photos.filter(p => p.category === 'recent');
    const archivePhotos = siteData.photos.filter(p => p.category === 'archive');
    
    return `
        <h1 class="section-title">Lab Gallery</h1>
        <p>Explore moments from our lab activities, field work, and team events.</p>
        
        <div class="gallery-section">
            <h2 class="section-title">Recent Photos</h2>
            <div class="gallery-grid">
                ${recentPhotos.map(photo => `
                    <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                        <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        <div class="photo-info">
                            <div class="photo-title">${photo.title}</div>
                            <div class="photo-date">${photo.date}</div>
                            <div class="photo-description">${photo.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${archivePhotos.length > 0 ? `
            <div class="gallery-section">
                <h2 class="section-title">Archive Photos</h2>
                <div class="gallery-grid">
                    ${archivePhotos.map(photo => `
                        <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                            <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                            <div class="photo-info">
                                <div class="photo-title">${photo.title}</div>
                                <div class="photo-date">${photo.date}</div>
                                <div class="photo-description">${photo.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

// Main render function
function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    let content = '';
    
    // Navigation
    content += `
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
        
        <div class="container">
            ${siteData.currentPage === 'home' ? renderHome() : ''}
            ${siteData.currentPage === 'research' ? renderResearch() : ''}
            ${siteData.currentPage === 'team' ? renderTeam() : ''}
            ${siteData.currentPage === 'news' ? renderNews() : ''}
            ${siteData.currentPage === 'publications' ? renderPublications() : ''}
            ${siteData.currentPage === 'gallery' ? renderGallery() : ''}
        </div>
        
        <footer>
            <p>Contact: <a href="mailto:eric.capo@umu.se">eric.capo@umu.se</a></p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Department of Ecology, Environment and Geoscience, Umeå University (Umeå, Sweden)</p>
        </footer>
        
        <div id="modal" class="modal">
            <div id="modal-content"></div>
        </div>
    `;
    
    app.innerHTML = content;
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
