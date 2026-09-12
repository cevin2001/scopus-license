# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single static landing page (Indonesian-language) marketing licensed Scopus accounts under the brand "EduPedia". No framework, no build step, no package manager — just plain HTML/CSS/JS served as static files.

## Structure

- [index.html](index.html) — the entire page, one file, sections in document order (nav, hero, "apa itu", manfaat, siapa, contrast, testimoni, paket/pricing, kompatibilitas, closer, footer, mobile dock)
- [public/css/style.css](public/css/style.css) — all styling, organized in commented `====` banner blocks that mirror the page sections
- [public/js/head.js](public/js/head.js) — loaded synchronously in `<head>`; only adds a `js` class to `<html>` so CSS can gate no-JS/JS states before first paint
- [public/js/main.js](public/js/main.js) — loaded at the end of `<body>`; runs all interactive behavior (see below)
- [public/favicon.svg](public/favicon.svg) / [public/apple-touch-icon.png](public/apple-touch-icon.png) / [public/og-image.png](public/og-image.png) — brand mark, touch icon, and link-share preview. The favicon SVG and the inline `.brand__mark` SVG in [index.html](index.html) are the same artwork duplicated; edit both together.

## Running / previewing

There is no build or dev server tooling in this repo. Open [index.html](index.html) directly in a browser, or serve the directory with any static file server (e.g. `npx serve .`) so relative asset paths resolve correctly.

## Editing conventions

- **CSS custom properties in `:root`** ([public/css/style.css](public/css/style.css)) define the entire design system: color tokens (`--blue`, `--harbour`, `--ink`, `--steel`, `--mist`, `--mint`, etc.), font stacks (`--display` = Poppins, `--body`/`--util` = Nunito), spacing (`--gutter`, `--maxw`, `--rail`), and the shared easing curve `--ease`. Change tokens here rather than hardcoding colors/fonts in section rules.
- **BEM-ish naming**: blocks like `.record`, `.plan`, `.matrix`, `.who` use `__element` and `--modifier` suffixes (e.g. `.plan--featured`, `.gate__row--open`). Follow this pattern for new components.
- **Animation is class-driven, not inline**: `main.js` toggles `is-in`, `is-open`, `is-stuck` classes; the actual transitions/keyframes live entirely in CSS. When adding a new animated element, add the reveal class (`.rise` for whole-section fade-up, `.stagger` for staggered children, `.lift` for hero cascade items with a `--d` delay custom property) in HTML and let the existing IntersectionObserver in `main.js` pick it up automatically — no new JS is needed for standard reveals.
- **`data-count` / `data-suffix` attributes** on an element trigger the count-up animation in `main.js` (see the hero stat and `record__meta` "Cited by" figure) — reuse this attribute pair for any new animated number instead of writing a new counter.
- All motion respects `prefers-reduced-motion: reduce`; both the CSS (bottom of [style.css](public/css/style.css)) and `main.js`'s `reduce` check must stay in sync if new animations are added.

## SEO

This is a marketing page, so treat the metadata as part of the product:

- The JSON-LD `@graph` at the bottom of [index.html](index.html) carries `Organization`, `Product` (one `Offer` per package), and `FAQPage` (mirroring the `.matrix` rows). Structured data must match what is visibly on the page — when a price, package, or matrix row changes, change the JSON-LD in the same edit, or Google flags the mismatch.
- Canonical, `og:url`, and `og:image` are **commented out** in the `<head>` because they require absolute URLs and no domain is chosen yet. Uncomment and replace `DOMAIN-ANDA.com` once it is. Same for the `Sitemap:` line in [robots.txt](robots.txt).
- [public/og-image.png](public/og-image.png) (1200×630) was generated programmatically with Pillow rather than drawn by hand; regenerate rather than hand-edit if the offer changes.

## Content notes

- Copy is in Bahasa Indonesia; keep new copy consistent in tone and language unless told otherwise.
- Checkout runs through WhatsApp, not a cart: each `.plan` CTA in [index.html](index.html) is a `https://wa.me/6281313537148?text=...` link whose prefilled message names that specific package and price. When a package name or price changes, update the encoded `text=` payload too, or the lead arrives quoting the old offer. Note `+` must be encoded as `%2B` (a literal `+` in a query string decodes to a space).
- Testimonial images and pricing bundle amounts are content data embedded directly in the HTML (see the `.shots` figures and `.plans` section) — update in place rather than externalizing to a data file, since there's no build step to consume one.
