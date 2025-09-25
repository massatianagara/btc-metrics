(function(){
  const nav=document.querySelector('.nav'); const OFFSET=()=> (nav? nav.offsetHeight+16:80);
  function toTarget(id){ const el=document.getElementById(id); if(!el) return;
    const top= el.getBoundingClientRect().top + window.pageYOffset - OFFSET();
    window.scrollTo({top, behavior:'smooth'}); }
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{ const href=a.getAttribute('href'); const id=href&&href.slice(1); if(!id) return;
      e.preventDefault(); history.pushState(null,'',href); toTarget(id); });
  });
  if(location.hash){ setTimeout(()=> toTarget(location.hash.slice(1)), 50); }
  const obs=new IntersectionObserver((ents)=>{ ents.forEach(ent=>{ if(ent.isIntersecting){ ent.target.classList.add('in'); obs.unobserve(ent.target);} }) }, {rootMargin:'0px 0px -10% 0px', threshold:0.08});
  document.querySelectorAll('.section,.card,.shot').forEach(el=>{ el.classList.add('reveal'); obs.observe(el); });

  // README expand/collapse
  const btn = document.getElementById('readmeMore');
  const wrap = document.getElementById('readmeWrap');
  if (btn && wrap){
    const isID = document.documentElement.lang === 'id';
    const lblMore = isID ? 'Lihat selengkapnya' : 'Show more';
    const lblLess = isID ? 'Sembunyikan' : 'Show less';
    function update(){ const clamped = wrap.classList.contains('clamp'); btn.textContent = clamped ? lblMore : lblLess; }
    btn.addEventListener('click', ()=>{ wrap.classList.toggle('clamp'); update(); });
    update();
  }
})();