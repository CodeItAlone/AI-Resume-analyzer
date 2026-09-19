# EMUSER — Owner Action Checklist (Phase 8: Discovery & Submission)

This document outlines the account-level actions, external submissions, and entity signal configurations that must be performed directly by the site owner.

---

## 1. Google Search Console Setup & Verification

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select **Domain** property type.
3. Enter `emuser.app` (or your chosen production root domain).
4. Copy the generated `TXT` record string provided by Google.
5. Log into your DNS provider (e.g. Cloudflare, Namecheap, Vercel DNS) and add a new `TXT` record:
   - **Name**: `@` or root
   - **Value**: `google-site-verification=...`
6. Click **Verify** in Search Console once the DNS record propagates.

---

## 2. Submit XML Sitemap

1. In Google Search Console, navigate to **Indexing** > **Sitemaps**.
2. Under "Add a new sitemap", enter: `sitemap.xml` (full URL: `https://emuser.app/sitemap.xml`).
3. Click **Submit**.
4. Verify that the status shows **Success** and that 1 discovered page (`/`) is detected.

---

## 3. URL Inspection & Indexing Request

1. In Search Console, paste `https://emuser.app/` into the top search/inspection bar.
2. Click **Test Live URL** to confirm Googlebot can fetch and render the page cleanly.
3. Click **Request Indexing** for the homepage.

---

## 4. Bing Webmaster Tools & IndexNow Integration

1. Log into [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Click **Import from Google Search Console** for instant property verification.
3. Submit `https://emuser.app/sitemap.xml` under **Sitemaps**.
4. Navigate to **IndexNow** and click **Generate API Key**. Save the text key.
5. Place the key file at `public/<your-key>.txt` containing the key text to support automated instant indexing on Bing and Yandex.

---

## 5. Google Analytics 4 (GA4) Setup & GSC Linking

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com).
2. Obtain your GA4 Measurement ID (`G-XXXXXXXXXX`).
3. Set `NEXT_PUBLIC_GA_ID` in your production deployment environment variables.
4. In Search Console, go to **Settings** > **Associations** and link your GA4 property.

---

## 6. Real-World Entity Signals & Brand Profiles

1. **GitHub Repository**:
   - Ensure the repository README prominently links to `https://emuser.app`.
   - Update repository "Website" metadata field to point to `https://emuser.app`.
2. **Social & Directory Profiles**:
   - Create consistent brand profiles on LinkedIn / Twitter with exact matching name ("EMUSER"), description, and website URL.
   - Maintain strict consistency between on-site `Organization` schema and social profiles.
