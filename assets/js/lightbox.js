(function () {
  const imgs = Array.from(document.querySelectorAll('.gallery .shot img'));
  const lb = document.getElementById('lb');
  const lbImg = lb.querySelector('.lb-img');
  const lbCap = lb.querySelector('.lb-cap');
  const btnClose = lb.querySelector('.close');
  const btnPrev = lb.querySelector('.nav.prev');
  const btnNext = lb.querySelector('.nav.next');

  // footer year
  const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

  let idx = 0;

  function setSrc(i, dir) {
    const img = imgs[i];
    const src = img.currentSrc || img.src;

    // reset classes → force reflow → apply anim
    lbImg.classList.remove('swap-left', 'swap-right', 'anim-pop');
    void lbImg.offsetWidth;
    if (dir === 'prev') lbImg.classList.add('swap-left');
    else if (dir === 'next') lbImg.classList.add('swap-right');
    else lbImg.classList.add('anim-pop');

    lbImg.src = src;
    const fig = img.closest('figure');
    lbCap.textContent = fig ? (fig.querySelector('figcaption')?.textContent || '') : '';
  }

  function open(i) {
    idx = i;
    setSrc(idx);
    lb.classList.add('open');            // CSS handles fade-in
    lb.setAttribute('aria-hidden','false');
  }

  function close() {
    lb.classList.remove('open');         // CSS handles fade-out
    lb.setAttribute('aria-hidden','true');
  }

  function prev() {
    idx = (idx - 1 + imgs.length) % imgs.length;
    setSrc(idx, 'prev');
  }

  function next() {
    idx = (idx + 1) % imgs.length;
    setSrc(idx, 'next');
  }

  imgs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
})();
