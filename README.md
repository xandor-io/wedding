# Elexus & Xandor — Wedding Website

Next.js 15 + React 19 + Airtable + Resend, deploying to Vercel.

## What this is

- **Public landing page** (`/`) — the save-the-date with animations, countdown, venue photo, info form CTA
- **Password gate** (`/password`) — one shared password for all guests (`antigua2027`)
- **Info form** (`/rsvp`) — collects name, email, phone, address → writes to Airtable
- **Admin dashboard** (`/admin`) — password-protected; overview stats, guest table with CSV export, bulk email composer

---

## 1. Local setup (first time)

```bash
npm install
cp .env.example .env.local
# (then fill in the values — see sections 2–4 below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the password page. Enter `antigua2027` (or whatever `SITE_PASSWORD` you set).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) — uses the admin password.

---

## 2. Set up Airtable

1. Go to [airtable.com](https://airtable.com), sign up (free tier is plenty)
2. Create a new base called **"Wedding"** (any name is fine)
3. Rename the default table to **"Guests"** and set up these fields:

| Field name | Field type | Notes |
|---|---|---|
| Name | Single line text | Primary field |
| Email | Email | |
| Phone | Phone number | |
| Address | Long text | |
| Status | Single select | Options: `info_submitted`, `invited`, `rsvp_yes`, `rsvp_no` |
| Notes | Long text | For your personal notes |
| Created | Created time | Auto — Airtable fills this in |

4. Get your credentials:
   - **API key**: go to [airtable.com/create/tokens](https://airtable.com/create/tokens), create a personal access token
     - Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`
     - Grant access to the Wedding base
   - **Base ID**: open the base → `Help` → `API documentation`. The ID is at the top (`appXXXXXXXXXXXXXX`)
5. Paste both into `.env.local`:
   ```
   AIRTABLE_API_KEY=patXXXXXXXXXXXX.XXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   AIRTABLE_TABLE_NAME=Guests
   ```

**For Elexus:** She can open airtable.com anytime, edit guest info, add notes, change statuses — changes appear in the admin dashboard automatically.

---

## 3. Set up Resend

1. [resend.com](https://resend.com) → sign up (free tier: 3,000 emails/month, 100/day — plenty for 150 guests)
2. Domains → Add domain → `elexusandxandor.com`
3. Resend shows DNS records (SPF + DKIM). Add them to your domain's DNS
   - Cloudflare: DNS tab → add each record
   - Propagation is usually 10–30 minutes
4. Once it says "Verified", create an API key (full access)
5. Into `.env.local`:
   ```
   RESEND_API_KEY=re_XXXXXXXXXXXX
   RESEND_FROM_EMAIL=hello@elexusandxandor.com
   RESEND_FROM_NAME=Elexus & Xandor
   ```

**Why a verified domain matters:** without it, emails go to spam.

---

## 4. Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Paste into `.env.local` as `AUTH_SECRET`. This signs the auth cookies — keep it secret.

---

## 5. Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/elexusandxandor.git
git push -u origin main
```

1. Go to [vercel.com/new](https://vercel.com/new), import the repo
2. Before deploying, click **Environment Variables** — paste every line from your `.env.local` (Vercel doesn't read the file, you add them in their UI)
3. Deploy. ~90 seconds later you have `elexusandxandor.vercel.app`

### Custom domain

1. Vercel → Settings → Domains → Add `elexusandxandor.com`
2. Add the DNS records Vercel shows you at your registrar
3. SSL is auto-provisioned. Done.

Every `git push` to `main` = automatic deploy. Preview URLs on every PR. One-click rollback if something breaks.

---

## 6. Updating content

| To change | Edit |
|---|---|
| Wedding names, dates, venue text | `app/page.tsx` |
| Palette | `tailwind.config.ts` + `:root` vars in `app/globals.css` |
| Venue photo | replace `public/venue.jpg` |
| Site password | `SITE_PASSWORD` in Vercel env vars → redeploy |
| Real photos in polaroids | swap the `.polaroid-photo` gradients for `<img>` tags in `app/page.tsx` |

---

## 7. Daily operations

- **Send bulk email** → `/admin/messages`. Write subject + body, select recipients (defaults to all), preview on the right, hit send. Use `{{name}}` in the body to personalize.
- **Export guest list** → `/admin/guests` → "Export CSV"
- **See recent submissions** → `/admin` dashboard

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Airtable not configured" in admin | Check `AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` in Vercel env vars, redeploy |
| Emails going to spam | Verify domain in Resend (section 3) |
| Password page won't accept right password | `AUTH_SECRET` must be set and identical across envs |
| Form submits but nothing in Airtable | Field names must match exactly (case-sensitive): Name, Email, Phone, Address, Status |

---

## Architecture notes

- **Next.js 15 App Router** — server components by default, `"use client"` where state is needed
- **JWT cookies** via `jose` — httpOnly, secure in production
- **Middleware auth** (`middleware.ts`) — runs before every page, redirects to `/password` or `/admin/login` as needed
- **Airtable** = the database. Thin wrapper in `lib/airtable.ts` — easy to swap for Postgres later if you outgrow it (you won't for a wedding)

---

Built with love, April 2026.
