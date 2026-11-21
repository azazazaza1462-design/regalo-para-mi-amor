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
