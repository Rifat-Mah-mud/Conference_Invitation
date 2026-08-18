# South Asia Cardiovascular Meet 2026

A 5-page invitation-only medical congress website. Fully static HTML, CSS, and JavaScript — no framework, no backend, and no database. All page content is hardcoded HTML. The contact form will use Formspree (configured in Phase 6).

## Folder structure

```
/
├── index.html              Home
├── programme.html          Programme
├── invitation.html         Invitation
├── venue.html              Venue & Bhutan
├── contact.html            Contact
├── favicon.ico
├── README.md
└── assets/
    ├── css/style.css       Design tokens and base reset
    ├── js/main.js          Shared client-side behaviour
    └── images/             Images added in later phases
```

## Architecture

This is a static site, so classic Next.js/React layer folders are not used. Responsibilities are still separated:

| Layer | Where it lives | Role |
|---|---|---|
| Presentation | `*.html` | Markup for each page. Shared `<head>` meta, fonts, and stylesheet links live on every page. |
| Design system | `assets/css/style.css` | CSS custom properties (`:root`) and the global reset. |
| Application | `assets/js/main.js` | Shared behaviour (mobile nav, countdown timer in later phases). |
| Infrastructure | Formspree (Phase 6) | Contact form submissions only — no server or database in this project. |

## Shared `<head>` template

Every page includes:

- `charset` UTF-8 and a responsive viewport meta tag
- Meta description and Open Graph tags (`og:title`, `og:description`, `og:image`)
- Google Fonts: Playfair Display (400, 600, 700) and Lato (400, 600, 700)
- `assets/css/style.css` and `favicon.ico`

Page `<title>` and `og:title` change per page. `og:image` points at `assets/images/og-image.jpg` (add that file when images are ready).

## Local preview

Open `index.html` in a browser, or serve the folder with any static file server.
