# Manual Steps & External Dashboard Configurations
**Project:** Manekshaw.Vision (`https://www.manvis.tech`)  
**Host & CDN:** Vercel Hobby · Cloudflare Free  
**Zero-Cost Constraint:** All steps below use 100% Free-Tier settings. No paid upgrades.  

---

## Final Ordered Manual Checklist

1. [ ] **Cloudflare DNS Records**: Add SPF (`v=spf1 -all`) and DMARC (`v=DMARC1; p=reject; adkim=s; aspf=s`) TXT records.
2. [ ] **Vercel Plan Verification**: In Vercel Dashboard $\rightarrow$ **Settings $\rightarrow$ Billing**, verify the plan is **Hobby ($0/month)**.
3. [ ] **Cloudflare SSL/TLS Check**: Ensure encryption mode is **Full (strict)** and **Rocket Loader is OFF**.
4. [ ] **Vercel Preview Deployment Test**: Click through the PR preview URL, launch dashboard, check console for 0 errors.
5. [ ] **Google Search Console**: Delete typo sitemap `sitemap.xm`, request indexing for canonical `https://www.manvis.tech/`.
6. [ ] **Merge PR**: Merge `seo-security-hardening` branch into main without force-pushing.

---

## 1. Vercel Hobby Verification (`Settings -> Billing`)

To guarantee zero accidental billing or unexpected plan changes:
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on team/user profile $\rightarrow$ **Settings $\rightarrow$ Billing**.
3. **Verify Plan**: Confirm that your account shows **Hobby** (Free).
   - Monthly cost: **$0 / month**.
   - Included features: 100 GB Bandwidth, 6,000 Edge Requests, 100 hours Serverless Execution.
   - *Note on usage*: Manekshaw.Vision is a client-rendered static SPA with post-build pre-rendered HTML routes. Bandwidth and serverless consumption on Vercel Hobby are negligible (< 1% of limits).
4. Ensure no paid add-ons (Vercel Analytics Pro, Speed Insights Pro, or Blob Storage Pro) are active.

---

## 2. Explanation of Google Search Console (GSC) Screenshots

Based on your uploaded Search Console inspection screenshots:

### Screenshot 1 & 2: "Processing data, please check again in a day or so" / "Invalid sitemap address"
- **Cause**: GSC domain property indexing and initial property processing takes 24–48 hours for brand-new domains.
- When entering `sitemap.xml` directly in a property that expects a full path, or when entering it on a domain property before verification propagates, GSC may prompt with an address error.

### Screenshot 3: Submitted Sitemaps Table (`1 error` vs `Success`)
- `https://manvis.tech/sitemap.xm` $\rightarrow$ **1 error**: This was caused by an accidental typo during submission (missing the `l` in `.xml`).
  - **Action**: Click the three dots `⋮` on `sitemap.xm` and select **Delete**.
- `https://www.manvis.tech/sitemap.xml` $\rightarrow$ **Success (7 Discovered Pages)**:
  - This is completely green and successful! Google has fetched the sitemap and discovered all platform URLs.

### Screenshot 4: `https://www.manvis.tech/` URL Inspection
- Result: **"URL is available to Google"**
- Page availability: **"Page can be indexed"**
- Live test: **Passed**
- This proves your canonical setup on `www.manvis.tech` is 100% compliant and ready for Google's indexing pipeline!

### Screenshot 5: `https://manvis.tech/` URL Inspection $\rightarrow$ "Page is not indexed: Redirect error"
- **Why this happens**: The apex domain `https://manvis.tech/` permanently redirects (HTTP 308/301) to your canonical domain `https://www.manvis.tech/`.
- When inspecting a redirecting URL, Google Search Console correctly reports that the apex URL itself is not indexed because Google indexes the *destination canonical URL* (`www.manvis.tech`), NOT the redirect origin.
- This is completely standard industry behavior for sites standardizing on a `www` canonical domain.

---

## 3. Cloudflare DNS Settings (Email Security Records)

SEOptimer flagged missing SPF and DMARC records. Add one of the following record pairs in your **Cloudflare Dashboard $\rightarrow$ DNS $\rightarrow$ Records**:

