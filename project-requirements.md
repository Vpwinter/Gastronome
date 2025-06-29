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

### ✅ Version 1 (COMPLETED 🎉)

- [x] 📄 **Recipe CRUD**
  - Title, Author, Picture (optional), Keywords
  - Ingredients with standardized measurements, Steps, Time, Amount Served
  - Love 💖, Rating ⭐, Comments 💬
  - Global discovery with copy functionality
- [x] 📚 **Book CRUD**
  - Group recipes into books
  - Categories and keywords
  - Smart copy to existing/new books
- [x] 🎨 **UI/UX Foundation**
  - 4 themes (Light, Dark, Cozy, Seasonal)
  - Responsive design with shadcn/ui
  - Navigation, forms, dialogs, and detail views
- [x] 🏗️ **Technical Architecture**
  - Next.js 15 + TypeScript
  - Zustand state management
  - localStorage persistence
  - Vercel deployment ready

### 🟡 Version 2 (IN DEVELOPMENT 🚧)

- [ ] 🧪 **Ingredient Recommender**
  - Smart ingredient-based recipe suggestions
  - Fuzzy matching algorithm for ingredient names
  - "What can I make?" functionality
  - Recipe compatibility scoring
- [ ] 🔁 **Ingredient Substitution Wizard**
  - Common cooking substitutions database
  - Allergen-friendly alternatives
  - Measurement ratio calculations
  - Context-aware suggestions (baking vs cooking)
- [ ] 📏 **Measurement Converter Wizard**
  - Convert between metric/imperial systems
  - Volume, weight, temperature conversions
  - Cooking-specific conversions (cups to grams)
  - Quick conversion tools in recipe forms

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
- [x] Global Discovery + User Library Sync (Spotify-style)
- [x] Wizard/popover-based interactions
- [x] Persistent data via `localStorage`
- [x] Standardized cooking measurements system
- [x] Smart copy/move operations between global and personal content
- [ ] Measure Converter & Ingredient Substitution 🧮🧂 (Version 2)
- [ ] Ingredient-based recipe recommendations 🔍 (Version 2)
- [ ] Cooking assistance tools and wizards 🧙‍♂️ (Version 2)

---

## 🧪 Testing

- [ ] Unit Tests: Components, Zustand logic
- [ ] Integration Tests: Data flow, CRUD actions
- [ ] E2E Tests: User flows (Playwright/Cypress)
- [ ] CI: Ensure all tests pass before deploy

---

## 🧭 Folder Structure