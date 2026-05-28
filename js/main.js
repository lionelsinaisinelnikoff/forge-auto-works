// Forge Auto Works - Main JavaScript

// Tailwind script config (also in HTML but safe to re-run)
function initTailwind() {
  if (typeof tailwind !== 'undefined') {
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            accent: '#c2410c',
            'accent-light': '#ea580c',
          }
        }
      }
    };
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('mobile-menu');
      menuBtn.innerHTML = '<i class="fa-solid fa-times text-xl"></i>';
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('mobile-menu');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
    }
  });

  // Close mobile menu when clicking a nav link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('mobile-menu');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
    });
  });
}

// Active nav link on scroll
function initActiveNav() {
  const sections = ['services', 'about', 'gallery', 'testimonials', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobile-menu a');

  function updateActiveLink() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section && scrollY >= section.offsetTop) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach(link => {
      link.classList.remove('text-accent');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-accent');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // initial
}

// Gallery Lightbox
let currentGalleryIndex = 0;
let galleryImages = [];

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-image');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal || !modalImg) return;

  // Collect gallery data
  galleryImages = Array.from(galleryItems).map((item, index) => ({
    index,
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
    caption: item.dataset.caption || item.querySelector('img').alt
  }));

  // Open lightbox on click
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    const imgData = galleryImages[currentGalleryIndex];
    modalImg.src = imgData.src;
    modalImg.alt = imgData.alt;
    modalCaption.textContent = imgData.caption;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    const imgData = galleryImages[currentGalleryIndex];
    modalImg.src = imgData.src;
    modalImg.alt = imgData.alt;
    modalCaption.textContent = imgData.caption;
  }

  function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    const imgData = galleryImages[currentGalleryIndex];
    modalImg.src = imgData.src;
    modalImg.alt = imgData.alt;
    modalCaption.textContent = imgData.caption;
  }

  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Click outside image to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
}

// Contact form handling
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successToast = document.getElementById('success-toast');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data (could be extended to send to API)
    const formData = new FormData(form);

    // Simulate processing
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
      Sending Request...
    `;

    setTimeout(() => {
      // Hide form, show success state in toast
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Show toast
      if (successToast) {
        successToast.classList.remove('hidden');
        successToast.classList.add('toast', 'flex');

        // Auto hide after 5s
        setTimeout(() => {
          successToast.classList.remove('toast', 'flex');
          successToast.classList.add('hidden');
        }, 5200);
      } else {
        // Fallback alert if toast missing
        alert('Thank you! Your service request has been received. We will contact you within the hour.');
      }
    }, 950);
  });

  // Close toast button
  const closeToast = document.getElementById('close-toast');
  if (closeToast && successToast) {
    closeToast.addEventListener('click', () => {
      successToast.classList.remove('toast', 'flex');
      successToast.classList.add('hidden');
    });
  }
}

// Booking CTA - show phone number modal
function initBookButtons() {
  const bookButtons = document.querySelectorAll('[data-book-now]');
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('booking-modal-close');

  if (!modal) return;

  function openBookingModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // Attach to all booking buttons
  bookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  // Click on backdrop to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden') && e.key === 'Escape') {
      closeBookingModal();
    }
  });
}

// Simple year in footer
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initTailwind();
  initMobileMenu();
  initActiveNav();
  initGallery();
  initContactForm();
  initBookButtons();
  initFooterYear();

  // Optional: console log ready (dev only)
  // console.log('%c[Forge Auto Works] Static site initialized successfully.', 'color:#52525b');
});

// Bonus: Keyboard accessibility hint (Escape already handled in lightbox)
document.addEventListener('keydown', function(e) {
  if (e.key === '/' && document.activeElement.tagName === 'BODY') {
    const contact = document.getElementById('contact');
    if (contact) {
      e.preventDefault();
      contact.scrollIntoView({ behavior: 'smooth' });
      const firstInput = contact.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 700);
    }
  }
});