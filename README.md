# Axiom Freight — Sea Freight Estimator

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript)

A modern, highly responsive Single Page Application built for calculating LCL (Less than Container Load) sea freight estimates. 

**Live Demo:** [https://axiom-freight.vercel.app/](https://axiom-freight.vercel.app/)

---

## 🚀 Overview
This application takes shipment details (Gross Weight, Volume, and Documentation requirements) and instantly calculates the chargeable weight and final freight cost for the **Guangzhou → Jebel Ali** lane. 

## ✨ Key Features & UX Enhancements
- **Clean, Premium UI:** A dark-themed design system using modern typography (`Bebas Neue` & `DM Sans`), subtle gold accents, and a custom CSS Grid layout.
- **Micro-Animations:** Built a custom `useCountUp` React hook utilizing `requestAnimationFrame` and cubic-easing for buttery-smooth 60fps number counting during calculations.
- **Fully Responsive:** Adapts seamlessly from ultra-wide desktop monitors down to mobile viewports without breaking the flow.
- **Form Validation:** Real-time safeguards ensure inputs are valid numbers greater than zero before processing the quote.

## 🏗️ Architecture & Technical Decisions
- **Next.js App Router (SSR + CSR Separation):** 
  - The static page shell (`page.tsx`) including the header, hero section, route banner, and footer are completely **Server-Side Rendered (SSR)**. This ensures an instant First Contentful Paint (FCP) and heavily boosts SEO metrics.
  - The calculator logic and state (`FreightCalculator.tsx`) is explicitly isolated as a **Client Component boundary**, keeping the interactive JavaScript payload as tiny as possible.
- **Tailwind CSS v4:** Leveraged the newest iteration of Tailwind, integrated cleanly via PostCSS for minimal bundle sizes and CSS variable architecture.
- **Modular Configuration:** Extracted magic numbers and shared static data to `lib/constant.ts` to keep the components clean and maintainable.

## 🧮 Calculation Logic
The application accurately implements the following required business logic:
1. **Weight to CBM:** `Weight ÷ 500`
2. **Chargeable CBM:** `Math.max(Weight CBM, Actual Volume)` (UI clearly tags which metric was used).
3. **Freight Cost:** `Chargeable CBM × $265`
4. **Documentation Fee:** `+$150` if the user toggles the local documentation switch.

---

## 💻 Getting Started (Local Development)

First, clone the repository and install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# Note: Ensure port 3000 is available
```

Open [http://localhost:3000](http://localhost:3000) with your browser to interact with the application.

## 🌐 Deployment
This project is optimized for deployment on Vercel. 
To deploy, simply push the repository to GitHub and import it into Vercel. Next.js is automatically detected and requires zero additional build configuration.
