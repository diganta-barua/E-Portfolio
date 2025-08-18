document.addEventListener('DOMContentLoaded', function () {
  // Hamburger menu functionality
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  const dropdownButton = document.querySelector('#dropdown button');
  const dropdownContent = document.querySelector('#dropdown-content');

  if (dropdownButton && dropdownContent) {
    dropdownButton.addEventListener('click', function () {
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
  }

  const menuButton = document.getElementById('menu-button');
  const nav2 = document.getElementById('nav2');

  if (menuButton && nav2) {
    menuButton.addEventListener('click', function () {
      nav2.classList.toggle('show');
    });
  }

  // PDF Popup functionality
  function openPdfPopup(pdfUrl, title) {
    const popup = document.createElement('div');
    popup.className = 'pdf-popup-overlay';
    popup.innerHTML = `
      <div class="pdf-popup">
        <div class="pdf-popup-header">
          <h3>${title}</h3>
          <button class="pdf-popup-close">&times;</button>
        </div>
        <div class="pdf-popup-content">
          <iframe src="${pdfUrl}" frameborder="0"></iframe>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    // Close popup functionality
    const closeBtn = popup.querySelector('.pdf-popup-close');
    closeBtn.addEventListener('click', closePdfPopup);
    
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closePdfPopup();
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closePdfPopup();
      }
    });
  }

  function closePdfPopup() {
    const popup = document.querySelector('.pdf-popup-overlay');
    if (popup) {
      popup.remove();
      document.body.style.overflow = 'auto';
    }
  }

  // Make functions globally available
  window.openPdfPopup = openPdfPopup;
  window.closePdfPopup = closePdfPopup;

  function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years, ${months} months, and ${days} days`;
  }

  const ageElement = document.getElementById('age');
  if (ageElement) {
    ageElement.textContent = calculateAge('2001-06-30');
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Md Abdullah Al Mubin",
    "jobTitle": "Computer Science and Engineering Student",
    "affiliation": {
      "@type": "Organization",
      "name": "American International University-Bangladesh (AIUB)"
    },
    "url": "https://github.com/mubin25-dodu",
    "sameAs": [
      "https://www.facebook.com/abdullahalmubin69",
      "https://www.instagram.com/abdullahalmubin69",
      "https://www.linkedin.com/in/abdullah-al-mubin9516"
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
});

document.addEventListener('scroll', function () {
  const nav3 = document.getElementById('nav3');
  nav3.style.top = window.scrollY > 100 ? '-60px' : '50px';
});

function addClass() {
  document.body.classList.add("sent");
}

// Custom notification function
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.custom-notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `custom-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
}

function sendmail() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("Email");
  const messageInput = document.getElementById("message");
  
  // Validate inputs
  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = document.getElementById("sendLetter");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  submitBtn.disabled = true;
  
  let params = {
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value,
  };
  
  emailjs.send("service_0jgffj7", "template_89vfg5n", params)
    .then(function(response) {
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      // Clear form
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
      document.body.classList.add("sent");
    })
    .catch(function(error) {
      showNotification('Failed to send message. Please try again.', 'error');
      console.error('EmailJS error:', error);
    })
    .finally(function() {
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

// Add event listener properly
document.addEventListener('DOMContentLoaded', function() {
  const sendButton = document.getElementById("sendLetter");
  if (sendButton) {
    sendButton.addEventListener("click", function(e) {
      e.preventDefault();
      addClass();
      sendmail();
    });
  }
});
