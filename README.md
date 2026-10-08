# Mohan K — Portfolio Website

A modern, responsive personal portfolio built with **pure HTML, CSS and JavaScript** — no frameworks, no build step, no dependencies.

## Files

```
portfolio/
├─ index.html              → main page (all sections)
├─ style.css               → theme tokens, layout, components, responsive rules
├─ script.js               → all interactivity (vanilla JS)
└─ assets/
   ├─ profile.png / profile.jpg   → hero photo
   ├─ Mohan-K-Resume.html         → printable resume (opens from the Resume button)
   └─ certs/                      → 4 certificate images
```

## Sections

Hero with typewriter role + photo · animated stats · About · Skills (animated bars + category cards) · Projects (filter + detail modal) · Education timeline · Certificates (lightbox) · Contact form (validation) · Footer.

## Features

- Dark **and** light theme with a toggle (choice saved in `localStorage`)
- Scroll progress bar, active-link scroll-spy, back-to-top button
- Preloader, cursor glow, floating orbs, tech marquee
- Scroll-reveal animations, animated skill bars and counters
- Project cards → detailed modal with features, tech stack and links
- Certificate gallery → full-screen lightbox
- Contact form with live validation (name, email, 10-digit mobile, subject, message)
- Fully responsive: 1440px desktop → 390px mobile, with a slide-down mobile menu
- SEO meta tags, Open Graph tags, SVG favicon, print-friendly styles

## Run locally

Just open `index.html` in a browser — that's it.
Or serve it: `python3 -m http.server 8080` then visit `http://localhost:8080`

## Deploy (free)

**Vercel** — push the folder to GitHub → vercel.com → Import → Deploy (no settings needed).
**Netlify** — drag & drop the `portfolio` folder at app.netlify.com/drop.
**GitHub Pages** — push to a repo → Settings → Pages → Branch: `main` / root.

## How to customise

| What | Where |
|---|---|
| Project list, descriptions, features, links | `script.js` → `projects` array (top of section 10) |
| Social links (GitHub, LinkedIn, X, Instagram) | `index.html` → search for `hero-socials` |
| Contact info / email / phone | `index.html` → Contact section + `script.js` → mailto fallback |
| Colours, radius, fonts | `style.css` → `:root` variables at the top |
| Hero photo | replace `assets/profile.png` (portrait, transparent or dark background looks best) |
| Certificates | replace images in `assets/certs/` (keep the same filenames) |

### Making the contact form send real emails
Right now the form validates and then hands off to the visitor's mail app (mailto). To send automatically, use a free form endpoint — in `script.js` replace the `setTimeout(...)` block inside `form.addEventListener('submit', ...)` with:

```js
fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify(data)
})
  .then(() => { status.textContent = 'Thanks! Your message has been sent.'; status.className = 'form-status ok'; })
  .catch(() => { status.textContent = 'Something went wrong. Please email me instead.'; status.className = 'form-status bad'; })
  .finally(() => { label.textContent = 'Send Message'; btn.disabled = false; form.reset(); });
```

(Formspree, Web3Forms and Getform all offer free tiers and work with plain HTML forms.)

## Notes

- Project links currently point to your old portfolio / GitHub profile — update them in the `projects` array with each project's real live URL and repo.
- The Resume button opens `assets/Mohan-K-Resume.html`, which has a **Download / Print as PDF** button (browser → Save as PDF).
