// ─── LOADER ───
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});

// ─── MOBILE MENU ───
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('active');
}

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || '0');
      setTimeout(() => e.target.classList.add('visible'), delay * 170);
      cardObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(el => cardObserver.observe(el));

// ─── ACTIVE NAV HIGHLIGHT ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activateLink = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--amber)' : '';
  });
};

window.addEventListener('scroll', activateLink, { passive: true });

// ─── CERTIFICATE REQUEST ───
function openCertRequest() {
  document.getElementById('certModal').style.display = 'flex';
  document.getElementById('certRequestForm').style.display = 'block';
  const oldSuccess = document.querySelector('.cert-modal-success');
  if (oldSuccess) oldSuccess.remove();
  document.getElementById('certRequestForm').reset();
}

function closeCertRequest() {
  document.getElementById('certModal').style.display = 'none';
}

document.getElementById('certModal').addEventListener('click', function(e) {
  if (e.target === this) closeCertRequest();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCertRequest();
});

async function sendCertRequest(event) {
  event.preventDefault();
  
  const form = document.getElementById('certRequestForm');
  const formData = new FormData(form);
  
  const selectedCerts = formData.getAll('certificates');
  if (selectedCerts.length === 0) {
    alert('Please select at least one certificate to request.');
    return;
  }
  
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      form.style.display = 'none';
      const successHTML = `
        <div class="cert-modal-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          <h4>Request Sent!</h4>
          <p>Thank you! Your request has been received.<br>I will review it and get back to you soon.</p>
        </div>
      `;
      form.insertAdjacentHTML('afterend', successHTML);
      setTimeout(closeCertRequest, 4000);
    } else {
      alert('Oops! Something went wrong. Please try again or email me directly at mksajid087@gmail.com');
    }
  } catch (error) {
    alert('Network error. Please check your connection and try again.');
  }
}

// ─── TYPEWRITER EFFECT ───
const words = ["Designer", "Simulator", "Analyst"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function typeEffect() {
  const currentWord = words[wordIndex];
  
  if (!isDeleting) {
    typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentWord.length) {
      setTimeout(() => {
        isDeleting = true;
        typeEffect();   // <-- continue after changing state
      }, 1500);
      return;
    }
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeEffect, 300);
      return;
    }
  }
  
  const speed = isDeleting ? 50 : 100;
  setTimeout(typeEffect, speed);
}

setTimeout(typeEffect, 1200);

// ─── THEME TOGGLE ───
function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }
})();
