const button = document.querySelector('#open-letter');
const letter = document.querySelector('#letter');
const hearts = document.querySelector('#hearts');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

button.addEventListener('click', () => {
  letter.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  letter.querySelector('h2').focus({ preventScroll: true });
  letter.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });

  if (reducedMotion.matches) return;

  hearts.replaceChildren();
  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '♥';
    heart.style.setProperty('--x', `${5 + Math.random() * 90}%`);
    heart.style.setProperty('--size', `${1 + Math.random() * 1.4}rem`);
    heart.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
    heart.style.setProperty('--delay', `${index * 35}ms`);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    hearts.append(heart);
  }
});

const photos = Array.from(document.querySelectorAll('.gallery-grid a'));
const viewer = document.querySelector('#viewer');
const fullPhoto = document.querySelector('#full-photo');
const photoCount = document.querySelector('#photo-count');
let currentPhoto = 0;

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  fullPhoto.src = photos[currentPhoto].href;
  fullPhoto.alt = `Foto ${currentPhoto + 1} de nuestros recuerdos`;
  photoCount.textContent = `${currentPhoto + 1} / ${photos.length}`;
}

photos.forEach((photo, index) => {
  photo.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPhoto(index);
    viewer.showModal();
  });
});
document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1));
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});
