
// Smooth scroll with sticky-nav offset + section reveal animations
(function(){
  const nav = document.querySelector('.nav');
  const OFFSET = () => (nav ? nav.offsetHeight + 16 : 80);

  // Smooth scroll handler for internal links
  function toTarget(id){
    const el = document.getElementById(id);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET();
    window.scrollTo({ top, behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      const id = href && href.slice(1);
      if(!id) return;
      e.preventDefault();
      history.pushState(null, '', href);
      toTarget(id);
    });
  });
  // If page loads with hash
  if (location.hash) {
    setTimeout(()=> toTarget(location.hash.slice(1)), 50);
  }

  // Reveal on scroll
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(ent => {
      if (ent.isIntersecting){
        ent.target.classList.add('in');
        // unobserve once revealed
        obs.unobserve(ent.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.section, .card, .shot').forEach(el=>{
    el.classList.add('reveal');
    obs.observe(el);
  });
})();
