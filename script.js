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
  
  // Validate at least one certificate is selected
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