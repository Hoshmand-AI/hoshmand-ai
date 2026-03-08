# Hoshmand AI Website

A premium, responsive website for Hoshmand AI — an independent AI studio focused on building calm, human-centered products.

**Live domain:** [hoshmand.ai](https://hoshmand.ai)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Domain:** Squarespace DNS → Vercel

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 3. Build for production

```bash
npm run build
```

---

## Waitlist Form Setup

The site includes a waitlist form for MindCue launch notifications. Choose one option:

### Option A: Formspree (Recommended)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID (e.g., `xyzabcde`)
4. Add to your environment:

```bash
# .env.local
FORMSPREE_FORM_ID=xyzabcde
```

### Option B: ConvertKit

1. Create a form at [convertkit.com](https://convertkit.com)
2. Get your Form ID and API Key
3. Add to your environment:

```bash
# .env.local
CONVERTKIT_FORM_ID=your_form_id
CONVERTKIT_API_KEY=your_api_key
```

### Option C: Direct URL

Set a direct form action URL:

```bash
# .env.local
NEXT_PUBLIC_WAITLIST_ACTION=https://formspree.io/f/your_form_id
```

---

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hoshmand-ai.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Environment Variables:** Add your Formspree/ConvertKit keys
5. Click "Deploy"

### Step 3: Add Custom Domain

1. In Vercel: **Project Settings** → **Domains**
2. Add domains:
   - `hoshmand.ai` (primary)
   - `www.hoshmand.ai`

---

## DNS Configuration (Squarespace → Vercel)

⚠️ **IMPORTANT:** You have Google Workspace email on this domain. Do NOT modify MX, SPF, DKIM, or DMARC records.

### Step 1: Go to Squarespace DNS Settings

1. Log in to Squarespace
2. Go to **Settings** → **Domains** → **hoshmand.ai** → **DNS Settings**

### Step 2: Add Vercel Records

Add these records (leave existing Google Workspace records untouched):

| Type  | Host | Value                   | TTL     |
|-------|------|-------------------------|---------|
| A     | @    | `76.76.21.21`          | Default |
| CNAME | www  | `cname.vercel-dns.com` | Default |

### Step 3: Remove Conflicting Records

**Only remove** A records for `@` that point to Squarespace servers (not `76.76.21.21`).

**DO NOT remove:**
- MX records (Google Workspace email)
- TXT records containing SPF, DKIM, or DMARC
- Any Google-related records

### Step 4: Verify in Vercel

1. Wait 5–30 minutes for DNS propagation
2. In Vercel, check that domains show "Valid Configuration"
3. Set `hoshmand.ai` as primary domain
4. Enable "Redirect www to non-www" (optional)

### Step 5: Test

- ✅ https://hoshmand.ai loads the site
- ✅ https://www.hoshmand.ai redirects to root
- ✅ Email still works (send a test to support@hoshmand.ai)

---

## Google Workspace DNS Records (Reference)

Your domain should have these records for email to work:

```
MX Records:
  Priority 1:  ASPMX.L.GOOGLE.COM
  Priority 5:  ALT1.ASPMX.L.GOOGLE.COM
  Priority 5:  ALT2.ASPMX.L.GOOGLE.COM
  Priority 10: ALT3.ASPMX.L.GOOGLE.COM
  Priority 10: ALT4.ASPMX.L.GOOGLE.COM

TXT Records:
  SPF:   v=spf1 include:_spf.google.com ~all
  DKIM:  (your google._domainkey record)
  DMARC: v=DMARC1; p=quarantine; ... (if configured)
```

---

## Project Structure

```
hoshmand-ai/
├── app/
│   ├── layout.tsx        # Root layout with nav/footer
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles + Tailwind
│   ├── products/         # Products page
│   ├── mindcue/          # MindCue product page
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   └── api/
│       └── waitlist/     # Waitlist API endpoint
├── components/
│   ├── Container.tsx
│   ├── Navbar.tsx        # Responsive nav with mobile menu
│   ├── Footer.tsx
│   ├── SectionTitle.tsx
│   ├── ProductCard.tsx
│   └── WaitlistForm.tsx  # Email capture form
├── lib/
│   └── site.ts           # Site configuration
├── public/               # Static assets
├── .env.example          # Environment variables template
└── package.json
```

---

## Customization

### Update Site Info

Edit `lib/site.ts`:

```typescript
export const site = {
  name: "Hoshmand AI",
  domain: "hoshmand.ai",
  supportEmail: "support@hoshmand.ai",
  founderName: "Ahmad Nesar Sediqzada",
  linkedinUrl: "https://linkedin.com/in/ahmadsediqzada",
  // ...
};
```

### Modify Colors/Styling

Edit `app/globals.css` for:
- Aurora gradient backgrounds
- Button styles (`.btn-primary`, `.btn-secondary`)
- Card styles (`.card`)
- Input styles (`.input`)

### Add New Products

1. Add a new card in `app/products/page.tsx`
2. Create a new page at `app/[product-name]/page.tsx`

---

## Performance

The site is optimized for:

- ⚡ Fast load times (static generation)
- 📱 Mobile-first responsive design
- ♿ Accessibility (ARIA labels, focus states)
- 🔍 SEO (meta tags, Open Graph)

---

## Support

- **Email:** support@hoshmand.ai
- **LinkedIn:** [Ahmad Nesar Sediqzada](https://linkedin.com/in/ahmadsediqzada)

---

© 2025 Hoshmand AI. All rights reserved.
