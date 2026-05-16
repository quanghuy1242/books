# books

Minimal Next.js App Router scaffold for deployment to Cloudflare via OpenNext.

## Scripts

- `pnpm dev`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm preview`
- `pnpm deploy`

## Domains

- Production: `books.quanghuy.dev`
- Preview: `books-preview.quanghuy.dev`

## Cloudflare setup

Create these resources before deploying:

- Worker names: `books` and `books-preview`
- R2 bucket: `books-incremental-cache`
- Custom domains: `books.quanghuy.dev` and `books-preview.quanghuy.dev`

## GitHub Actions secrets

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
