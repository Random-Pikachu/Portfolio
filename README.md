# Personal Portfolio :::

A minimal, dark-themed single-page developer portfolio built with **React**, **TypeScript**, and **Tailwind CSS v4**. Deployed on **Vercel**.

## ✦ Live

🔗 [random-pikachu.dev](https://random-pikachu.dev)

---

## ✦ Tech Stack

| Layer       | Technology                                       |
| ----------- | ------------------------------------------------ |
| Framework   | [React 19](https://react.dev/) + TypeScript      |
| Build       | [Vite 7](https://vite.dev/)                      |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com/)      |
| Animations  | [Framer Motion](https://motion.dev/) (scroll-triggered fade-ups) + custom text-scramble hook |
| Scrolling   | [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll) |
| Icons       | [Lucide React](https://lucide.dev/)              |
| Analytics   | [Umami](https://umami.is/) + [Vercel Analytics](https://vercel.com/analytics) |
| Deployment  | [Vercel](https://vercel.com/)                    |

---

## ✦ Sections

Everything lives on a single page (`/` — all other routes redirect home):

| Section        | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| **Hero**       | Animated text-scramble name reveal on a grid background                      |
| **About**      | Short intro with a skills badge cloud                                        |
| **Experience** | Timeline of work — KDE open source contributions (with MR links) and internships |
| **Projects**   | Bento-grid showcase of projects with tech stacks, GitHub / live / demo links |
| **Contact**    | Social links, GitHub contribution heatmap (powered by DevTrackr), and a Pikachu |

---

## ✦ Project Structure

```
Portfolio/
├── public/
│   ├── assets/                    # Project screenshots
│   ├── logo.svg                   # Favicon / logo
│   └── resume.pdf                 # Downloadable resume (linked in nav)
├── src/
│   ├── components/
│   │   ├── ContributionHeatmap.tsx  # GitHub activity heatmap via DevTrackr API
│   │   └── Navigation.tsx
│   ├── hooks/
│   │   └── useScramble.ts           # Hero text-scramble animation
│   ├── pages/
│   │   └── SinglePage.tsx           # The entire site: hero → about → experience → projects → contact
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

| #  | Project                | Description                                                        |
| -- | ---------------------- | ------------------------------------------------------------------ |
| 01 | **CodeRivals**         | Real-time 1v1 competitive coding platform with strategic power cards |
| 02 | **Astra**              | Project packages security scanner with AI-powered vulnerability fix suggestions |
| 03 | **DevTrackr**          | Go + PostgreSQL service aggregating GitHub/LeetCode/Codeforces activity into daily digests |
| 04 | **GitStory**           | AI-powered conversational GitHub repo explorer with interactive visualizations |
| 05 | **SecurePDF**          | Offline PDF DRM tool with hardware binding and time-limited access |
| 06 | **Code-Sync**          | Real-time collaborative code editor                                |
| 07 | **Sorting Visualizer** | Interactive visualization of sorting algorithms                    |

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
