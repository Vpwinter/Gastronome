# 🧑‍🍳 Gastronome – Recipe, Books, and Courses Manager

Chef is a no-auth cooking application designed for people who want to store, discover, and manage recipes, books, and cooking courses. It allows full CRUD on personal content, supports global discovery, and includes cooking tools like ingredient substitution and measure conversion.

## 🧱 Tech Stack

- **Framework**: Next.js (deployed on Vercel)
- **UI**: shadcn/ui
- **State**: zustand
- **Storage**: localStorage (per user)
- **Testing**: Playwright / Vitest / Testing Library
- **Styling**: Tailwind CSS with Theme Support
- **CI/CD**: GitHub Actions + Vercel

---

## 🔄 Data Structure (Scopes)

- **Global Scope**: Discover content shared by anyone
- **User Scope**: Copy & customize global content

Each object (Recipe, Book, Course) in the user scope is a copy, so edits don’t affect the original.

---

## ✅ Application Features (Roadmap)

### ✅ Version 1

- [x] 📄 **Recipe CRUD**
  - Title, Author, Picture (optional), Keywords
  - Ingredients, Steps, Time, Amount Served
  - Love 💖, Rating ⭐, Comments 💬
- [x] 📚 **Book CRUD**
  - Group recipes into books
  - Categories and keywords

### 🟡 Version 2

- [ ] 🧪 **Ingredient Recommender**
  - Add ingredients → get recipe suggestions
- [ ] 🔁 **Ingredient Substitution Wizard**
- [ ] 📏 **Measurement Converter Wizard**

### 🔵 Version 3

- [ ] 🔍 **Search Page**
  - Full-text search across ingredients, recipes, books, authors, and courses
  - Global/user scope filter
  - Sort by love
  - Link to detail pages

### 🔴 Version 4

- [ ] 🏫 **Course CRUD**
  - Group books into structured courses

### ⚪ Version 5 (Optional)

- [ ] 🧑‍🍳 **About the Chef**
  - Profile/descriptive screen

### ⚫ Version 6 (Optional)

- [ ] 📹 **Video Upload**
  - Inside recipe or book pages

---

## 🔑 Core Functionalities

- [x] Dark / Light / Cozy / Seasonal Themes 🌞🌚
- [ ] Measure Converter & Ingredient Substitution 🧮🧂
- [x] Global Discovery + User Library Sync (Spotify-style)
- [x] Wizard/popover-based interactions
- [x] Persistent data via `localStorage`

---

## 🧪 Testing

- [ ] Unit Tests: Components, Zustand logic
- [ ] Integration Tests: Data flow, CRUD actions
- [ ] E2E Tests: User flows (Playwright/Cypress)
- [ ] CI: Ensure all tests pass before deploy

---

## 🧭 Folder Structure