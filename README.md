<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="60" />
</div>

# 🛠️ Admin Dashboard

A modular, scalable admin dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. Designed for managing users, complaints, contacts, and system settings with clean UI and dark mode support.

---

## 📦 Modules Implemented

### ✅ Users
- View user records
- Filter and paginate

### ✅ Complaints
- View complaints
- Filter by status
- Modal for complaint details and reply

### ✅ Contacts
- View contact records
- Filter by category and status
- Modal for contact details

### ✅ Settings
- Card-based settings dashboard
- Modal-based forms for:
  - Admin Profile
  - System Preferences
  - Category Management

---

## 🎨 Theme Switching

Supports **light and dark mode** via Tailwind's `darkMode: 'class'` strategy.

- Light mode: default white backgrounds
- Dark mode: navy blue cards, white sidebar
- Toggle button with icon
- Persistent theme via `localStorage`

---

## ⚙️ Tech Stack

- **React + Vite**
- **TypeScript**
- **Tailwind CSS v4**
- **React Icons**
- **Modular architecture**

  Notes
All modals are built with reusable patterns

Theme logic is centralized via context

Easy to extend with backend integration



