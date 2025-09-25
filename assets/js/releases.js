(async function(){
  const repo='massatianagara/satia-btc-metrics';
  const fmt=(d)=> new Date(d).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  function mdToHtml(md=''){
    let h=md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h=h.replace(/^###\s(.+)$/gm,'<h3>$1</h3>').replace(/^##\s(.+)$/gm,'<h2>$1</h2>').replace(/^#\s(.+)$/gm,'<h1>$1</h1>');
    h=h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+?)`/g,'<code>$1</code>');
    h=h.replace(/\[(.+?)\]\((https?:[^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    h=h.replace(/```([\s\S]*?)```/g,(m,c)=>'<pre><code>'+c.replace(/</g,'&lt;')+'</code></pre>');
    h=h.replace(/^(?:-\s.+(?:\n|$))+?/gm,(b)=>{const items=b.trim().split(/\n/).map(l=>l.replace(/^[-*]\s/,''));return '<ul>'+items.map(i=>'<li>'+i+'</li>').join('')+'</ul>'});
    h=h.replace(/^(?!<h\d|<ul|<pre|<p|<li|<\/|\s*$).+$/gm,'<p>$&</p>'); return h;
  }
  try{
    const latest=await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if(latest.ok){ const r=await latest.json(); const b=document.getElementById('releaseBadge'); if(b){ const name=r.name||r.tag_name; const url=r.html_url; const dl=(r.assets||[]).reduce((s,a)=>s+(a.download_count||0),0); b.innerHTML=`<a class="badge" href="${url}" target="_blank" rel="noopener"><span class="dot"></span> Latest: <strong>${name}</strong><span class="count">• ${fmt(r.published_at)} • ${dl} downloads</span></a>`; } }
    const all=await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`);
    if(all.ok){ const list=await all.json(); const wrap=document.getElementById('changelogList'); if(wrap){ wrap.innerHTML=list.map(r=>{ const title=r.name||r.tag_name; const dl=(r.assets||[]).reduce((s,a)=>s+(a.download_count||0),0); return `<details class="rel"><summary>${title} <span style="color:var(--muted);font-weight:400">— ${fmt(r.published_at)} • ${dl} downloads</span></summary><div class="body">${mdToHtml(r.body||'')}</div><p><a href="${r.html_url}" target="_blank" rel="noopener">View on GitHub →</a></p></details>` }).join(''); } }
  }catch(e){ console.warn('GitHub fetch failed',e); }
  // README
  (async function(){ const wrap=document.getElementById('readmeWrap'); if(!wrap) return;
    try{ const r=await fetch(`https://api.github.com/repos/${repo}/readme`); if(!r.ok) throw 0; const j=await r.json(); const content=atob(j.content||''); wrap.innerHTML = mdToHtml(content); }catch(e){ wrap.innerHTML='<p class="muted">README not available.</p>'; } })();
  // Placeholders
  (function(){ const b=document.getElementById('releaseBadge'); const c=document.getElementById('changelogList'); if(b && !b.innerHTML){ b.innerHTML='<span class="badge"><span class="dot"></span> Latest: <strong>No release yet</strong> <span class="count">• publish your first GitHub Release</span></span>'; } if(c && !c.innerHTML){ c.innerHTML='<p class="muted">No releases found. Create one on GitHub to populate this section.</p>'; } })();
})();