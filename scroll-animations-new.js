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
