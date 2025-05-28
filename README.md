# 🍕 Ordine Pizze

> **🌍 Other languages**: [Italiano](README.it.md)

Visit [https://ordine-pizze.vercel.app/](https://ordine-pizze.vercel.app/) in your browser.

A modern pizza ordering system developed with Next.js and React.

## 🚀 Features

### 🛒 Order System
- **Pizza Catalog**: Various types of pizzas available
- **Shopping Cart**: Add multiple pizzas, adjust quantities, and remove items
- **Custom Notes**: Add special instructions for each pizza

### 💰 Intelligent Discount System
Hierarchical discount system with multiple rules:

1. **Disability Discount** (90%) - Maximum priority
2. **Senior Discount** (70%) - For 60+ years
3. **Group Discounts**:
   - 15-20 people: 20% discount
   - 21-24 people: 30% discount
   - 25+ people: 50% discount
4. **Child Discounts**:
   - Under 4 years: 50% discount
   - 4-11 years: 20% discount
5. **Loyalty Card** (15%)
6. **Weekend Discount** (10%)
7. **Early Diner Discount** (10%) - Orders before 8 PM

**Minimum Price**: €5.00 (applied automatically)

### 🌍 Multilingual
Complete support for 3 languages:
- 🇵🇹 Português
- 🇬🇧 English  
- 🇮🇹 Italiano

### 🎨 Modern Interface
- **Light/Dark Theme**: Automatic or manual switching
- **Responsive Design**: Works perfectly on desktop and mobile
- **Accessible Components**: Based on Radix UI
- **Smooth Experience**: Intuitive and modern interface

## 🛠️ Technologies Used

### Frontend & Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitive components
- **[Lucide React](https://lucide.dev/)** - Modern icons
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - TypeScript schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Zod + RHF integration

### Internationalization
- **[next-intl](https://next-intl-docs.vercel.app/)** - i18n for Next.js
- **[date-fns-tz](https://github.com/marnusw/date-fns-tz)** - Timezone manipulation

### Styling Utilities
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** - Conditional class utility
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Smart Tailwind class merging

### Testing & Development
- **[Jest](https://jestjs.io/)** - Testing framework
- **[@testing-library](https://testing-library.com/)** - Testing utilities
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 📋 Prerequisites

- **Node.js** >= 18.17.0 (recommended: 22.16.0)
- **npm** or **yarn**

## 🏗️ Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/ricardok/ordine-pizze
cd ordine-pizze
```

### 2. Configure Node.js version (optional)
```bash
# If you use nvm
nvm use
```

### 3. Install dependencies
```bash
npm install
# or
yarn install
```

### 4. Run the project

#### Development
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.