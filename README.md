<div align="center">
  <img src="./client/public/logo.svg" alt="Media Kajoo Logo" width="200" />
  <br />
  <br />
  <h1>Media Kajoo</h1>
  <p><b>Premium News Portal & Content Management System (CMS)</b></p>
  <p>
    <i>A high-performance, modern digital news platform inspired by the clean aesthetics of top editorial publications.</i>
  </p>
  <br />
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  </p>
</div>

---

## Overview

**Media Kajoo** is built with a strong focus on visual excellence, editorial minimalism, and technical performance. It provides a seamless, distraction-free reading experience for users, paired with a powerful and intuitive Content Management System (CMS) for journalists and editors. 

With native mobile responsiveness, advanced data visualization, and AI-powered article summaries, Media Kajoo is ready for production environments.

## Key Features

### Public Portal
- **Premium Editorial Design:** Clean typography, minimalist layout, and focus on readability.
- **Dual-Theme Support:** Native dark and light modes with persistent user preference.
- **AI-Powered Summaries:** Integrated Google Generative AI for instant, smart article summaries.
- **Interactive Engagement:** Clap/like system, view counters, bookmarking, and native comment sections.
- **Mobile-First Experience:** Fluid design, dynamic drawer navigations, and highly optimized media handling.

### Admin Dashboard (CMS)
- **Comprehensive Management:** Manage articles, categories, comments, and media files efficiently.
- **Rich Text Editor:** Powered by Tiptap, supporting complex content structures and formatting.
- **Data-Driven Analytics:** Recharts-based interactive visualizations tracking article distribution and engagement metrics.
- **Responsive Data Tables:** Highly optimized mobile-friendly data tables with robust overflow handling.
- **Secure Authentication:** JWT-based authentication and role-based access control (RBAC).

---

## Tech Stack

This project is structured as a **Monorepo** consisting of an independently deployed frontend and backend.

### Frontend (`/client`)
- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query), Axios
- **Routing:** React Router v7
- **Editor & Charts:** Tiptap, Recharts

### Backend (`/server`)
- **Core:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Security & Validation:** Helmet, CORS, Zod, DOMPurify
- **Storage:** Multer-based local storage (extensible)
- **AI Integration:** `@google/generative-ai`

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Local or Cloud e.g., Neon.tech)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/media-kajoo.git
cd media-kajoo
```

### 2. Setup the Backend
Navigate to the server directory, install dependencies, and configure the database.

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory based on `.env.example`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/mediakajo"
JWT_SECRET="your-super-secret-key"
FRONTEND_URL="http://localhost:5173"
```

Run database migrations and seed default data:
```bash
npx prisma migrate dev
npm run db:seed
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window, navigate to the client directory, and start the development server.

```bash
cd client
npm install
npm run dev
```

---

## Default Admin Credentials (Local Test)

After running the database seed command (`npm run db:seed`), an initial admin account will be generated:

- **Email:** `admin@mediakajo.id`
- **Password:** `MediaKajo2026!`

You can use these credentials to log in to the CMS via `http://localhost:5173/admin/login`.

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/media-kajoo/issues).

<div align="center">
  <p>Built with passion for high-quality digital journalism. © 2026 Media Kajoo.</p>
</div>
