# BharatLine — Launch Guide

## 📁 File Structure
```
bharatline/
├── index.html       ← Main news page
├── about.html       ← About Us page
├── privacy.html     ← Privacy Policy (required for AdSense)
├── css/
│   └── style.css    ← All styles
├── js/
│   └── app.js       ← RSS logic (add your API key here)
└── README.md        ← This file
```

---

## ✅ STEP 1 — Get Your Free RSS2JSON API Key

1. Go to **https://rss2json.com**
2. Click "Sign Up Free"
3. Verify your email
4. Go to your Dashboard → copy your **API Key**
5. Open `js/app.js` in any text editor (Notepad, VS Code)
6. Find this line near the top:
   ```
   const RSS2JSON_API_KEY = 'YOUR_API_KEY_HERE';
   ```
7. Replace `YOUR_API_KEY_HERE` with your actual key. Example:
   ```
   const RSS2JSON_API_KEY = 'abcd1234efgh5678ijkl';
   ```
8. Save the file.

**Free plan gives you 10,000 requests/day** — enough to start.

---

## ✅ STEP 2 — Upload to GitHub Pages (Free Hosting)

1. Go to **https://github.com** → Sign Up (free)
2. Click **"New Repository"**
3. Name it: `bharatline` (or any name)
4. Set it to **Public**
5. Click **"Create Repository"**
6. Upload all files:
   - Click **"uploading an existing file"**
   - Drag and drop the entire `bharatline` folder contents
   - Make sure the folder structure is preserved (css/ and js/ subfolders)
   - Click **"Commit changes"**
7. Go to **Settings → Pages**
8. Under "Source" select **"main"** branch → Click Save
9. Wait 2-3 minutes → your site will be live at:
   `https://YOUR-USERNAME.github.io/bharatline/`

---

## ✅ STEP 3 — Add a Custom Domain (Optional but Recommended for AdSense)

Google AdSense strongly prefers custom domains over github.io subdomains.

1. Buy a domain: **https://www.namecheap.com** (search for bharatline.in ~₹800/year)
2. In GitHub Pages settings → enter your custom domain (e.g. `bharatline.in`)
3. In your domain registrar's DNS settings, add:
   - Type: `CNAME` | Name: `www` | Value: `YOUR-USERNAME.github.io`
   - Type: `A` | Name: `@` | Values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Check "Enforce HTTPS" in GitHub Pages settings
5. Wait up to 24 hours for DNS to propagate

---

## ✅ STEP 4 — Apply for Google AdSense

1. Your site must be live for at least a few days with real content loading
2. Go to **https://adsense.google.com**
3. Sign in with your Google account
4. Click "Get Started" → Enter your website URL
5. Google will review your site (usually 1–14 days)

**AdSense requirements checklist:**
- ✅ Custom domain (not github.io)
- ✅ Privacy Policy page — included (privacy.html)
- ✅ About Us page — included (about.html)
- ✅ Original layout and working content
- ✅ Easy navigation
- ✅ No copied content (we aggregate, not copy ✓)

Once approved:
6. Go to AdSense → **Ads → By ad unit** → Create new ad units
7. Get your **Publisher ID** (looks like: ca-pub-1234567890123456)
8. Open `index.html` and replace `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID (4 places)
9. Replace `1111111111`, `2222222222`, `3333333333`, `4444444444` with your actual ad slot IDs

---

## ✅ STEP 5 — Update Your Contact Email

In `about.html` and `privacy.html`, replace:
```
contact@bharatline.in
```
with your actual email address.

---

## 🔧 Customisation

**Change site name:** Search and replace `BharatLine` and `BHARATLINE` across all HTML files.

**Add/remove news sources:** Open `js/app.js` and edit the `FEEDS` array. Each source needs:
```javascript
{ name: 'Source Name', url: 'https://example.com/rss.xml' }
```

**Change colours:** Open `css/style.css` and edit the `:root` variables at the top.

---

## 🆘 Troubleshooting

**Articles not loading?**
- Make sure your API key is correctly added to `js/app.js`
- The site uses 3 fallback proxies — if one fails, it tries the next automatically
- Try clicking ↻ Refresh a few times
- Check browser console (F12) for error messages

**GitHub Pages not working?**
- Make sure `index.html` is in the root of the repository (not inside a subfolder)
- Check Settings → Pages to confirm it's enabled

---

Built with ❤️ for India 🇮🇳
