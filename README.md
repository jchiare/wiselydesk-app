# Web App

Frontend for the SaaS where our users can login, view conversations and more (tbh). Uses NextJS/React and TailwindCSS.

prod link - [apps.wiselydesk.com/](https://apps.wiselydesk.com)

## Getting Started

Create a `.env.local` file with the the env vars in `.env.sample` (reach out to the team to get the actual values):

Run the development server:

```bash
npm run dev
```

## Deploy

Will be deployed on Vercel

## Database Migrations

We use [Prisma](https://www.prisma.io/) as our ORM. Note that although Prisma has built-in support for migrations, we aren't using them since they don't work well with PlanetScale which uses dev branches + merging "Deploy Requests" to manage schema changes. For more info, see ["Making schema changes with db push"](https://www.prisma.io/docs/guides/database/planetscale#differences-to-consider) in Prisma's docs about PlanetScale.

To make a new database migration (aka schema change):

- Create a new branch in [PlanetScale](https://app.planetscale.com/heybugs/wiselydesk-backend/branches)
- Get the branch's username/password and update `DATABASE_URL` in `.env.local`
- Add your schema change to `schema.prisma`
- Push it to your PlanetScale development branch - `dotenv -e .env.local -- npx prisma db push`
- Make a Deploy Request in PlanetScale, review the diff, merge it
- Migrate the dev db - update `DATABASE_URL` in `.env.local` to the dev db, run `dotenv -e .env.local -- npx prisma db push`
