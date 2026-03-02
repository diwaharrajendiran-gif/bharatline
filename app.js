/* ============================================================
   BharatLine — app.js
   Replace YOUR_API_KEY_HERE with your rss2json.com API key
   ============================================================ */

const RSS2JSON_API_KEY = 'qxim1uscqm3hvbrxmxz7kbhnxoh04fxqegueeaew';

const FEEDS = [
  {
    name: 'Top Stories', icon: '🇮🇳',
    sources: [
      { name: 'NDTV',            url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
      { name: 'India Today',     url: 'https://www.indiatoday.in/rss/1206578' },
      { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/rss/latest-news/rssfeed.xml' },
      { name: 'Indian Express',  url: 'https://indianexpress.com/feed/' },
    ]
  },
  {
    name: 'Politics', icon: '🏛️',
    sources: [
      { name: 'NDTV India',     url: 'https://feeds.feedburner.com/ndtvnews-india-news' },
      { name: 'The Hindu',      url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
      { name: 'Indian Express', url: 'https://indianexpress.com/section/india/feed/' },
      { name: 'The Wire',       url: 'https://thewire.in/feed' },
    ]
  },
  {
    name: 'Business', icon: '📊',
    sources: [
      { name: 'Economic Times',    url: 'https://economictimes.indiatimes.com/rss.cms' },
      { name: 'Mint',              url: 'https://www.livemint.com/rss/news' },
      { name: 'Business Standard', url: 'https://www.business-standard.com/rss/latest.rss' },
    ]
  },
  {
    name: 'Tech', icon: '💻',
    sources: [
      { name: 'ET Tech',    url: 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms' },
      { name: 'NDTV Tech', url: 'https://feeds.feedburner.com/ndtvnews-tech' },
      { name: 'Inc42',     url: 'https://inc42.com/feed/' },
    ]
  },
  {
    name: 'Sports', icon: '🏏',
    sources: [
      { name: 'NDTV Cricket', url: 'https://feeds.feedburner.com/ndtvsports-cricket' },
      { name: 'NDTV Sports',  url: 'https://feeds.feedburner.com/ndtvsports-latest' },
      { name: 'HT Sports',    url: 'https://www.hindustantimes.com/rss/sports/rssfeed.xml' },
    ]
  },
  {
    name: 'Entertainment', icon: '🎬',
    sources: [
      { name: 'NDTV Entertainment', url: 'https://feeds.feedburner.com/ndtvnews-entertainment' },
      { name: 'Bollywood Hungama',  url: 'https://www.bollywoodhungama.com/rss/news.xml' },
      { name: 'India Today Ent',    url: 'https://www.indiatoday.in/rss/1206579' },
    ]
  },
  {
    name: 'South India', icon: '🌴',
    sources: [
      { name: 'The Hindu',         url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
      { name: 'Deccan Herald',     url: 'https://www.deccanherald.com/rss_feed/national_rss_feed.rss' },
      { name: 'New Indian Express',url: 'https://www.newindianexpress.com/nation/rss' },
    ]
  },
];

/* ---- State ---- */
let currentTab = 0;
let cache = {};

/* ---- Build Tabs ---- */
const tabsEl = document.getElementById('tabs');
if (tabsEl) {
  FEEDS.forEach((feed, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (i === 0 ? ' active' : '');
    btn.textContent = `${feed.icon} ${feed.name}`;
    btn.onclick = () => switchTab(i);
    tabsEl.appendChild(btn);
  });
}

function switchTab(i) {
  currentTab = i;
  document.querySelectorAll('.tab').forEach((t, idx) => t.classList.toggle('active', idx === i));
  loadFeed();
}

/* ---- Skeleton ---- */
function showSkeleton() {
  const skeletonCard = `
    <div class="skeleton">
      <div class="skel-img" style="height:155px"></div>
      <div class="skel-body">
        <div class="skel-line short"></div>
        <div class="skel-line h14"></div>
        <div class="skel-line h14" style="width:80%"></div>
        <div class="skel-line short"></div>
      </div>
    </div>`;

  const featured = `
    <div class="skeleton" style="margin-bottom:1.25rem;border-radius:4px">
      <div style="display:grid;grid-template-columns:1fr 1fr">
        <div class="skel-img" style="height:270px"></div>
        <div class="skel-body" style="padding:1.5rem 1.6rem">
          <div class="skel-line short" style="margin-bottom:1rem"></div>
          <div class="skel-line h14" style="height:22px;margin-bottom:10px"></div>
          <div class="skel-line h14" style="height:22px;width:75%;margin-bottom:20px"></div>
          <div class="skel-line"></div><div class="skel-line"></div><div class="skel-line short"></div>
        </div>
      </div>
    </div>`;

  setContent(featured + `<div class="loading-grid">${Array(6).fill(skeletonCard).join('')}</div>`, '');
}

/* ---- Helpers ---- */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const diff = (Date.now() - d) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getImage(item) {
  const t = item.thumbnail;
  if (t && typeof t === 'string' && t.startsWith('http') && t.length > 20 && !t.includes('1x1') && !t.includes('blank')) return t;
  const enc = item.enclosure?.link || item.enclosure?.url;
  if (enc && /\.(jpg|jpeg|png|webp)/i.test(enc)) return enc;
  const content = item.content || item.description || '';
  const m = content.match(/<img[^>]+src=["']([^"']{20,})["']/i);
  if (m?.[1]?.startsWith('http')) return m[1];
  return null;
}

function clean(str) {
  return (str || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ---- XML Parser (fallback) ---- */
function parseXML(xmlStr, sourceName) {
  try {
    const doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    if (doc.querySelector('parsererror')) return [];
    return Array.from(doc.querySelectorAll('item')).slice(0, 15).map(el => {
      const g = tag => el.querySelector(tag)?.textContent?.trim() || '';
      const mediaUrl = el.querySelector('media\\:content,media:content,enclosure')?.getAttribute('url') || '';
      return {
        title: clean(g('title')),
        link:  g('link') || g('guid') || '#',
        description: g('description'),
        pubDate: g('pubDate'),
        thumbnail: mediaUrl,
        _source: sourceName
      };
    }).filter(i => i.title && i.link !== '#');
  } catch(e) { return []; }
}

/* ---- Fetch with 3 proxy fallbacks ---- */
async function fetchSource(source) {
  const apiSuffix = RSS2JSON_API_KEY && RSS2JSON_API_KEY !== 'YOUR_API_KEY_HERE'
    ? `&api_key=${RSS2JSON_API_KEY}` : '';

  // 1. rss2json
  try {
    const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=15${apiSuffix}`, { signal: AbortSignal.timeout(9000) });
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'ok' && d.items?.length > 0) return d.items.map(i => ({ ...i, _source: source.name }));
    }
  } catch(e) {}

  // 2. allorigins
  try {
    const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`, { signal: AbortSignal.timeout(9000) });
    if (r.ok) {
      const d = await r.json();
      const items = parseXML(d.contents || '', source.name);
      if (items.length > 0) return items;
    }
  } catch(e) {}

  // 3. corsproxy.io
  try {
    const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(source.url)}`, { signal: AbortSignal.timeout(9000) });
    if (r.ok) {
      const xml = await r.text();
      const items = parseXML(xml, source.name);
      if (items.length > 0) return items;
    }
  } catch(e) {}

  return [];
}

/* ---- Render ---- */
function setContent(html1, html2) {
  const c1 = document.getElementById('content');
  const c2 = document.getElementById('content2');
  if (c1) c1.innerHTML = html1;
  if (c2) c2.innerHTML = html2;
}

function renderTrending(items) {
  const el = document.getElementById('trending');
  if (!el) return;
  el.innerHTML = items.slice(0, 8).map((item, i) => `
    <a class="trending-item" href="${escHtml(item.link)}" target="_blank" rel="noopener">
      <span class="trending-num">#${i+1} · ${item._source}</span>
      ${escHtml(item.title)}
    </a>`).join('');
}

function buildTicker(items) {
  const el = document.getElementById('ticker');
  if (el && items.length) el.textContent = items.slice(0, 15).map(i => `📍 ${i.title}`).join('   ·   ');
}

function renderCards(items) {
  if (!items.length) return `
    <div class="error-box">
      <h3>⚠️ Could Not Load Articles</h3>
      <p>The RSS proxy services may be temporarily rate-limited.<br>
      Please wait 30 seconds and click <strong>↻ Refresh</strong> to try again.<br><br>
      <small>Tip: Add your free rss2json.com API key in <code>js/app.js</code> for higher rate limits.</small></p>
    </div>`;

  const [top, ...rest] = items;
  const topImg = getImage(top);
  const topDesc = clean(top.description || top.content || '');

  const featured = `
  <div class="featured-card">
    <a href="${escHtml(top.link)}" target="_blank" rel="noopener">
      ${topImg
        ? `<img class="featured-img" src="${escHtml(topImg)}" alt="" loading="eager" onerror="this.outerHTML='<div class=\\'featured-placeholder\\'>📰</div>'">`
        : `<div class="featured-placeholder">📰</div>`}
      <div class="featured-body">
        <div class="featured-source">${escHtml(top._source || 'News')}</div>
        <div class="featured-title">${escHtml(top.title || 'Untitled')}</div>
        ${topDesc ? `<div class="featured-desc">${escHtml(topDesc.substring(0, 220))}</div>` : ''}
        <div class="featured-meta">${timeAgo(top.pubDate)}</div>
      </div>
    </a>
  </div>`;

  // Split rest into two halves (for the in-feed ad break)
  const half = Math.ceil(rest.length / 2);
  const firstHalf  = rest.slice(0, half);
  const secondHalf = rest.slice(half);

  const makeGrid = (arr, startDelay = 0) => `
    <div class="news-grid">${arr.map((item, i) => {
      const img = getImage(item);
      const desc = clean(item.description || item.content || '');
      return `
      <div class="news-card" style="animation-delay:${(i + startDelay) * 0.04}s">
        <a href="${escHtml(item.link)}" target="_blank" rel="noopener">
          ${img
            ? `<img class="card-img" src="${escHtml(img)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>📰</div>'">`
            : `<div class="card-img-placeholder">📰</div>`}
          <div class="card-body">
            <div class="card-source">${escHtml(item._source || 'News')}</div>
            <div class="card-title">${escHtml(item.title || 'Untitled')}</div>
            ${desc ? `<div class="card-desc">${escHtml(desc.substring(0, 130))}</div>` : ''}
            <div class="card-meta">${timeAgo(item.pubDate)}</div>
          </div>
        </a>
      </div>`;
    }).join('')}</div>`;

  return { part1: featured + makeGrid(firstHalf), part2: makeGrid(secondHalf, half) };
}

/* ---- Load Feed ---- */
async function loadFeed(forceRefresh = false) {
  const feed = FEEDS[currentTab];
  const key  = feed.name;
  const btn  = document.getElementById('refreshBtn');
  const statusEl = document.getElementById('statusText');

  if (!forceRefresh && cache[key] && Date.now() - cache[key].ts < 300000) {
    const { part1, part2 } = renderCards(cache[key].items);
    setContent(part1, part2);
    renderTrending(cache[key].items);
    if (statusEl) statusEl.textContent = `${cache[key].items.length} articles · cached`;
    return;
  }

  showSkeleton();
  if (btn)      { btn.disabled = true; btn.textContent = '↻ Loading…'; }
  if (statusEl)   statusEl.textContent = `Fetching from ${feed.sources.length} sources…`;

  const results = await Promise.allSettled(feed.sources.map(fetchSource));
  let items = [];
  let ok = 0;
  results.forEach(r => { if (r.status === 'fulfilled' && r.value.length > 0) { items.push(...r.value); ok++; } });

  items.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
  const seen = new Set();
  items = items.filter(i => {
    const k = (i.title || '').slice(0, 60).toLowerCase();
    return seen.has(k) ? false : (seen.add(k), true);
  });

  if (items.length > 0) { cache[key] = { items, ts: Date.now() }; buildTicker(items); }
  renderTrending(items);

  const rendered = renderCards(items);
  if (typeof rendered === 'string') {
    setContent(rendered, '');
  } else {
    setContent(rendered.part1, rendered.part2);
  }

  if (statusEl) statusEl.textContent = items.length > 0
    ? `${items.length} articles · ${ok}/${feed.sources.length} sources · ${new Date().toLocaleTimeString('en-IN')}`
    : `No articles loaded · ${ok}/${feed.sources.length} sources responded`;

  if (btn) { btn.disabled = false; btn.textContent = '↻ Refresh'; }
}

/* ---- Init ---- */
if (document.getElementById('content')) loadFeed();