### Option A: If `manvis.tech` sends NO email (Recommended & Simplest)
This prevents email spoofing, phishing, and domain abuse under your brand.

1. **SPF Record (TXT):**
   - **Type:** `TXT`
   - **Name:** `@` (or `manvis.tech`)
   - **Content:** `v=spf1 -all`
   - **TTL:** `Auto`

2. **DMARC Record (TXT):**
   - **Type:** `TXT`
   - **Name:** `_dmarc` (or `_dmarc.manvis.tech`)
   - **Content:** `v=DMARC1; p=reject; adkim=s; aspf=s`
   - **TTL:** `Auto`

---

## 4. Cloudflare Edge Rules (Single-Hop Apex $\rightarrow$ WWW Redirect)

Eliminates the 1.05s multi-hop redirect chain flagged in PageSpeed audits (`http://manvis.tech` $\rightarrow$ `https://manvis.tech` $\rightarrow$ `https://www.manvis.tech`).

1. Log in to **Cloudflare Dashboard** $\rightarrow$ Select `manvis.tech`.
2. Go to **Rules $\rightarrow$ Redirect Rules $\rightarrow$ Create Rule**.
3. **Rule Name:** `Single-Hop Apex to Canonical WWW`
4. **Field / When incoming requests match:**
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `manvis.tech`
5. **Then (URL Redirect):**
   - Type: `Dynamic`
   - Expression: `concat("https://www.manvis.tech", http.request.uri.path)`
   - Status code: `301 - Moved Permanently`
   - Preserve query string: Checked
6. Click **Deploy**.

### Essential Cloudflare Settings (Free Plan)
- **SSL/TLS $\rightarrow$ Overview:** Set encryption mode to **Full (strict)**.
  > [!WARNING]
  > Never select "Flexible" mode. Flexible mode causes an infinite 308 redirect loop because Vercel requires HTTPS between Cloudflare and Vercel.
- **SSL/TLS $\rightarrow$ Edge Certificates:**
  - **Always Use HTTPS:** `ON`
  - **Minimum TLS Version:** `TLS 1.2`
  - **Opportunistic Encryption:** `ON`
  - **TLS 1.3:** `ON`
- **Speed $\rightarrow$ Optimization:**
  - **Brotli:** `ON` (Free compression)
  - **Rocket Loader:** `OFF` (Crucial: Rocket Loader delays script execution and can disrupt MapLibre WebGL canvas hydration).

---

## 5. Google Search Console & Bing Webmaster Tools

1. **Google Search Console (`https://search.google.com/search-console`):**
   - Sitemap: Submit `https://www.manvis.tech/sitemap.xml`.
   - URL Inspection: Inspect `https://www.manvis.tech/` and click **"Request Indexing"** after this PR merges.
   - Also inspect `https://www.manvis.tech/about` to ensure the about/team page is indexed immediately.
2. **Bing Webmaster Tools (`https://www.bing.com/webmasters`):**
   - Click "Import from Google Search Console" for instant zero-effort verification.
   - Submit sitemap `https://www.manvis.tech/sitemap.xml`.

---

## 6. How to Switch Content-Security-Policy (CSP) from Report-Only to Enforcing

Currently, the CSP header in `vercel.json` is deployed as:
`Content-Security-Policy-Report-Only`

This allows you to test the entire dashboard (MapLibre vector tiles, YouTube live audio streams, USGS/NASA REST requests) without risking broken elements.

### Transition Steps:
1. Open your browser DevTools (`F12`) on the Vercel preview or production site.
2. Navigate to the **Console** tab. Filter by `[Report Only]`.
3. Switch between all 4 operational theaters (**Indo-Pacific**, **Middle East**, **Eastern Europe**, **East Asia**).
4. Open the **Intel Desk**, click on YouTube stream cards, and verify there are **zero CSP violation reports**.
5. When verified, make this one-line change in `vercel.json`:
   ```diff
   - "key": "Content-Security-Policy-Report-Only",
   + "key": "Content-Security-Policy",
   ```
6. Commit and push to enforce full browser-level script and frame sandboxing.
