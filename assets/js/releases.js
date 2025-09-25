
// Fetch latest release badge + collapsible changelog with download counts
(async function(){
  const repo = 'massatianagara/satia-btc-metrics';
  const fmtDate = (d) => (new Date(d)).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});

  function mdToHtml(md=''){
    let h = md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/`([^`]+?)`/g,'<code>$1</code>');
    h = h.replace(/\[(.+?)\]\((https?:[^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    const items = h.split(/\r?\n/).filter(l => /^\s*[-*]/.test(l)).map(l => l.replace(/^\s*[-*]\s?/, ''));
    if (items.length) h = '<ul>' + items.map(i=>`<li>${i}</li>`).join('') + '</ul>';
    return h;
  }

  try {
    const latestResp = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (latestResp.ok){
      const latest = await latestResp.json();
      const el = document.getElementById('releaseBadge');
      if (el){
        const name = latest.name || latest.tag_name;
        const url = latest.html_url;
        const assets = latest.assets || [];
        const dl = assets.reduce((s,a)=> s + (a.download_count||0), 0);
        const date = fmtDate(latest.published_at);
        el.innerHTML = `<a class="badge" href="${url}" target="_blank" rel="noopener">
          <span class="dot"></span> Latest: <strong>${name}</strong>
          <span class="count">• ${date} • ${dl} downloads</span>
        </a>`;
      }
    }
    const allResp = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`);
    if (allResp.ok){
      const list = await allResp.json();
      const wrap = document.getElementById('changelogList');
      if (wrap){
        wrap.innerHTML = list.map(r => {
          const title = r.name || r.tag_name;
          const body = mdToHtml(r.body || '');
          const date = fmtDate(r.published_at);
          const assets = r.assets || [];
          const dl = assets.reduce((s,a)=> s + (a.download_count||0), 0);
          return `<details class="rel">
                    <summary>${title} <span style="color:var(--muted);font-weight:400">— ${date} • ${dl} downloads</span></summary>
                    <div class="body">${body || '<p>No notes</p>'}</div>
                    <p><a href="${r.html_url}" target="_blank" rel="noopener">View on GitHub →</a></p>
                  </details>`;
        }).join('');
      }
    }
  } catch (e) {
    console.warn('Release fetch failed', e);
  }
})();