// Modern Portfolio Scroll Animations
class ModernScrollAnimations {
  constructor() {
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    this.addAnimationCSS();
    this.setupIntersectionObserver();
    this.addAnimationClasses();
    this.setupSmoothScrolling();
    this.setupParallaxEffects();
  }

  addAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Modern animation styles */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
      }

      .fade-in {
        opacity: 0;
        transition: opacity 0.8s ease;
      }

      .fade-in.animated {
        opacity: 1;
      }

      .slide-up {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-up.animated {
        opacity: 1;
        transform: translateY(0);
      }

      .slide-in-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-in-left.animated {
        opacity: 1;
        transform: translateX(0);
      }

      .slide-in-right {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-in-right.animated {
        opacity: 1;
        transform: translateX(0);
      }

      .zoom-in {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .zoom-in.animated {
        opacity: 1;
        transform: scale(1);
      }

      .stagger-children > * {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .stagger-children.animated > *:nth-child(1) { transition-delay: 0.1s; }
      .stagger-children.animated > *:nth-child(2) { transition-delay: 0.2s; }
      .stagger-children.animated > *:nth-child(3) { transition-delay: 0.3s; }
      .stagger-children.animated > *:nth-child(4) { transition-delay: 0.4s; }
      .stagger-children.animated > *:nth-child(5) { transition-delay: 0.5s; }
      .stagger-children.animated > *:nth-child(6) { transition-delay: 0.6s; }

      .stagger-children.animated > * {
        opacity: 1;
        transform: translateY(0);
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll,
        .fade-in,
        .slide-up,
        .slide-in-left,
        .slide-in-right,
        .zoom-in,
        .stagger-children > * {
          transition: none;
          opacity: 1;
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);
  }

  addAnimationClasses() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
      el.classList.add('slide-up');
      this.observer.observe(el);
    });

    // About cards
    document.querySelectorAll('.about-card').forEach(el => {
      el.classList.add('slide-up');
      this.observer.observe(el);
    });

    // Skill categories
    document.querySelectorAll('.skills-category').forEach(el => {
      el.classList.add('slide-up');
      this.observer.observe(el);
    });

    // Project highlights
    document.querySelectorAll('.project-highlight').forEach(el => {
      el.classList.add('slide-up');
      this.observer.observe(el);
    });

    // Contact items
    document.querySelectorAll('.contact-item').forEach(el => {
      el.classList.add('slide-in-left');
      this.observer.observe(el);
    });

    // Detail items with stagger
    document.querySelectorAll('.about-details').forEach(el => {
      el.classList.add('stagger-children');
      this.observer.observe(el);
    });

    // Social links
    document.querySelectorAll('.hero-social').forEach(el => {
      el.classList.add('fade-in');
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    element.classList.add('animated');
    
    // Special handling for skill bars
    if (element.classList.contains('skills-category')) {
      setTimeout(() => {
        this.animateSkillBars(element);
      }, 300);
    }
  }

  animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      }, index * 200);
    });
  }

  setupSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.2;
        element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
      });
    });
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernScrollAnimations();
});

// Additional modern interactions
document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Add loading animation to profile image
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.addEventListener('load', () => {
      profileImage.style.opacity = '1';
      profileImage.style.transform = 'scale(1)';
    });
  }

  // Add hover effects to project cards
  document.querySelectorAll('.project-highlight').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
});

