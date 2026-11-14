# Product cards: how hoshmand.ai stays in step with the products

Each product with an address on this site publishes a public **product card**, a small JSON
description of itself. The site reads it about every 30 seconds (`lib/live.ts`) and shows it
everywhere the product appears: the home showcase and hero animation, the Products page, the
product's own page, the footer, and both modes of the Ask guide. When a product renames itself,
changes its logo, rewords what it does or ships something new, hoshmand.ai shows it within about a
minute of that product's deploy. Nobody has to edit this site.

| Product     | Card                                         | Source in the product's repo        |
|-------------|----------------------------------------------|-------------------------------------|
| RunF9       | https://runf9.ai/api/product                 | `src/lib/product-card.ts` (planora repo) |
| MailHandled | https://mailhandled.ai/api/product           | `apps/web/lib/productCard.ts`       |

SafeClaw is off the site for now (`/products/safeclaw` redirects to `/products`).

## Format (`hoshmand.product/1`)

```json
{
  "schema": "hoshmand.product/1",
  "id": "runf9",
  "name": "RunF9",
  "formerNames": ["Planora"],
  "tagline": "Construction scheduling, explained",
  "summary": "One or two sentences on what it does.",
  "url": "https://runf9.ai",
  "status": "beta | live | in-development",
  "access": "invite-only | open",
  "accessNote": "Private beta · by invitation",
  "logo": { "mark": "/brand/runf9-mark.svg", "wordmarkLight": "...", "wordmarkDark": "..." },
  "highlights": ["Up to 8 short lines"],
  "updates": [{ "date": "2026-11-13", "title": "Newest first, up to 8" }],
  "release": { "id": "0694327", "note": "Title of the deployed change", "builtAt": "ISO time" }
}
```

Only `schema` and `name` are required. Everything else falls back to the copy in `lib/projects.ts`.

## What this site trusts

Every field is checked and trimmed (`parseCard`). Logos are accepted only over https from the
card's own origin, `url` only over https, and a name only as letters, digits, spaces and
`. & ' + -`. React renders all text as text. If a card is slow (over 3.5 s), down or malformed,
the product shows its fallback copy and the page still renders.

The studio's own paragraphs about a product (problem, approach, ethics) stay here, but a rename
is applied to them too, so the old name never sits next to the new one. Former names are not shown
on the pages; they stay in the search-engine data (`alternateName`) and the guide, so a search or a
question for "Planora" still finds RunF9. `/products/planora`
redirects to `/products/runf9`; `PRODUCT_ALIASES` in `lib/projects.ts` holds such old addresses.

## Adding a product

1. In the product: serve the card at a public `GET /api/product` (no session, no database).
2. Here: add the product to `lib/projects.ts` with `appUrl` and `cardUrl`, plus fallback copy.
3. `npm run check:live`, `npm run build`.
