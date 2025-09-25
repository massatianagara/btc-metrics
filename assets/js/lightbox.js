// Simple lightbox for the screenshot gallery
(function(){
  const shots = Array.from(document.querySelectorAll('.gallery .shot img'));
  const lb = document.getElementById('lb');
  const lbImg = lb.querySelector('.lb-img');
  const lbCap = lb.querySelector('.lb-cap');
  const btnClose = lb.querySelector('.close');
  const btnPrev = lb.querySelector('.nav.prev');
  const btnNext = lb.querySelector('.nav.next');
  const yearSpan = document.getElementById('y');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  let idx = 0;

  function open(i){
    idx = i;
    const img = shots[idx];
    lbImg.src = img.src;
    const fig = img.closest('figure');
    lbCap.textContent = fig ? (fig.querySelector('figcaption')?.textContent || '') : '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
  }
  function prev(){ open((idx - 1 + shots.length) % shots.length); }
  function next(){ open((idx + 1) % shots.length); }

  shots.forEach((img,i)=> img.addEventListener('click', () => open(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  window.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
  lb.addEventListener('click', (e)=>{ if (e.target === lb) close(); });
})();