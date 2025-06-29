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

### ✅ Version 2 (COMPLETED 🎉)

- [x] 🧪 **Ingredient Recommender**
  - Smart ingredient-based recipe suggestions with fuzzy matching
  - Advanced matching algorithm for ingredient names
  - "What can I make?" functionality with customizable thresholds
  - Recipe compatibility scoring with preference filters
- [x] 🔁 **Ingredient Substitution Wizard**
  - Comprehensive substitutions database (50+ common substitutions)
  - Allergen-friendly alternatives with detailed notes
  - Precise measurement ratio calculations
  - Context-aware suggestions (baking vs cooking contexts)
- [x] 📏 **Measurement Converter Wizard**
  - Complete metric/imperial conversion system
  - Volume, weight, temperature, and length conversions
  - Cooking-specific conversions with ingredient density calculations
  - Quick conversion tools accessible via floating menu
- [x] 🎁 **Bonus Features Added**
  - Ingredient substitution tooltips in recipe views
  - Floating tools menu for easy access while cooking
  - Enhanced cascade delete for book management
  - Comprehensive cooking database with 200+ conversions

### 🟡 Version 3 (NEXT PRIORITY 🎯)

- [ ] 🔍 **Improve Search on Pages**
  - Enable search by category, key words, author, amount of serves and time.
  - Sort by love, rating, date created
  - Advanced filtering and sorting options

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
- [x] Measure Converter & Ingredient Substitution 🧮🧂 (Version 2)
- [x] Ingredient-based recipe recommendations 🔍 (Version 2)
- [x] Cooking assistance tools and wizards 🧙‍♂️ (Version 2)
- [x] Smart ingredient tooltips with substitution suggestions
- [x] Floating tools menu for easy access while cooking
- [x] Comprehensive testing suite with 82 tests (Unit + Integration + E2E)

---

## 🧪 Testing

- [x] Unit Tests: Components, Zustand logic (82 tests implemented)
- [x] Integration Tests: Data flow, CRUD actions (Store + cooking data tested)
- [x] E2E Tests: User flows (Playwright complete test suite)
- [x] Test Infrastructure: Vitest + Testing Library + Playwright configured
- [x] Test Utilities: Mock factories, custom render, localStorage mocking
- [ ] CI: Ensure all tests pass before deploy (Next: GitHub Actions)

