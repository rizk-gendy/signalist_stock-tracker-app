This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Test the Database Connection (Step‑by‑step)

We included a simple API route to verify your MongoDB connection using Mongoose. It performs an actual `ping` against the MongoDB admin database and returns diagnostics.

Prerequisites:
- Ensure `.env` has `MONGODB_URI` set. Example:
  ```env
  MONGODB_URI='your-mongodb-connection-string'
  ```

Steps:
1. Install dependencies (first time only):
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Test the endpoint:
   - In your browser open: http://localhost:3000/api/db-test
   - Or using curl (pretty-printed if you have jq):
     ```bash
     curl -s http://localhost:3000/api/db-test | jq .
     ```
   - Or without jq:
     ```bash
     curl -s http://localhost:3000/api/db-test
     ```

Expected successful response example (fields may vary slightly by driver):
```json
{
  "ok": true,
  "startedAt": "2025-01-01T12:00:00.000Z",
  "finishedAt": "2025-01-01T12:00:00.120Z",
  "env": "development",
  "uriPreview": "mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mydb",
  "dbName": "mydb",
  "host": "<mongo-host-or-topology>",
  "readyState": 1,
  "mongooseVersion": "9.x.x",
  "ping": { "ok": 1 }
}
```

If something goes wrong, the endpoint returns `{ ok: false, error: "..." }` with HTTP 500. Troubleshooting:
- `.env` really contains a valid `MONGODB_URI` and the app has been restarted after changing it.
- Your IP/network is allowed in MongoDB Atlas (or your MongoDB server is reachable from your machine).
- The MongoDB user has the right permissions to access the target database.
- If using SRV (mongodb+srv), ensure DNS can resolve your cluster from your network.

Quick test script (optional):
```bash
npm run db:test
```

Security note: The endpoint masks credentials when echoing the URI as `uriPreview`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
