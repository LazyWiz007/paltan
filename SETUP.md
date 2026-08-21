# Setup

Two things need doing that I can't do from here, because both need you signed
in: the Google Sheet that stores the leads, and the Vercel deploy.

---

## 1. The database (a Google Sheet) — about 5 minutes

There's no separate database. The leads go straight into a Google Sheet, and a
small script on that Sheet is what receives them. Nothing to host, nothing to
pay for, and you can sort, filter and export to CSV the way you already do.

**a.** Go to <https://sheets.new> and name the file something like
`Golden AK69 — Leads`.

**b.** In that Sheet: **Extensions → Apps Script**. Delete whatever is in the
editor, paste the entire contents of [`google-apps-script.gs`](google-apps-script.gs),
and hit save.

**c.** Top right: **Deploy → New deployment**. Click the gear next to "Select
type" and choose **Web app**. Then set:

| Field | Value |
|---|---|
| Description | anything, e.g. `lead capture` |
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" sounds alarming but it only means the script can be called without a
Google login — which it has to be, since your viewers aren't signed in. The
script only ever appends a row; it can't read anything back out.

**d.** Click **Deploy**. Google will ask you to authorise it — go through
**Advanced → Go to (project name)** if it warns you about an unverified app.
That warning is about *your own* script, which is normal for a personal Apps
Script.

**e.** Copy the **Web app URL**. It ends in `/exec`.

**f.** Paste it into the project's `.env` file:

```
SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfy…/exec
```

That's it. The `Leads` tab, its headers and the frozen header row all get
created automatically on the first submission.

### What lands in the Sheet

| Timestamp | Name | Email | Source | User Agent | Referrer |
|---|---|---|---|---|---|

Someone who signs up twice **updates their existing row** rather than adding a
second one, so the Sheet stays clean and your export has no duplicates.

### If you change the script later

Apps Script does not update a live deployment when you save. You have to go
**Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy**.
The URL stays the same. This trips everyone up at least once.

---

## 2. Deploy to your domain

**a.** From the project folder:

```bash
npx vercel --prod
```

**b.** In the Vercel dashboard, under **Settings → Environment Variables**, add
both of these for Production:

- `SHEET_WEBHOOK_URL` — the `/exec` URL from step 1
- `GATE_SECRET` — a long random string; generate one with `openssl rand -hex 32`
- `NEXT_PUBLIC_SITE_URL` — your domain, e.g. `https://prompt.paritoshanand.com`

`GATE_SECRET` is what signs the cookie that unlocks `/prompt`. If it's missing
the page will error rather than let anyone through, which is the safe direction.
Changing it later signs everyone out — harmless, they just re-enter their email.

**c.** **Settings → Domains** → add your domain and follow the DNS records
Vercel gives you.

---

## 3. The QR code

Once the domain is live, tell me and I'll generate the QR for the video frame —
one gold-on-dark to match your end card, and one plain black-on-white, which
scans far more reliably against a busy background. Test it on a real phone from
across the room before you export the video.

---

## Things worth knowing

**If the Sheet write fails**, the viewer still gets the prompt and the lead is
written to the Vercel runtime log, so it can be recovered. You promised this on
video, and a Google outage shouldn't make you look like you didn't deliver. If
you'd rather it refuse instead, flip `OPEN_GATE_ON_SAVE_FAILURE` to `false` in
[`app/api/lead/route.ts`](app/api/lead/route.ts).

**To change the prompt text**, edit the template string in
[`lib/prompt.ts`](lib/prompt.ts). Nothing else needs to change. Note that the
two lines of your own notes at the top of the Doc ("I would structure this like
a briefing document…") are deliberately not included — the copied text starts at
`CONTENT IDEA GENERATOR`.

**The prompt never reaches the browser before someone signs up.** It's rendered
on the server, on a page that checks the signed cookie first, and `/prompt`
carries `noindex` so Google can't surface it either.
