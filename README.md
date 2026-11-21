# CINEFILE Watchlist

A Quasar movie watchlist with Pinia state management and MockAPI for demo data,
login, and registration.

## MockAPI setup

The app uses `https://6af9b8c46d8b86fb22d72f31.mockapi.io/api` by default.
Create one resource named `item` in the MockAPI project with these fields:

- `type` (String): `user` or `movie`
- `name`, `email`, `username`, `password`, `role` (String): account records
- `userId`, `userName` (String): movie owner information
- `title`, `genre`, `description`, `poster`, `trailerUrl` (String): movie data
- `year`, `rating` (Number): movie data

The app loads records from `item` and filters by `type` in the browser. Account
records can use `email` or `username` to sign in. Set the intended account's
`role` to `admin` in MockAPI to show the admin-only controls. Registration always
creates users with `role: "user"`.

Set `VITE_API_URL` in `.env` to use a different MockAPI base URL. Start the
frontend with:

```bash
npm install
npm run dev
```

## Important security limitation

This project intentionally uses MockAPI and does not run a custom backend.
Passwords are stored as plain data in MockAPI, the browser creates a demo-only
local token, and role/ownership checks run only in the frontend. A user can
bypass those checks by calling the public MockAPI endpoint directly. Do not use
real or reused passwords, and do not treat the admin-only UI as secure access
control.

## Validation

```bash
npm run lint:check
npm run build
```

## GitHub Actions

The CI workflow runs lint checks and a production build on pushes and pull
requests targeting `main`. The deployment workflow builds the Quasar SPA and
publishes `dist/spa` to GitHub Pages on pushes to `main`.

To enable deployment, open the repository's **Settings → Pages** and set
**Build and deployment → Source** to **GitHub Actions**. The Pages build uses
the `/CINEFILE/` base path and hash-based routes; local builds keep the normal
root path and history-based routes.
