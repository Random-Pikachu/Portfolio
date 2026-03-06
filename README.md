# Personal Portfolio

A minimal, dark-themed developer portfolio built with **React**, **TypeScript**, and **Tailwind CSS v4**. Deployed on **Vercel**.


## ✦ Live

🔗 [random-pikachu-portfolio.vercel.app](https://random-pikachu-portfolio.vercel.app)

---

## ✦ Tech Stack

| Layer       | Technology                                       |
| ----------- | ------------------------------------------------ |
| Framework   | [React 19](https://react.dev/) + TypeScript      |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com/)      |
| Routing     | [React Router v7](https://reactrouter.com/)      |
| Scrolling   | [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll) |
| Icons       | [Lucide React](https://lucide.dev/)              |
| Animations  | CSS keyframe animations + marquee via [react-fast-marquee](https://github.com/justin-chu/react-fast-marquee) |
| Analytics   | [Umami](https://umami.is/) |
| Deployment  | [Vercel](https://vercel.com/)                    |

---

## ✦ Pages

| Route          | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `/`            | **Home** — Animated name reveal with scrolling marquee tagline              |
| `/experience`  | **Experience** — Timeline of work experience with resume-style bullet points |
| `/projects`    | **Projects** — Showcase of featured projects with tech stacks and links      |
| `/*`           | **404** — Custom not-found page                                             |

---

## ✦ Project Structure

```
Portfolio/
├── public/
│   ├── assets/            # Project screenshots
│   ├── logo.svg           # Favicon / logo
│   └── resume.pdf         # Downloadable resume
├── src/
│   ├── components/
│   │   ├── CustomCursor.tsx
│   │   ├── Footer.tsx
│   │   ├── HomeGridBackground.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── RegularGridBackground.tsx
│   │   └── RootLayout.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   └── NotFound.tsx
│   ├── index.css          
│   └── main.tsx           
├── index.html
├── vercel.json            
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ✦ Featured Projects

| #  | Project              | Description                                                       |
| -- | -------------------- | ----------------------------------------------------------------- |
| 01 | **Astra**            | Project packages security scanner with AI-powered vulnerability fix suggestions |
| 02 | **SecurePDF**        | Offline PDF DRM tool with hardware binding and time-limited access |
| 03 | **Code-Sync**        | Real-time collaborative code editor       |
| 04 | **Sorting Visualizer** | Interactive visualization of sorting algorithms                  |

---

## ✦ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Random-Pikachu/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ✦ Connect

- 📧 [sangampratapsingh21012006@gmail.com](mailto:sangampratapsingh21012006@gmail.com)
- 💼 [LinkedIn](https://linkedin.com/in/sangam21)
- 🐙 [GitHub](https://github.com/Random-Pikachu)

---

<p align="center">
  <sub>© 2025 Random-Pikachu · [ Pokedex Entry #025 ]</sub>
</p>
