const button = document.querySelector('#open-letter');
const letter = document.querySelector('#letter');
const hearts = document.querySelector('#hearts');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

button.addEventListener('click', () => {
  letter.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  letter.querySelector('h2').focus({ preventScroll: true });
  letter.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });

  celebrate();
});

function celebrate() {
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
}

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

document.querySelector('#random-photo').addEventListener('click', () => {
  showPhoto(Math.floor(Math.random() * photos.length));
  viewer.showModal();
});

document.querySelectorAll('.tilt, .gallery-grid a').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 15}deg`);
    card.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 15}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
});

const playMusic = document.querySelector('#play-music');
playMusic.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.title = 'The Fray — You Found Me (video oficial de YouTube)';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture';
  frame.allowFullscreen = true;
  frame.src = 'https://www.youtube.com/embed/jFg_8u87zT0?autoplay=1&playsinline=1&loop=1&playlist=jFg_8u87zT0';
  const player = document.querySelector('#music-player');
  player.hidden = false;
  player.replaceChildren(frame);
  playMusic.hidden = true;
  frame.focus();
}, { once: true });

const board = document.querySelector('#memory-board');
const memoryStatus = document.querySelector('#memory-status');
const pairCount = 4;
let firstCard;
let pendingTurn;
let attempts;
let matches;

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

function setCardVisible(card, visible) {
  card.classList.toggle('revealed', visible);
  card.setAttribute('aria-pressed', String(visible));
  card.setAttribute('aria-label', visible ? `Foto ${card.dataset.pair}` : `Tarjeta ${card.dataset.position}`);
}

function updateMemoryStatus() {
  memoryStatus.textContent = matches === pairCount
    ? `¡Encontraste todas las parejas en ${attempts} intentos! ♥`
    : `${matches} de ${pairCount} parejas · ${attempts} intentos`;
}

function flipCard(card) {
  if (pendingTurn || card === firstCard || card.disabled) return;
  setCardVisible(card, true);
  if (!firstCard) {
    firstCard = card;
    return;
  }

  const previous = firstCard;
  firstCard = null;
  attempts += 1;
  if (card.dataset.pair === previous.dataset.pair) {
    previous.disabled = true;
    card.disabled = true;
    matches += 1;
    const nextCard = board.querySelector('.memory-card:enabled');
    (nextCard || document.querySelector('#reset-memory')).focus({ preventScroll: true });
    if (matches === pairCount) celebrate();
  } else {
    pendingTurn = setTimeout(() => {
      setCardVisible(previous, false);
      setCardVisible(card, false);
      pendingTurn = undefined;
    }, 850);
  }
  updateMemoryStatus();
}

function resetMemory() {
  clearTimeout(pendingTurn);
  pendingTurn = undefined;
  firstCard = null;
  attempts = 0;
  matches = 0;
  const selected = shuffled(photos).slice(0, pairCount);
  const pairs = selected.map((photo, index) => ({ photo, number: index + 1 }));
  board.replaceChildren(...shuffled([...pairs, ...pairs]).map(({ photo, number }, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'memory-card';
    card.dataset.pair = number;
    card.dataset.position = index + 1;
    const faces = document.createElement('span');
    faces.className = 'memory-faces';
    faces.setAttribute('aria-hidden', 'true');
    const back = document.createElement('span');
    back.textContent = '♥';
    const image = document.createElement('img');
    image.src = photo.href;
    image.alt = '';
    faces.append(back, image);
    card.append(faces);
    setCardVisible(card, false);
    card.addEventListener('click', () => flipCard(card));
    return card;
  }));
  updateMemoryStatus();
}

document.querySelector('#reset-memory').addEventListener('click', resetMemory);
resetMemory();
