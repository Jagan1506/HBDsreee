const pages = [...document.querySelectorAll('.page')];
const heroTitle = document.querySelector('#hero-title');
const touchBurst = document.querySelector('#touch-burst');
let currentPage = 0;
let confettiTimer;

function splitTitle() {
  const text = 'Happy Birthday Sree';
  heroTitle.innerHTML = [...text].map((letter, index) => {
    const safeLetter = letter === ' ' ? '&nbsp;' : letter;
    return `<span class="letter" style="animation-delay:${index * 45}ms">${safeLetter}</span>`;
  }).join('');
}

function setPage(nextPage) {
  if (nextPage <= currentPage || nextPage >= pages.length) return;
  const oldPage = pages[currentPage];
  const newPage = pages[nextPage];
  oldPage.classList.add('is-leaving');
  oldPage.setAttribute('aria-hidden', 'true');
  oldPage.setAttribute('inert', '');
  newPage.classList.add('is-active');
  newPage.removeAttribute('aria-hidden');
  newPage.removeAttribute('inert');
  currentPage = nextPage;
  window.setTimeout(() => oldPage.classList.remove('is-active', 'is-leaving'), 850);
  if (currentPage === 2) stopAmbientConfetti();
}

function startAmbientConfetti() {
  if (typeof window.confetti !== 'function') return;
  confettiTimer = window.setInterval(() => {
    window.confetti({
      particleCount: 3,
      angle: Math.random() * 50 + 65,
      spread: 38,
      startVelocity: 18,
      gravity: 0.7,
      ticks: 130,
      origin: { x: Math.random() * 0.9 + 0.05, y: -0.02 },
      colors: ['#ffb285', '#f77e8a', '#f9dfb4', '#c7e8df']
    });
  }, 850);
}

function stopAmbientConfetti() {
  if (confettiTimer) window.clearInterval(confettiTimer);
}

function showTouchBurst(event) {
  touchBurst.style.left = `${event.clientX}px`;
  touchBurst.style.top = `${event.clientY}px`;
  touchBurst.classList.remove('is-active');
  void touchBurst.offsetWidth;
  touchBurst.classList.add('is-active');
}

function attachMemoryCards() {
  const lightbox = document.querySelector('#memory-lightbox');
  const lightboxCard = document.querySelector('.lightbox-card');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxMessage = document.querySelector('#lightbox-message');
  const closeLightbox = () => {
    lightbox.classList.remove('is-visible');
    lightbox.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => {
      lightboxImage.removeAttribute('src');
      lightboxMessage.textContent = '';
      lightboxCard.classList.remove('is-portrait');
    }, 300);
  };

  document.querySelectorAll('.memory-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      showTouchBurst(event);
      lightboxImage.src = card.dataset.image;
      lightboxImage.alt = card.dataset.memory;
      lightboxMessage.textContent = card.dataset.memory;
      lightboxCard.classList.toggle('is-portrait', card.dataset.orientation === 'portrait');
      lightbox.classList.add('is-visible');
      lightbox.setAttribute('aria-hidden', 'false');
      if (typeof window.confetti === 'function') {
        window.confetti({ particleCount: 18, spread: 45, scalar: .7, origin: { x: event.clientX / innerWidth, y: event.clientY / innerHeight }, colors: ['#ffb285', '#f77e8a', '#f9dfb4'] });
      }
    });
  });
  document.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-visible')) closeLightbox();
  });
}

function openGift() {
  const giftButton = document.querySelector('#gift-button');
  const giftMessage = document.querySelector('#gift-message');
  const giftPage = document.querySelector('#page-three');
  giftButton.classList.remove('is-opening');
  void giftButton.offsetWidth;
  giftButton.classList.add('is-opening');
  window.setTimeout(() => {
    giftButton.classList.add('is-open');
    window.setTimeout(() => {
      giftPage.classList.add('gift-revealed');
      giftMessage.classList.add('is-visible');
    }, 1450);
  }, 430);
  if (typeof window.confetti === 'function') {
    window.confetti({ particleCount: 150, spread: 110, startVelocity: 35, origin: { y: .65 }, colors: ['#ffb285', '#f77e8a', '#f9dfb4', '#c7e8df'] });
  }
}

function replay() {
  window.location.reload();
}

splitTitle();
document.querySelector('#open-moments').addEventListener('click', () => setPage(1));
document.querySelector('#open-gift').addEventListener('click', () => setPage(2));
document.querySelector('#gift-button').addEventListener('click', openGift);
document.querySelector('#replay').addEventListener('click', replay);
attachMemoryCards();
window.addEventListener('load', startAmbientConfetti, { once: true });
