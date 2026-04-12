# 📰 Media Kajoo - Premium News Portal & CMS

Media Kajoo is a high-performance, modern digital news platform inspired by the clean aesthetics of Medium.com. It provides a seamless reading experience for users and a powerful, intuitive Content Management System (CMS) for creators.

## 🌟 Overview

Media Kajoo is built with a focus on **visual excellence** and **technical performance**. It features a robust editorial system, state-of-the-art styling with Tailwind CSS v4, and a fully typed architecture to ensure reliability and scalability.

## 🚀 Key Features

- **Premium Editorial Design:** Focused on typography and readability.
- **Full-Featured CMS:** Comprehensive dashboard for managing articles, categories, and site statistics.
- **Dual-Theme Support:** Native dark and light modes with persistent user preference.
- **Advanced Rich Text Editor:** Powered by Tiptap, supporting complex content structures.
- **Dynamic Image Management:** Integrated image uploading and optimized rendering.
- **SEO Ready:** Semantic HTML5 structure with dynamic metadata for maximum search engine visibility.
- **Fully Responsive:** Fluid design that works perfectly across all devices.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router 6

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) with secure cookie handling
- **Storage:** Multer-based local storage (extensible)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/media-kajoo.git
   cd media-kajoo
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   # Copy .env.example to .env and configure your DATABASE_URL
   npx prisma migrate dev
   npx tsx prisma/seed.ts
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔐 Default Credentials (Local Test)
- **Admin Email:** `admin@mediakajo.id`
- **Admin Password:** `MediaKajo2026!`

---
Built with passion for high-quality digital journalism.
