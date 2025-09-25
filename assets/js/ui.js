// Smooth scroll with sticky-nav offset + reveal-on-scroll
(function(){
  const nav=document.querySelector('.nav');
  const OFFSET=()=> (nav? nav.offsetHeight+16:80);

  function toTarget(id){
    const el=document.getElementById(id);
    if(!el) return;
    const top= el.getBoundingClientRect().top + window.pageYOffset - OFFSET();
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href=a.getAttribute('href'); const id=href && href.slice(1);
      if(!id) return;
      e.preventDefault();
      history.pushState(null,'',href);
      toTarget(id);
    });
  });

  if(location.hash){ setTimeout(()=> toTarget(location.hash.slice(1)), 50); }

  // Reveal animation
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('in');
        obs.unobserve(ent.target);
      }
    });
  }, { rootMargin:'0px 0px -10% 0px', threshold:0.08 });

  document.querySelectorAll('.section, .card, .shot').forEach(el=>{
    el.classList.add('reveal');
    obs.observe(el);
  });
})();

// README expand/collapse with robust height animation
(function(){
  const btn  = document.getElementById('readmeMore');
  const wrap = document.getElementById('readmeWrap');
  if (!btn || !wrap) return;

  const isID    = document.documentElement.lang === 'id';
  const lblMore = isID ? 'Lihat selengkapnya' : 'Show more';
  const lblLess = isID ? 'Sembunyikan'       : 'Show less';

  wrap.classList.add('readme-anim');

  function setLabel(){ btn.textContent = wrap.classList.contains('clamp') ? lblMore : lblLess; }

  function expand(){
    const start = wrap.offsetHeight;          // current (clamped)
    wrap.classList.remove('clamp');           // un-clamp to get full height
    const end = wrap.scrollHeight;            // full height
    wrap.style.height = start + 'px';
    void wrap.offsetHeight;                   // force reflow
    wrap.style.height = end + 'px';
    wrap.addEventListener('transitionend', ()=>{ wrap.style.height=''; }, {once:true});
  }

  function collapse(){
    const start = wrap.offsetHeight;
    wrap.style.height = start + 'px';
    void wrap.offsetHeight;                   // reflow
    wrap.classList.add('clamp');              // apply clamp
    const end = wrap.offsetHeight;            // height after clamp
    wrap.style.height = end + 'px';
    wrap.addEventListener('transitionend', ()=>{ wrap.style.height=''; }, {once:true});
  }

  btn.addEventListener('click', ()=>{
    if (wrap.classList.contains('clamp')) expand(); else collapse();
    setLabel();
  });

  setLabel();
})();
