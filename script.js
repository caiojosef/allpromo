document.addEventListener('DOMContentLoaded', () => {
  const VISIBLE = 3;
  document.querySelectorAll('.brands-carousel, .products-carousel, .brands-working-carousel')
    .forEach(initCarousel);

  function initCarousel(carousel) {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    carousel.parentNode.insertBefore(wrapper, carousel);
    wrapper.appendChild(carousel);

    const track  = carousel.querySelector('.carousel-track');
    let slides   = Array.from(track.children);
    const count   = slides.length;
    let current   = VISIBLE;
    let busy      = false;
    let interval;

    // cria buffer infinito para loop contínuo
    for (let i = 0; i < VISIBLE; i++) {
      track.append(slides[i].cloneNode(true));
      track.prepend(slides[count - 1 - i].cloneNode(true));
    }
    slides = Array.from(track.children);

    const prevBtn = createBtn('prev', () => moveTo(current - 1));
    const nextBtn = createBtn('next', () => moveTo(current + 1));
    wrapper.append(prevBtn, nextBtn);

    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-indicator';
      dot.addEventListener('click', () => moveTo(i + VISIBLE));
      nav.append(dot);
    }
    carousel.parentNode.append(nav);
    const dots = Array.from(nav.children);

    function createBtn(dir, cb) {
      const btn = document.createElement('button');
      btn.className = `carousel-btn ${dir}`;
      btn.innerHTML = dir === 'prev' ? '&#10094;' : '&#10095;';
      btn.addEventListener('click', () => { cb(); reset(); });
      return btn;
    }

    function update() {
      slides.forEach((s,i) => s.classList.toggle('active', i === current));
      const dotIndex = (current - VISIBLE + count) % count;
      dots.forEach((d,i) => d.classList.toggle('active', i === dotIndex));
    }

    function center(withTrans = true) {
      const slide = slides[current];
      const wRect = wrapper.getBoundingClientRect();
      const sRect = slide.getBoundingClientRect();
      const wC = wRect.left + wRect.width/2;
      const sC = sRect.left + sRect.width/2;
      const mat = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      const currX = mat.m41;
      const delta = wC - sC;
      track.style.transition = withTrans ? 'transform 0.5s ease' : 'none';
      track.style.transform  = `translateX(${currX + delta}px)`;
    }

    function moveTo(idx) {
      if (busy) return;
      busy = true;
      current = idx;
      update();
      center(true);
    }

    track.addEventListener('transitionend', () => {
      busy = false;
      track.style.transition = 'none';
      if (current >= count + VISIBLE) current = VISIBLE;
      else if (current < VISIBLE) current = count + VISIBLE - 1;
      update();
      center(false);
    });

    function reset() {
      clearInterval(interval);
      interval = setInterval(() => moveTo(current + 1), 3500);
    }

    update();
    center(false);
    reset();
  }

  // Variação do texto do botão principal para evitar repetição
  const textosCTA = [
    "CLIQUE AQUI E ENTRE NO GRUPO VIP",
    "Clique agora e faça parte do nosso grupo VIP!",
    "Não perca! Entre para o grupo VIP agora!",
    "Garanta sua vaga: entre no grupo VIP!",
    "Clique e junte-se ao nosso grupo VIP exclusivo!",
    "Venha para o grupo VIP e receba ofertas incríveis!",
    "Seu convite VIP está aqui — clique e entre!"
  ];
  document.querySelectorAll('.btn-join').forEach((btn, index) => {
    if (index === 0) {
      btn.textContent = textosCTA[0];
    } else {
      btn.textContent = textosCTA[Math.floor(Math.random() * textosCTA.length)];
    }
  });
});
