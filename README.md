# 📋 Trello Clone

A modern, full-stack Kanban board application built with **Next.js 14**, **Supabase**, and **Clerk**. Featuring drag-and-drop task management, real-time updates, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## ✨ Features

- 🔐 **Authentication** - Secure user auth with Clerk
- 📋 **Multiple Boards** - Create and manage multiple project boards
- 📝 **Task Management** - Create, edit, delete tasks with rich details
- 🎯 **Drag & Drop** - Intuitive drag-and-drop interface with dnd-kit
- 🏷️ **Priority Levels** - Low, Medium, High priority indicators
- 👤 **Assignees** - Assign tasks to team members
- 📅 **Due Dates** - Track deadlines
- 📱 **Responsive** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Clerk account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/trello-clone.git
cd trello-clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── boards/[id]/       # Individual board pages
│   └── dashboard/         # Dashboard with all boards
├── components/            # Reusable UI components
├── lib/
│   ├── services.ts       # Database operations
│   ├── hooks/            # Custom React hooks
│   └── supabase/         # Supabase config & types
└── public/               # Static assets
```

## 🏗️ Architecture

```
UI (Components) → Hooks (State Management) → Services (Database) → Supabase
```

## 📖 Documentation

For detailed documentation including:

- Complete project setup
- Database schema
- How to add new features
- Code examples

See [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🛠️ Tech Stack

| Technology   | Purpose             |
| ------------ | ------------------- |
| Next.js 14   | React framework     |
| TypeScript   | Type safety         |
| Supabase     | Database & Auth     |
| Clerk        | User authentication |
| Tailwind CSS | Styling             |
| shadcn/ui    | UI components       |
| dnd-kit      | Drag and drop       |

## 📝 License

MIT License - feel free to use this project for learning!

## 🤝 Contributing

Contributions are welcome! Please read the documentation first.

---

⭐ Star this repo if you find it helpful!
