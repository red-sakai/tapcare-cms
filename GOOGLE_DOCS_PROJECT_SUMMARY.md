# TapCare CMS Project Summary

## Project Name
TapCare CMS Landing Page

## Framework
- Next.js 16.1.6 (App Router)

## Languages and Core Technologies
- TypeScript / TSX
- React 19.2.3
- React DOM 19.2.3
- CSS with Tailwind CSS v4

## Main Dependencies Used
- next (16.1.6)
- react (19.2.3)
- react-dom (19.2.3)
- tailwindcss (^4)
- react-icons (^5.5.0)
- lenis (^1.3.17) for smooth scrolling
- leaflet (^1.9.4) for map rendering
- react-leaflet (^5.0.0) installed in the project dependencies

## Development and Build Tooling
- TypeScript (^5)
- ESLint (^9)
- eslint-config-next (16.1.6)
- @types/node (^20)
- @types/react (^19)
- @types/react-dom (^19)
- @types/leaflet (^1.9.21)
- @tailwindcss/postcss (^4)

## Implemented Sections
1. Home
2. About Us
3. Features
4. Tutorial
5. Contact (Footer)

## Notable UI/UX Features
- Sticky pill navigation bar
- Active navbar section indicator (updates on click and on scroll)
- Lenis smooth scrolling between sections
- Scroll reveal fade-in animations via IntersectionObserver
- Features carousel with swipe support and auto-advance
- Tutorial cards with section-specific images
- Contact section with map for Rizal High School

## Deployment Plan
The project will be deployed using Vercel.

### Vercel Dashboard Deployment
1. Push the project to a Git provider (GitHub, GitLab, or Bitbucket).
2. Open Vercel and create a new project.
3. Import the repository.
4. Use default Next.js build settings.
5. Deploy.

### Vercel CLI Deployment
- Install CLI: npm i -g vercel
- Initial deploy: vercel
- Production deploy: vercel --prod

## NPM Scripts
- npm run dev
- npm run build
- npm run start
- npm run lint
