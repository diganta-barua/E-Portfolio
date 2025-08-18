// Techy Effects and Contact Form Handler
class TechyEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupCounterAnimations();
        this.setupMatrixEffect();
        this.setupTypingEffect();
        this.setupGlitchEffect();
        this.fetchGitHubStats();
        this.fetchGitHubProjects();
        
        // Make toggle function globally accessible
        window.toggleDescription = this.toggleDescription.bind(this);
        // Delegated handler for all see-more / see-less buttons (data-driven)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.see-more-link, .see-more-btn');
            if (!btn) return;
            const targetId = btn.dataset.target;
            if (!targetId) return;
            const desc = document.getElementById(targetId);
            if (!desc) return;

            const full = desc.dataset.full ? decodeURIComponent(desc.dataset.full) : null;
            const short = desc.dataset.short ? decodeURIComponent(desc.dataset.short) : null;

            if (desc.classList.contains('expanded')) {
                // collapse
                if (short !== null) {
                    // Keep the button inside
                    const btnClone = btn.cloneNode(true);
                    desc.textContent = short;
                    desc.appendChild(btnClone);
                }
                desc.classList.remove('expanded');
                btn.textContent = 'see more';
                btn.setAttribute('aria-expanded', 'false');
            } else {
                // expand
                if (full !== null) {
                    // Keep the button inside
                    const btnClone = btn.cloneNode(true);
                    desc.textContent = full;
                    desc.appendChild(btnClone);
                }
                desc.classList.add('expanded');
                btn.textContent = 'see less';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Fetch GitHub Stats
    async fetchGitHubStats() {
        try {
            console.log('Fetching GitHub stats from Cloudflare Worker');
            
            // Fetch repositories from Cloudflare Worker
            const response = await fetch('https://winter-mode-133a.mubin9516.workers.dev');
            const reposData = await response.json();
            
            console.log('Worker response:', reposData);
            
            // Ensure we have valid array data
            if (!Array.isArray(reposData) || reposData.length === 0) {
                console.warn('Invalid or empty repos data from worker');
                this.setFallbackStats();
                return;
            }
            
            // Store the data for use in projects section
            this.githubReposData = reposData;
            
            // Calculate stats from the repos data
            const totalRepos = reposData.length;
            const totalStars = reposData.reduce((sum, repo) => {
                const stars = parseInt(repo.stargazers_count) || 0;
                return sum + stars;
            }, 0);
            const totalForks = reposData.reduce((sum, repo) => {
                const forks = parseInt(repo.forks_count) || 0;
                return sum + forks;
            }, 0);
            
            console.log('Calculated stats:', { totalRepos, totalStars, totalForks });
            
            // Update counters with real data
            this.updateGitHubCounters(totalRepos, totalStars, totalForks);
            
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            this.setFallbackStats();
        }
    }

    // Update GitHub counter displays
    updateGitHubCounters(repos, stars, forks) {
        const repoCounter = document.getElementById('github-repos');
        const starCounter = document.getElementById('github-stars');
        const forkCounter = document.getElementById('github-forks');
        const languageCounter = document.getElementById('github-languages');
        
        if (repoCounter) {
            repoCounter.setAttribute('data-target', repos);
            repoCounter.textContent = repos;
        }
        if (starCounter) {
            starCounter.setAttribute('data-target', stars);
            starCounter.textContent = stars;
        }
        if (forkCounter) {
            forkCounter.setAttribute('data-target', forks);
            forkCounter.textContent = forks;
        }
        
        // Count unique languages from repositories
        if (languageCounter && this.githubReposData) {
            const languages = new Set();
            this.githubReposData.forEach(repo => {
                if (repo.language) {
                    languages.add(repo.language);
                }
            });
            const languageCount = languages.size;
            languageCounter.setAttribute('data-target', languageCount);
            languageCounter.textContent = languageCount;
        }
    }

    // Set fallback stats when worker fails
    setFallbackStats() {
        this.githubReposData = [];
        this.updateGitHubCounters(0, 0, 0);
        
        const repoCounter = document.getElementById('github-repos');
        const starCounter = document.getElementById('github-stars');
        const forkCounter = document.getElementById('github-forks');
        const languageCounter = document.getElementById('github-languages');
        
        if (repoCounter) repoCounter.textContent = '10+';
        if (starCounter) starCounter.textContent = '5+';
        if (forkCounter) forkCounter.textContent = '3+';
        if (languageCounter) languageCounter.textContent = '6+';
    }

    // Fetch GitHub Projects with enhanced data
    // Enhanced GitHub project fetching with languages and filtering
    async fetchGitHubProjects() {
        try {
            console.log('Setting up GitHub projects display');
            
            let repos;
            
            // Use already fetched data if available, otherwise fetch fresh
            if (this.githubReposData && this.githubReposData.length > 0) {
                console.log('Using already fetched GitHub data:', this.githubReposData);
                repos = this.githubReposData;
            } else {
                console.log('Fetching fresh GitHub data for projects');
                const response = await fetch('https://winter-mode-133a.mubin9516.workers.dev');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                repos = await response.json();
                console.log('Fresh repos data:', repos);
            }
            
            if (!Array.isArray(repos) || repos.length === 0) {
                console.warn('No repositories available');
                this.handleNoRepositories();
                return;
            }

            console.log('Raw repos data structure:', repos[0]);
            console.log('Repos count:', repos.length);
            
            // Filter out forks and empty repos, sort by most recent first (latest repos first)
            const filteredRepos = repos
                .filter(repo => repo && !repo.fork && repo.size > 0)
                .sort((a, b) => {
                    // Sort by creation date first (latest first), then by stars
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    if (dateB - dateA !== 0) {
                        return dateB - dateA;
                    }
                    return (b.stargazers_count || 0) - (a.stargazers_count || 0);
                });
            
            console.log('Filtered repos:', filteredRepos);
            
            // Let's see what the worker is actually providing
            console.log('Sample repo data structure:', filteredRepos[0]);
            if (filteredRepos[0]) {
                console.log('Sample repo languages field:', filteredRepos[0].languages);
                console.log('Sample repo language field:', filteredRepos[0].language);
                console.log('Sample repo languages_url:', filteredRepos[0].languages_url);
            }
            
            // Use worker data directly - no additional API calls
            const enhancedRepos = await Promise.all(
                filteredRepos.map(async (repo) => {
                    console.log(`Processing repo from worker: ${repo.name}`);
                    
                    // Use primary language from worker data
                    const languages = repo.language ? {[repo.language]: 100} : {'Code': 100};
                    
                    return {
                        ...repo,
                        image: await this.getProjectImage(repo.name, repo.language),
                        languages: languages,
                        topics: repo.topics || []
                    };
                })
            );
            
            console.log('Enhanced repos with languages:', enhancedRepos);
            console.log('About to call displayProjects with', enhancedRepos.length, 'repositories');
            
            // Store repositories for filtering
            this.allRepositories = enhancedRepos;
            this.currentLanguageFilter = 'all';
            
            // Create language filters and update statistics
            this.createLanguageFilters(enhancedRepos);
            
            // Display all projects initially
            this.displayProjects(enhancedRepos);
        } catch (error) {
            console.error('Error in fetchGitHubProjects:', error);
            this.handleNoRepositories();
        }
    }
    
    // Handle case when no repositories are available
    handleNoRepositories() {
        // Set default values to prevent NaN
        this.allRepositories = [];
        this.updateProjectStatistics(0, 0, 0, 0);
        
        // Still create the filter structure with just "All" button
        const filtersContainer = document.getElementById('language-filters');
        if (filtersContainer) {
            filtersContainer.innerHTML = '<button class="filter-btn active" data-language="all">All</button>';
        }
        
        this.displayFallbackProjects();
    }

    // Get project image based on name and language
    async getProjectImage(name, language, username = 'mubin25-dodu') {
        // First, try to fetch the actual project image from the repository
        const imageName = `${name}.png`;
        const imageUrl = `https://raw.githubusercontent.com/${username}/${name}/main/image/${imageName}`;
        
        try {
            // Check if the image exists in the repository
            const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
            if (imageResponse.ok) {
                return imageUrl;
            }
        } catch (error) {
            console.log(`Image not found for ${name}, using generated image`);
        }
        
        // Try alternative paths
        const alternativePaths = [
            `https://raw.githubusercontent.com/${username}/${name}/main/images/${imageName}`,
            `https://raw.githubusercontent.com/${username}/${name}/main/img/${imageName}`,
            `https://raw.githubusercontent.com/${username}/${name}/main/assets/${imageName}`,
            `https://raw.githubusercontent.com/${username}/${name}/main/screenshots/${imageName}`,
            `https://raw.githubusercontent.com/${username}/${name}/main/preview/${imageName}`
        ];
        
        for (const altUrl of alternativePaths) {
            try {
                const response = await fetch(altUrl, { method: 'HEAD' });
                if (response.ok) {
                    return altUrl;
                }
            } catch (error) {
                continue;
            }
        }
        
        // Fallback to generated SVG if no image is found
        return this.generateProjectSVG(name, language);
    }

    generateProjectSVG(name, language) {
        // Clean the project name for display
        const cleanName = name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/[-_]/g, ' ').trim();
        const displayName = cleanName.length > 15 ? cleanName.substring(0, 15) + '...' : cleanName;
        
        // Enhanced language-specific styling
        const languageInfo = {
            'JavaScript': { primary: '#f7df1e', secondary: '#323330', bg: '#2d2d2d', icon: 'JS' },
            'Java': { primary: '#ed8b00', secondary: '#5382a1', bg: '#1e3a8a', icon: 'JAVA' },
            'C++': { primary: '#00599c', secondary: '#004482', bg: '#1e293b', icon: 'C++' },
            'C#': { primary: '#239120', secondary: '#68217a', bg: '#1e293b', icon: 'C#' },
            'HTML': { primary: '#e34c26', secondary: '#1572b6', bg: '#0f172a', icon: 'HTML' },
            'CSS': { primary: '#1572b6', secondary: '#ff6b35', bg: '#0f172a', icon: 'CSS' },
            'Python': { primary: '#3776ab', secondary: '#ffd43b', bg: '#0f4c75', icon: 'PY' },
            'TypeScript': { primary: '#3178c6', secondary: '#ffffff', bg: '#0f172a', icon: 'TS' },
            'Go': { primary: '#00add8', secondary: '#ffffff', bg: '#0f4c75', icon: 'GO' },
            'Rust': { primary: '#ce422b', secondary: '#000000', bg: '#1e293b', icon: 'RS' },
            'PHP': { primary: '#777bb4', secondary: '#ffffff', bg: '#1e293b', icon: 'PHP' },
            'Ruby': { primary: '#cc342d', secondary: '#ffffff', bg: '#1e293b', icon: 'RB' },
            'Swift': { primary: '#fa7343', secondary: '#ffffff', bg: '#1e293b', icon: 'SWIFT' },
            'Kotlin': { primary: '#7f52ff', secondary: '#ffffff', bg: '#1e293b', icon: 'KT' },
            'C': { primary: '#a8b9cc', secondary: '#283593', bg: '#1e293b', icon: 'C' },
            'default': { primary: '#00d4ff', secondary: '#8a2be2', bg: '#0a0a0a', icon: 'CODE' }
        };
        
        const info = languageInfo[language] || languageInfo.default;
        
        // Create sophisticated SVG with tech aesthetic
        const svg = `
            <svg width="100%" height="100%" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGrad-${language}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${info.bg};stop-opacity:1" />
                        <stop offset="50%" style="stop-color:${info.primary}20;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${info.bg};stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="iconGrad-${language}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${info.primary};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${info.secondary};stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow-${language}">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <pattern id="grid-${language}" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${info.primary}20" stroke-width="1"/>
                    </pattern>
                </defs>
                
                <!-- Background with gradient and grid -->
                <rect width="100%" height="100%" fill="url(#bgGrad-${language})" rx="12"/>
                <rect width="100%" height="100%" fill="url(#grid-${language})" rx="12"/>
                
                <!-- Header section -->
                <rect x="0" y="0" width="100%" height="40" fill="${info.primary}15" rx="12"/>
                
                <!-- Terminal-style dots -->
                <circle cx="20" cy="20" r="5" fill="#ff5f57"/>
                <circle cx="40" cy="20" r="5" fill="#ffbd2e"/>
                <circle cx="60" cy="20" r="5" fill="#28ca42"/>
                
                <!-- Language badge -->
                <rect x="240" y="10" width="70" height="20" fill="${info.primary}30" rx="10" 
                      stroke="${info.primary}" stroke-width="1"/>
                <text x="275" y="23" text-anchor="middle" fill="${info.primary}" 
                      font-family="Monaco, monospace" font-size="10" font-weight="600">${info.icon}</text>
                
                <!-- Main content area -->
                <g transform="translate(160, 90)">
                    <!-- Central icon -->
                    <circle cx="0" cy="0" r="25" fill="url(#iconGrad-${language})" opacity="0.9" 
                            filter="url(#glow-${language})"/>
                    <text x="0" y="6" text-anchor="middle" fill="white" 
                          font-family="Space Grotesk, sans-serif" font-size="14" font-weight="900">
                          ${info.icon.length > 4 ? info.icon.substring(0, 4) : info.icon}
                    </text>
                </g>
                
                <!-- Project name -->
                <text x="160" y="135" text-anchor="middle" fill="${info.primary}" 
                      font-family="Space Grotesk, sans-serif" font-size="14" font-weight="600" 
                      filter="url(#glow-${language})">${displayName}</text>
                
                <!-- Bottom accent line -->
                <rect x="0" y="155" width="100%" height="2" fill="url(#iconGrad-${language})" opacity="0.6"/>
                
                <!-- Corner decorations -->
                <text x="20" y="70" fill="${info.primary}" font-family="Monaco, monospace" 
                      font-size="20" opacity="0.3">&lt;</text>
                <text x="290" y="70" fill="${info.primary}" font-family="Monaco, monospace" 
                      font-size="20" opacity="0.3">/&gt;</text>
                
                <!-- Tech pattern elements -->
                <circle cx="40" cy="140" r="2" fill="${info.secondary}" opacity="0.6"/>
                <circle cx="50" cy="140" r="1.5" fill="${info.primary}" opacity="0.4"/>
                <circle cx="280" cy="140" r="2" fill="${info.secondary}" opacity="0.6"/>
                <circle cx="270" cy="140" r="1.5" fill="${info.primary}" opacity="0.4"/>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    // Display GitHub projects
    displayProjects(repos) {
        console.log('displayProjects called with:', repos);
        console.log('Number of repos to display:', repos ? repos.length : 'repos is null/undefined');
        
        const projectsGrid = document.getElementById('projects-grid');
        console.log('projects-grid element found:', !!projectsGrid);
        
        if (!projectsGrid) {
            console.error('projects-grid element not found!');
            return;
        }

        projectsGrid.innerHTML = '';
        console.log('Cleared projects-grid, now adding', repos.length, 'projects');

        repos.forEach((repo, index) => {
            console.log(`Creating card ${index + 1} for:`, repo.name);
            const projectCard = this.createProjectCard(repo);
            projectsGrid.appendChild(projectCard);
        });
        
        console.log('Finished adding all project cards to DOM');
    }

    // Create a clean project card with no spacing issues
    createProjectCard(repo) {
        const item = document.createElement('div');
        item.className = 'project-list-item';

        const languages = repo.languages || {};
        console.log(`Creating card for ${repo.name}, languages:`, languages);
        
        // Get all languages sorted by usage (bytes of code)
        const languagesList = Object.keys(languages)
            .filter(lang => lang && lang.trim() !== '')
            .sort((a, b) => (languages[b] || 0) - (languages[a] || 0)); // Sort by usage, most used first
            
        console.log(`Language list for ${repo.name}:`, languagesList);
        
        const description = repo.description || '';
        const short = description.length > 100 ? description.substring(0, 100) + '...' : description;
        
        // Get project image - repo.image should be populated from getProjectImage()
        const imageSrc = repo.image || '';
        
        // Create homepage URL for the demo button - if available
        const demoUrl = repo.homepage || '';
        const hasDemoUrl = demoUrl && demoUrl.trim() !== '';

        // Format date as shown in screenshot
        const updatedDate = new Date(repo.updated_at);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${months[updatedDate.getMonth()]} ${updatedDate.getDate()}`;
        
        item.innerHTML = `
            <div class="pli-thumb-wrap">
                <img class="pli-thumb" src="${imageSrc}" alt="${repo.name} thumbnail" loading="lazy" onclick="openImagePopup('${imageSrc}', '${repo.name}')" style="cursor: pointer;" />
            </div>
            <div class="pli-content">
                <a class="pli-title" href="${repo.html_url}" target="_blank">${repo.name}</a>
                <div class="pli-desc" id="desc-${repo.id}" data-full="${encodeURIComponent(description)}" data-short="${encodeURIComponent(short)}">${short}</div>
                <div class="pli-langs">
                    ${languagesList.length > 0 
                        ? languagesList.map(lang => `<span class="pli-lang">${lang}</span>`).join('') 
                        : '<span class="pli-lang">No languages detected</span>'
                    }
                </div>
                <div class="pli-meta">
                    <span class="pli-meta-item">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </span>
                    <span class="pli-meta-item">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </span>
                    <span class="pli-meta-item">
                        <i class="far fa-clock"></i> ${formattedDate}
                    </span>
                </div>
                <div class="pli-buttons">
                    <a href="${repo.html_url}" target="_blank" class="pli-button pli-button-github">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    ${hasDemoUrl ? `<a href="${demoUrl}" target="_blank" class="pli-button pli-button-demo">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                </div>
            </div>
        `;

        // Add a small see-more link if description is truncated
        if (description.length > 100) {
            const descElement = item.querySelector('.pli-desc');
            const btn = document.createElement('button');
            btn.className = 'see-more-btn';
            btn.setAttribute('data-target', `desc-${repo.id}`);
            btn.textContent = 'see more';
            descElement.appendChild(btn);
        }

        return item;
    }

    // Create language filter buttons from all repositories
    createLanguageFilters(repositories) {
        console.log('Creating language filters for repositories:', repositories);
        
        if (!repositories || repositories.length === 0) {
            console.error('No repositories data available for creating filters');
            return;
        }
        
        const allLanguages = new Set();
        
        // Collect all languages
        repositories.forEach(repo => {
            console.log('Processing repo:', repo.name, 'Language:', repo.language);
            
            if (repo.language && repo.language.trim() !== '') {
                allLanguages.add(repo.language);
            }
        });
        
        console.log('Found languages:', Array.from(allLanguages));
        
        // Sort languages alphabetically
        const sortedLanguages = Array.from(allLanguages).sort();
        
        // Get the language filters container
        const filtersContainer = document.getElementById('language-filters');
        if (!filtersContainer) {
            console.error('Language filters container not found');
            return;
        }
        
        // Clear existing filters except "All" button
        const allButton = filtersContainer.querySelector('[data-language="all"]');
        filtersContainer.innerHTML = '';
        if (allButton) {
            filtersContainer.appendChild(allButton);
        } else {
            // Create "All" button if it doesn't exist
            const allBtn = document.createElement('button');
            allBtn.className = 'filter-btn active';
            allBtn.setAttribute('data-language', 'all');
            allBtn.textContent = 'All';
            filtersContainer.appendChild(allBtn);
        }
        
        // Add language buttons
        sortedLanguages.forEach(language => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-language', language);
            button.textContent = language;
            filtersContainer.appendChild(button);
        });
        
        // Add click event listeners for filtering
        filtersContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-btn');
            if (!button) return;
            
            const language = button.getAttribute('data-language');
            this.filterProjectsByLanguage(language);
            
            // Update active button
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    }
    
    // Filter projects by language
    filterProjectsByLanguage(language) {
        this.currentLanguageFilter = language;
        
        let filteredRepos;
        if (language === 'all') {
            filteredRepos = this.allRepositories;
        } else {
            filteredRepos = this.allRepositories.filter(repo => {
                const languages = repo.languages || {};
                return Object.keys(languages).includes(language);
            });
        }
        
        // Display filtered projects
        this.displayProjects(filteredRepos);
    }

    // Helper function to calculate time ago
    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    // Toggle description function
    toggleDescription(repoId, fullText, truncatedText) {
        const descElement = document.getElementById(`desc-${repoId}`);
        const toggleButton = document.getElementById(`toggle-${repoId}`);
        
        if (toggleButton.textContent === 'See more') {
            descElement.textContent = fullText;
            toggleButton.textContent = 'See less';
        } else {
            descElement.textContent = truncatedText;
            toggleButton.textContent = 'See more';
        }
    }

    // Fallback projects if GitHub API fails
    async displayFallbackProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        const fallbackProjects = [
            {
                name: 'mubin-portfolio',
                description: 'Modern responsive portfolio website with dark theme and techy animations',
                language: 'JavaScript',
                stargazers_count: 0,
                forks_count: 0,
                watchers_count: 0,
                html_url: 'https://github.com/mubin25-dodu/mubin-portfolio',
                updated_at: new Date().toISOString()
            },
            {
                name: 'cpp-projects',
                description: 'Collection of C++ programming projects and algorithms',
                language: 'C++',
                stargazers_count: 0,
                forks_count: 0,
                watchers_count: 0,
                html_url: 'https://github.com/mubin25-dodu',
                updated_at: new Date().toISOString()
            },
            {
                name: 'java-applications',
                description: 'Java-based desktop and console applications',
                language: 'Java',
                stargazers_count: 0,
                forks_count: 0,
                watchers_count: 0,
                html_url: 'https://github.com/mubin25-dodu',
                updated_at: new Date().toISOString()
            },
            {
                name: 'web-development',
                description: 'Frontend web development projects using HTML, CSS, and JavaScript',
                language: 'HTML',
                stargazers_count: 0,
                forks_count: 0,
                watchers_count: 0,
                html_url: 'https://github.com/mubin25-dodu',
                updated_at: new Date().toISOString()
            }
        ];

        // Add images to fallback projects
        const enhancedFallbackProjects = await Promise.all(
            fallbackProjects.map(async (project) => ({
                ...project,
                image: await this.getProjectImage(project.name, project.language)
            }))
        );

        this.displayProjects(enhancedFallbackProjects);
    }

    // Contact Form Handler with EmailJS
    setupContactForm() {
        const form = document.getElementById('contactForm');
        const responseDiv = document.getElementById('form-response');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Executing...</span>';
            submitBtn.disabled = true;

            try {
                // Using Formspree for email sending (easier setup)
                // Change this to sendEmailWithEmailJS if you prefer EmailJS
                await this.sendEmailWithFormspree(data);
                
                this.showResponse('success', `
                    <div class="terminal-success">
                        > Message compiled successfully ✓<br>
                        > Packet transmitted to mubin9516@gmail.com<br>
                        > Response expected within 24-48 hours<br>
                        > Connection established. Thank you!
                    </div>
                `);
                
                form.reset();
            } catch (error) {
                this.showResponse('error', `
                    <div class="terminal-error">
                        > Error: Message transmission failed ✗<br>
                        > Please try alternative communication methods<br>
                        > Or contact directly: mubin9516@gmail.com
                    </div>
                `);
            }

            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    async sendEmailWithEmailJS(data) {
        // EmailJS integration
        // You need to:
        // 1. Sign up at https://www.emailjs.com/
        // 2. Create a service (Gmail, Outlook, etc.)
        // 3. Create an email template
        // 4. Get your public key, service ID, and template ID
        
        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID
        
        // Load EmailJS script if not already loaded
        if (typeof emailjs === 'undefined') {
            await this.loadEmailJS();
        }
        
        // Configure EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);
        
        // Send email
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_email: 'mubin9516@gmail.com'
        };
        
        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    }

    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Alternative: Formspree integration (simpler setup)
    async sendEmailWithFormspree(data) {
        // Replace with your Formspree endpoint after signing up at https://formspree.io/
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; 
        
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        return response.json();
    }

    showResponse(type, message) {
        const responseDiv = document.getElementById('form-response');
        if (!responseDiv) return;

        responseDiv.className = `form-response ${type}`;
        responseDiv.innerHTML = message;
        responseDiv.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            responseDiv.style.display = 'none';
        }, 10000);
    }

    // Animated Counter for Stats
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps

        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Matrix-style falling characters effect
    setupMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.05;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");

        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00d4ff';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 35);

        // Resize canvas when window resizes
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Typing effect for hero text
    setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            "Hello, I'm",
            "Welcome to my digital realm",
            "Initialize connection...",
            "Loading developer profile..."
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next text
            }

            setTimeout(typeText, typeSpeed);
        };

        setTimeout(typeText, 1000);
    }

    // Glitch effect for section titles
    setupGlitchEffect() {
        const titles = document.querySelectorAll('.section-title');
        
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                this.glitchText(title);
            });
        });
    }

    glitchText(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let iterations = 0;
        const maxIterations = 10;
        
        const glitch = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(glitch);
                element.textContent = originalText;
            }
            
            iterations += 1/3;
        }, 30);
    }
}

// Particle System for Background
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TechyEffects();
    new ParticleSystem();
});

// Code rain effect for specific sections
function createCodeRain(container) {
    const codeSymbols = ['0', '1', '{', '}', '(', ')', ';', ':', '<', '>', '/', '*', '+', '-', '='];
    
    for (let i = 0; i < 20; i++) {
        const symbol = document.createElement('span');
        symbol.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        symbol.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            color: rgba(0, 212, 255, 0.3);
            font-family: monospace;
            font-size: ${Math.random() * 10 + 10}px;
            animation: fall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(symbol);
    }
}

// Add CSS for falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
