# 🍕 Ordine Pizze

> **🌍 Altre lingue**: [English](README.md)

Visita [https://ordine-pizze.vercel.app/](https://ordine-pizze.vercel.app/) nel tuo browser.

Un moderno sistema di ordinazione pizze sviluppato con Next.js e React.

## 🚀 Funzionalità

### 🛒 Sistema di Ordini
- **Catalogo Pizze**: Vari tipi di pizze disponibili
- **Carrello**: Aggiungi più pizze, regola le quantità e rimuovi articoli
- **Note Personalizzate**: Aggiungi istruzioni speciali per ogni pizza

### 💰 Sistema Intelligente di Sconti
Sistema gerarchico di sconti con regole multiple:

1. **Sconto Disabilità** (90%) - Massima priorità
2. **Sconto Anziani** (70%) - Per 60+ anni
3. **Sconti di Gruppo**:
   - 15-20 persone: 20% di sconto
   - 21-24 persone: 30% di sconto
   - 25+ persone: 50% di sconto
4. **Sconti Bambini**:
   - Sotto i 4 anni: 50% di sconto
   - 4-11 anni: 20% di sconto
5. **Carta Fedeltà** (15%)
6. **Sconto Weekend** (10%)
7. **Sconto Cena Anticipata** (10%) - Ordini prima delle 20:00

**Prezzo Minimo**: €5.00 (applicato automaticamente)

### 🌍 Multilingue
Supporto completo per 3 lingue:
- 🇧🇷 Português
- 🇬🇧 English  
- 🇮🇹 Italiano

### 🎨 Interfaccia Moderna
- **Tema Chiaro/Scuro**: Cambio automatico o manuale
- **Design Responsivo**: Funziona perfettamente su desktop e mobile
- **Componenti Accessibili**: Basati su Radix UI
- **Esperienza Fluida**: Interfaccia intuitiva e moderna

## 🛠️ Tecnologie Utilizzate

### Frontend & Framework
- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[React 18](https://react.dev/)** - Libreria UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipizzazione statica

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componenti primitivi accessibili
- **[Lucide React](https://lucide.dev/)** - Icone moderne
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestione temi

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Gestione form
- **[Zod](https://zod.dev/)** - Validazione schema TypeScript
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integrazione Zod + RHF

### Internazionalizzazione
- **[next-intl](https://next-intl-docs.vercel.app/)** - i18n per Next.js
- **[date-fns-tz](https://github.com/marnusw/date-fns-tz)** - Manipolazione timezone

### Styling Utilities
- **[class-variance-authority](https://cva.style/)** - Varianti componenti
- **[clsx](https://github.com/lukeed/clsx)** - Utilità classi condizionali
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge intelligente classi Tailwind

### Testing & Development
- **[Jest](https://jestjs.io/)** - Framework di test
- **[@testing-library](https://testing-library.com/)** - Utilità per test
- **[ESLint](https://eslint.org/)** - Linting del codice
- **[Prettier](https://prettier.io/)** - Formattazione codice

## 📋 Prerequisiti

- **Node.js** >= 18.17.0 (raccomandato: 22.16.0)
- **npm** o **yarn**

## 🏗️ Installazione e Configurazione

### 1. Clona il repository
```bash
git clone https://github.com/ricardok/ordine-pizze
cd ordine-pizze
```

### 2. Configura versione Node.js (opzionale)
```bash
# Se usi nvm
nvm use
```

### 3. Installa le dipendenze
```bash
npm install
# oppure
yarn install
```

### 4. Esegui il progetto

#### Sviluppo
```bash
npm run dev
# oppure
yarn dev
```

Apri [http://localhost:3000](http://localhost:3000) nel tuo browser. 