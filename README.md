<<<<<<< HEAD
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

=============================================================================================

# 🎨 Studio - Software Product Showcase

A premium portfolio platform to showcase your software products and capture high-intent leads.

## ✨ Features

- 🎯 **Premium Landing Page** - Hero section with featured projects
- 🖼️ **Interactive Project Cards** - Image sliders, tech stack, live stats
- 🪟 **Full-Screen Project Modals** - Detailed project showcases
- 📊 **Analytics Dashboard** - Track views, clicks, and engagement
- 👥 **Lead Management** - Capture and manage client inquiries
- 🔐 **Secure Admin Panel** - Protected routes for 4-5 admins
- ⚡ **Lightning Fast** - Built with Next.js 14, optimized for performance

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth.js
- **Storage:** Supabase Storage
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd studio
```

2. **Install dependencies**
```bash
   npm install
```

3. **Setup environment variables**
```bash
   cp .env.example .env.local
```
   
   Fill in your Supabase credentials in `.env.local`

4. **Setup database**
```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
```

5. **Run development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin Credentials
```
Email: admin1@studio.com
Password: Admin@123
```

**⚠️ Change these immediately in production!**

## 📁 Project Structure
```
studio/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Core logic & config
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data script
└── public/               # Static assets
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically:
- Run `prisma generate`
- Build the Next.js app
- Deploy to edge network

## 📊 Usage

### Adding a Project

1. Login to `/login`
2. Go to "Projects" → "Add New"
3. Fill in details, upload images
4. Click "Publish"

### Viewing Analytics

1. Go to Admin Dashboard
2. See total views, clicks, leads
3. View per-project statistics

### Managing Leads

1. Go to "Leads" in admin panel
2. View all contact submissions
3. Update status (New → Contacted → Closed)

## 🔒 Security

- Password hashing with bcrypt
- HTTP-only cookies for sessions
- Protected API routes
- SQL injection protection (Prisma)
- XSS protection (React)
- Security headers configured

## 📝 License

MIT

## 💬 Support

For issues or questions, contact: your@email.com
=======
# Studio_Portfolio
A website to flaunt your work to employers, Portfolio Site

Tools Used for Assistance:
Claude AI, Chat GPT, Youtube Course(Apna College)
>>>>>>> 72b2e31a87af256b4809ccecb3ac3293d2b88843