// Legacy compatibility
class ScrollAnimations extends ModernScrollAnimations {
  constructor() {
    super();
  }
}
        transform: translateY(60px);
      }

      .slide-up.animated {
        transform: translateY(0);
      }

      .slide-in-left {
        transform: translateX(-60px);
        opacity: 0;
      }

      .slide-in-left.animated {
        transform: translateX(0);
        opacity: 1;
      }

      .slide-in-right {
        transform: translateX(60px);
        opacity: 0;
      }

      .slide-in-right.animated {
        transform: translateX(0);
        opacity: 1;
      }

      .fade-in {
        opacity: 0;
        transform: scale(0.95);
      }

      .fade-in.animated {
        opacity: 1;
        transform: scale(1);
      }

      .zoom-in {
        opacity: 0;
        transform: scale(0.8);
      }

      .zoom-in.animated {
        opacity: 1;
        transform: scale(1);
      }

      /* Skill section specific animations */
      .skill-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .skill-item.animated {
        opacity: 1;
        transform: translateY(0);
      }

      /* Enhanced progress bar animations */
      .progress-bar {
        opacity: 0;
        transform: translateY(20px) scaleX(0);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: left center;
      }

      .progress-bar.animated {
        opacity: 1;
        transform: translateY(0) scaleX(1);
      }

      .progress-bar .progress {
        width: 0% !important;
        transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transition-delay: 0.3s;
      }

      .progress-bar.animated .progress {
        width: var(--target-width) !important;
      }

      /* Staggered animations for children */
      .stagger-children > * {
        transition-delay: 0s;
      }

      .stagger-children.animated > *:nth-child(1) { transition-delay: 0.1s; }
      .stagger-children.animated > *:nth-child(2) { transition-delay: 0.2s; }
      .stagger-children.animated > *:nth-child(3) { transition-delay: 0.3s; }
      .stagger-children.animated > *:nth-child(4) { transition-delay: 0.4s; }
      .stagger-children.animated > *:nth-child(5) { transition-delay: 0.5s; }

      /* Top scroll progress bar */
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(to right, #FF6F61, #28b6ee, #2196F3);
        z-index: 1000;
        transition: width 0.3s ease;
      }

      /* Enhanced card hover animations */
      .project-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .project-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);
  }

  animateElement(element) {
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.classList.add('animated');
      
      // Special handling for progress bars
      if (element.classList.contains('progress-bar')) {
        const progressElement = element.querySelector('.progress');
        if (progressElement) {
          // Trigger the width animation
          const targetWidth = progressElement.style.getPropertyValue('--target-width');
          if (targetWidth) {
            setTimeout(() => {
              progressElement.style.width = targetWidth;
            }, 300);
          }
        }
      }
      
      // Add ripple effect for special elements
      if (element.classList.contains('special-effect')) {
        this.addRippleEffect(element);
      }
    }, delay);
  }

  addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(40, 182, 238, 0.3);
      width: 20px;
      height: 20px;
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  addAnimationClasses() {
    // Main sections
    const sections = [
      { selector: '#card2', animation: 'slide-up', delay: 200 },
      { selector: '.sub', animation: 'slide-up', delay: 300 },
      { selector: '#card1', animation: 'slide-up', delay: 400 },
      { selector: '#cardl', animation: 'slide-up', delay: 500 },
      { selector: '#cardr', animation: 'slide-up', delay: 200 },
      { selector: '.project-card', animation: 'zoom-in', delay: 200 },
      { selector: '.class', animation: 'slide-up', delay: 300 },
      { selector: '#social', animation: 'fade-in', delay: 700 },
      
      // Projects section animations
      { selector: '.projects-section', animation: 'slide-up', delay: 200 },
      { selector: '.projects-header', animation: 'fade-in', delay: 300 },
      { selector: '.projects-subtitle', animation: 'slide-up', delay: 400 },
      { selector: '.project-controls', animation: 'slide-up', delay: 500 },
      { selector: '.projects-container', animation: 'slide-up', delay: 600 },
      { selector: '.projects-grid', animation: 'fade-in', delay: 700 },
      { selector: '#projects-grid .project-card', animation: 'zoom-in', delay: 100 }
    ];

    sections.forEach(({ selector, animation, delay }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        element.classList.add('animate-on-scroll', animation);
        element.dataset.delay = delay + (index * 100);
        this.observer.observe(element);
      });
    });

    // Special handling for skill items and progress bars
    this.setupSkillAnimations();
    
    // Setup project card animations (dynamically added)
    this.setupProjectCardAnimations();

    // Add staggered animation to navigation
    const nav = document.querySelector('#nav');
    if (nav) {
      nav.classList.add('animate-on-scroll', 'stagger-children', 'fade-in');
      this.observer.observe(nav);
    }
  }

  setupSkillAnimations() {
    // Animate skill list items
    const skillItems = document.querySelectorAll('.tik');
    skillItems.forEach((item, index) => {
      item.classList.add('skill-item');
      item.dataset.delay = index * 100;
      this.observer.observe(item);
    });

    // Animate progress bars with their target widths
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
      const progressElement = bar.querySelector('.progress');
      if (progressElement) {
        // Store the original width as a CSS custom property
        const targetWidth = progressElement.style.width;
        progressElement.style.setProperty('--target-width', targetWidth);
        
        // Add animation classes
        bar.classList.add('animate-on-scroll');
        bar.dataset.delay = index * 150;
        this.observer.observe(bar);
      }
    });
  }

  setupProjectCardAnimations() {
    // Observe for dynamically added project cards
    const projectsGrid = document.querySelector('#projects-grid');
    if (projectsGrid) {
      // Set up mutation observer to watch for new project cards
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList.contains('project-card')) {
              node.classList.add('animate-on-scroll', 'zoom-in');
              node.dataset.delay = Math.random() * 200; // Random delay for natural effect
              this.observer.observe(node);
            }
          });
        });
      });

      mutationObserver.observe(projectsGrid, {
        childList: true,
        subtree: true
      });

      // Also check for existing project cards
      const existingCards = projectsGrid.querySelectorAll('.project-card');
      existingCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', 'zoom-in');
        card.dataset.delay = index * 100;
        this.observer.observe(card);
      });
    }
  }

  setupSmoothScrolling() {
    // Create scroll progress bar (different from skill progress bars)
    const scrollProgressBar = document.createElement('div');
    scrollProgressBar.className = 'scroll-progress';
    document.body.appendChild(scrollProgressBar);

    // Update scroll progress bar on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${scrollProgress}%`;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Public method to manually trigger animations
  triggerAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!this.animatedElements.has(element)) {
        this.animateElement(element);
        this.animatedElements.add(element);
      }
    });
  }

  // Method to refresh project animations (call this when projects are loaded)
  refreshProjectAnimations() {
    const projectsSection = document.querySelector('.projects-section');
    const projectsGrid = document.querySelector('#projects-grid');
    
    if (projectsSection && !this.animatedElements.has(projectsSection)) {
      projectsSection.classList.add('animate-on-scroll', 'slide-up');
      projectsSection.dataset.delay = 200;
      this.observer.observe(projectsSection);
    }
    
    if (projectsGrid) {
      const projectCards = projectsGrid.querySelectorAll('.project-card');
      projectCards.forEach((card, index) => {
        if (!this.animatedElements.has(card)) {
          card.classList.add('animate-on-scroll', 'zoom-in');
          card.dataset.delay = index * 100;
          this.observer.observe(card);
        }
      });
    }
  }

  // Add parallax effect to hero section
  addParallaxEffect() {
    const hero = document.querySelector('#card2');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const scrollAnimations = new ScrollAnimations();
  
  // Make scrollAnimations globally accessible
  window.scrollAnimations = scrollAnimations;
  
  // Add parallax effect
  scrollAnimations.addParallaxEffect();
  
  // Trigger initial animations for above-the-fold content
  setTimeout(() => {
    scrollAnimations.triggerAnimation('#card2');
  }, 500);
  
  // Watch for projects to be loaded and refresh animations
  const checkForProjects = () => {
    const projectsGrid = document.querySelector('#projects-grid');
    if (projectsGrid && projectsGrid.children.length > 0) {
      setTimeout(() => {
        scrollAnimations.refreshProjectAnimations();
      }, 500);
    } else {
      // Check again after a short delay
      setTimeout(checkForProjects, 1000);
    }
  };
  
  // Start checking for projects
  setTimeout(checkForProjects, 2000);
});

// Handle page load animations
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
