document.addEventListener('DOMContentLoaded', () => {
  const projectsGrid = document.getElementById('projects-grid');
  const loadingSpinner = document.getElementById('loading-spinner');
  const noProjectsMessage = document.getElementById('no-projects');
  const searchInput = document.getElementById('project-search');
  const languageFilter = document.getElementById('language-filter');
  const sortFilter = document.getElementById('sort-filter');

  let allProjects = [];
  let filteredProjects = [];
  let allLanguages = new Set();

  // Fetch and display projects
  async function fetchProjects() {
    try {
      loadingSpinner.style.display = 'flex';
      noProjectsMessage.style.display = 'none';

      const response = await fetch('https://winter-mode-133a.mubin9516.workers.dev');
      const repos = await response.json();

      allProjects = repos;
      
      // Calculate and update statistics
      updateStatistics(repos);
      
      // Process languages for each project
      await processProjectLanguages(repos);
      
      // Populate language filter
      populateLanguageFilter();
      
      // Initially display all projects
      filteredProjects = [...allProjects];
      displayProjects(filteredProjects);
      
      loadingSpinner.style.display = 'none';
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      loadingSpinner.style.display = 'none';
      showNoProjects('Error loading projects. Please try again later.');
    }
  }

  // Update dashboard statistics
  function updateStatistics(repos) {
    const totalProjects = repos.length;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    animateNumber('total-projects', totalProjects);
    animateNumber('total-stars', totalStars);
    animateNumber('total-forks', totalForks);
    
    // Languages count will be updated after processing languages
  }

  // Animate number counting
  function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const increment = targetValue / (duration / 16);
    let currentValue = 0;
    
    const animation = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(animation);
      }
      element.textContent = Math.floor(currentValue);
    }, 16);
  }

  // Process languages for all projects
  async function processProjectLanguages(repos) {
    const languagePromises = repos.map(async (repo) => {
      try {
        const response = await fetch(repo.languages_url);
        const languages = await response.json();
        const languageList = Object.keys(languages);
        
        // Add to global languages set
        languageList.forEach(lang => allLanguages.add(lang));
        
        // Add languages to project object
        repo.languages = languageList;
        return languageList;
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error);
        repo.languages = [];
        return [];
      }
    });
    
    await Promise.all(languagePromises);
    
    // Update languages count
    animateNumber('languages-used', allLanguages.size);
  }

  // Populate language filter dropdown
  function populateLanguageFilter() {
    const sortedLanguages = Array.from(allLanguages).sort();
    
    // Clear existing options except "All Languages"
    languageFilter.innerHTML = '<option value="all">All Languages</option>';
    
    sortedLanguages.forEach(language => {
      const option = document.createElement('option');
      option.value = language;
      option.textContent = language;
      languageFilter.appendChild(option);
    });
  }

  // Display projects in the grid
  function displayProjects(projects) {
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
      showNoProjects();
      return;
    }
    
    projects.forEach((project, index) => {
      const projectCard = createProjectCard(project, index);
      projectsGrid.appendChild(projectCard);
    });
    
    noProjectsMessage.style.display = 'none';
  }

  // Create individual project card
  function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card blur';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const imageUrl = `https://raw.githubusercontent.com/mubin25-dodu/${project.name}/main/img/${project.name}.png`;
    const lastUpdated = new Date(project.updated_at).toLocaleDateString();
    const description = project.description || 'No description available for this project.';
    const shortDescription = description.length > 120 ? description.substring(0, 120) + '...' : description;
    const needsSeeMore = description.length > 120;
    
    card.innerHTML = `
      <div class="project-image-container">
        <img 
          class="project-image" 
          src="${imageUrl}" 
          alt="${project.name} preview"
          onclick="openImagePopup('${imageUrl}', '${project.name}')"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="project-image-placeholder" style="display: none;">
          <div class="placeholder-icon">🖼️</div>
          <p>No Preview Available</p>
        </div>
        <div class="project-overlay">
          <div class="overlay-content">
            <h3>�️ View Image</h3>
            <p>Click to see full size</p>
          </div>
        </div>
      </div>
      
      <div class="project-content">
        <h3 class="project-title">${project.name}</h3>
        <div class="project-description">
          <div class="description-text" data-full="${encodeURIComponent(description)}" data-short="${encodeURIComponent(shortDescription)}">
            ${needsSeeMore ? shortDescription : description}
          </div>
          ${needsSeeMore ? '<button class="see-more-btn" onclick="toggleDescription(this)">See more</button>' : ''}
        </div>
        
        <div class="project-stats">
          <span class="stat-tag">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
            </svg>
            ${project.stargazers_count} Stars
          </span>
          <span class="stat-tag">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6,2A2,2 0 0,1 8,4V20A2,2 0 0,1 6,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H6M6,4H4V20H6V4M22,7H8V10H22V7M22,14H8V17H22V14Z" />
            </svg>
            ${project.forks_count} Forks
          </span>
          <span class="stat-tag">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2V4L8,8L12,12V14L16,10L12,6Z" />
            </svg>
            Updated ${formatDate(project.updated_at)}
          </span>
        </div>
        
        <div class="project-languages">
          ${(project.languages || []).slice(0, 4).map(lang => `<span class="language-tag">${lang}</span>`).join('')}
          ${(project.languages || []).length > 4 ? `<span class="language-tag">+${(project.languages || []).length - 4} more</span>` : ''}
        </div>
        
        <div class="project-actions">
          <a href="${project.html_url}" target="_blank" class="action-btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
              <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            View Code
          </a>
          ${project.homepage ? `
            <a href="${project.homepage}" target="_blank" class="action-btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    return card;
  }

  // Toggle description visibility
  window.toggleDescription = function(button) {
    const descriptionText = button.previousElementSibling;
    const isExpanded = descriptionText.classList.contains('expanded');
    const fullText = decodeURIComponent(descriptionText.dataset.full);
    const shortText = decodeURIComponent(descriptionText.dataset.short);
    
    if (isExpanded) {
      descriptionText.innerHTML = shortText;
      descriptionText.classList.remove('expanded');
      button.textContent = 'See more';
    } else {
      descriptionText.innerHTML = fullText;
      descriptionText.classList.add('expanded');
      button.textContent = 'See less';
    }
  };

  // Format date helper function
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  // Show no projects message
  function showNoProjects(message = 'No projects found matching your criteria.') {
    noProjectsMessage.style.display = 'block';
    noProjectsMessage.querySelector('p').textContent = message;
  }

  // Filter and search functionality
  function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedLanguage = languageFilter.value;
    const sortBy = sortFilter.value;
    
    filteredProjects = allProjects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description && project.description.toLowerCase().includes(searchTerm));
      
      const matchesLanguage = selectedLanguage === 'all' || 
        (project.languages && project.languages.includes(selectedLanguage));
      
      return matchesSearch && matchesLanguage;
    });
    
    // Sort projects
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    displayProjects(filteredProjects);
  }

  // Event listeners
  searchInput.addEventListener('input', debounce(filterProjects, 300));
  languageFilter.addEventListener('change', filterProjects);
  sortFilter.addEventListener('change', filterProjects);

  // Debounce function for search input
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize
  fetchProjects();
});