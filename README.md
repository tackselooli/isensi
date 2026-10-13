<div align="center">

# 🧘‍♀️ isensi

### The fitness platform that was left for dead — and came back stronger.

**A bilingual (Persian / English) MERN-stack fitness studio app with role-based dashboards, class booking, articles, cart & checkout.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://github.com/tackselooli/isensi)
[![Bilingual](https://img.shields.io/badge/Bilingual-FA%20%7C%20EN-FFD166?style=for-the-badge)](https://github.com/tackselooli/isensi)
[![License](https://img.shields.io/badge/License-MIT-21295C?style=for-the-badge)](https://github.com/tackselooli/isensi)

</div>

---

## ✨ What Makes isensi Special?

| Feature               | What It Actually Means                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- |
| 🌍 **True Bilingual** | Not a half-baked toggle. Full RTL/LTR layout flip, persisted in `localStorage`, instant. |
| 🌗 **Dual Themes**    | Light & dark mode, synced across site and dashboard separately.                          |
| 📊 **Live Dashboard** | 6 stat cards, 3 real-time charts, recent-activity feed. Not a static mockup.             |
| 🛒 **Full Cart Flow** | Add → list → discount → checkout, with Zarinpal payment gateway ready.                   |
| 🔐 **JWT Auth**       | HTTP-only cookie + Bearer header, role-based access (`user`, `instructor`, `admin`).     |
| 📱 **Mobile-First**   | Responsive down to the pixel, with smooth `framer-motion` animations.                    |

---

## 🖼️ Screenshots

### Home Page — Hero Section

<!-- Add your screenshot here -->

### Dashboard — Admin Overview

<!-- Add your screenshot here -->

> _The actual running app looks even better — these are AI-generated mockups that approximate the real UI._

---

## 🛠️ Tech Stack (The Good Stuff)

| Layer        | What's Under the Hood                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React 18 · Vite 4 · Redux Toolkit · React Router 6 · MUI 5 · Tailwind 3 · Framer Motion · Recharts · Swiper · Axios |
| **Backend**  | Node.js · Express 4 · MongoDB Native Driver · Joi · JWT · bcrypt · Cloudinary                                       |
| **Tooling**  | ESLint · PostCSS · Autoprefixer · Nodemon · Vite HMR                                                                |
| **Payments** | Zarinpal (Iranian gateway, ready to go)                                                                             |
| **Deploy**   | Vercel-ready (`vercel.json` included)                                                                               |

---

## 📁 Project Structure

```
fit/
├── backend/
│   ├── config/            # cors, jwt, cloudinary, mongoose, db
│   ├── controllers/       # auth, user, class controllers
│   ├── middlewares/       # verifyJWT, verifyAdmin, verifyInstructor, errorHandler
│   ├── models/            # Joi schemas (user, class, article, instructor)
│   ├── routes/            # authRoutes, userRoutes
│   ├── .env.example       # copy → .env and fill secrets
│   └── index.js           # main entry — all routes wired here
│
├── frontend/
│   ├── const-config.jsx   # static config: nav, banners, sidebar, gallery
│   ├── public/            # logos, splash assets, data.json
│   └── src/
│       ├── app/store.js           # Redux store
│       ├── i18n/translations.js   # Persian + English strings
│       ├── features/              # Redux slices
│       │   ├── auth/
│       │   ├── cart/
│       │   ├── classes/
│       │   ├── users/
│       │   ├── articles/
│       │   ├── theme/
│       │   └── language/
│       ├── hooks/                 # useAuth, useLanguage, useAxiosFetch, useAxiosSecure
│       ├── components/            # NavBar, Footer, Sidebar, SectionHeading, Pagination
│       ├── layout/                # MainLayout, DashboardLayout
│       ├── pages/
│       │   ├── Home/              # Hero, Gallery, FAQ, BMI, Articles
│       │   ├── Dashboard/         # Dashboard.jsx + admin + user subpages
│       │   ├── classes/           # Classes listing
│       │   ├── detailClass/       # Single class detail
│       │   ├── ArticlesPage/      # Articles listing
│       │   ├── detailArticles/    # Single article detail
│       │   ├── PopularClasses/    # Homepage popular classes section
│       │   ├── cartPage/          # Shopping cart
│       │   ├── products/          # Products page
│       │   ├── LoginPage/         # Auth pages
│       │   ├── Register/
│       │   ├── Instructors.jsx    # Instructors grid
│       │   └── NotFound.jsx       # 404 page
│       └── routes/router.jsx      # all routes wired here
│
└── README.md              # you are here ✨
```

---

## ⚡ Quick Start (Get It Running in 2 Minutes)

### Prerequisites

| Requirement | Recommended |
| ----------- | ----------- |
| Node.js     | 20 LTS      |
| npm         | 7.0+        |
| MongoDB     | 10+         |

### 1️⃣ Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit ACCESS_SECRET and other secrets
npm start               # nodemon index.js → http://localhost:3000
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev             # Vite dev server → http://localhost:5173
```

### 3️⃣ Open the App

Visit [http://localhost:5173](http://localhost:5173) — the splash screen plays once per session, then the homepage loads.

> The frontend proxies `/api/*` to `http://localhost:3000` (see `vite.config.js`).

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
ACCESS_SECRET=change_me_to_a_long_random_string_in_production

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Zarinpal payment gateway
ZARINPAL_MERCHANT_ID=00000000-0000-0000-0000-000000000000
ZARINPAL_API_URL=https://api.zarinpal.com/pg/v4/payment/request.json
ZARINPAL_VERIFY_URL=https://api.zarinpal.com/pg/v4/payment/verify.json

NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

---

## 🌍 Internationalization (The Bilingual Magic)

The app ships with a complete **Persian + English** translation system.

| File                                     | Purpose                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/i18n/translations.js`               | All strings, organized by namespace (`nav`, `home`, `dashboard`, `auth`, `cartPage`, `footer`, …) |
| `src/features/language/languageSlice.js` | Redux slice — keeps `language` + `dir` in sync                                                    |
| `src/hooks/useLanguage.js`               | Hook: `const { t, language, dir, setLanguage, toggleLanguage } = useLanguage()`                   |

### Usage in any component

```jsx
import useLanguage from "../hooks/useLanguage";

const MyComponent = () => {
  const { t, language, dir } = useLanguage();

  return (
    <h1>{t("nav.home")}</h1>
    // "خانه" or "Home"
  );
};
```

### Switching language

Both the marketing navbar and the dashboard navbar expose a button that toggles between `fa` and `en`.  
The choice is persisted in `localStorage` and the **entire layout flips between RTL and LTR automatically.**

---

## 🎨 Color Palette

| Swatch | Token                | Hex       | Usage                |
| ------ | -------------------- | --------- | -------------------- |
| 🟦     | `primary.500`        | `#21295c` | Deep blue background |
| 🟦     | `primary.400`        | `#4d547d` | Sidebar active       |
| 🟡     | `secondary.500`      | `#ffd166` | Accent yellow        |
| 🟡     | `secondary.300`      | `#ffe3a3` | Light accent         |
| ⬜     | `grey.0`             | `#ffffff` | Light mode bg        |
| ⬛     | `grey.900`           | `#141414` | Dark mode bg         |
| 🔵     | Tailwind `secondary` | `#2E4CFF` | Marketing CTAs       |

---

## 📡 API Endpoints (Quick Reference)

### 🔐 Auth

| Method | Endpoint            | Auth          | Description                               |
| ------ | ------------------- | ------------- | ----------------------------------------- |
| `POST` | `/new-user`         | —             | Register a new user (forced role: `user`) |
| `POST` | `/login`            | —             | Login, returns JWT in cookie + body       |
| `POST` | `/logout`           | —             | Clear auth cookie                         |
| `POST` | `/api/set-token`    | —             | Issue a JWT for a payload                 |
| `GET`  | `/api/verify-token` | cookie/Bearer | Verify token, return user                 |
| `GET`  | `/protected-route`  | JWT           | Sample protected route                    |

### 👥 Users

| Method   | Endpoint              | Auth        | Description          |
| -------- | --------------------- | ----------- | -------------------- |
| `GET`    | `/users?page=&limit=` | JWT         | Paginated users list |
| `GET`    | `/users/:id`          | JWT         | Single user          |
| `PUT`    | `/update-user/:id`    | JWT + Admin | Update user          |
| `DELETE` | `/delete-user/:id`    | JWT + Admin | Delete user          |

### 🧘 Classes

| Method  | Endpoint             | Auth             | Description               |
| ------- | -------------------- | ---------------- | ------------------------- |
| `GET`   | `/classes`           | —                | Approved classes (public) |
| `GET`   | `/class-manage`      | —                | All classes (admin)       |
| `GET`   | `/class/:id`         | —                | Single class              |
| `POST`  | `/new-class`         | JWT              | Create class              |
| `PUT`   | `/update-class/:id`  | JWT + Instructor | Update class              |
| `PATCH` | `/change-status/:id` | JWT + Admin      | Approve / reject class    |
| `GET`   | `/approved-classes`  | —                | Approved classes          |
| `GET`   | `/popular_classes`   | —                | Top 6 by enrollment       |
| `POST`  | `/apply-discount`    | —                | Apply discount code       |

### 🛒 Cart & Payment

| Method   | Endpoint                     | Auth | Description               |
| -------- | ---------------------------- | ---- | ------------------------- |
| `POST`   | `/add-to-cart`               | JWT  | Add item to cart          |
| `GET`    | `/cart-by-email/:email`      | JWT  | User's cart items         |
| `DELETE` | `/delete-cart-item/:classId` | JWT  | Remove from cart          |
| `POST`   | `/create-payment-request`    | JWT  | Initiate Zarinpal payment |
| `GET`    | `/verify-payment`            | JWT  | Verify Zarinpal callback  |
| `GET`    | `/payment-history/:email`    | —    | Payment history           |

### 📝 Articles & Instructors

| Method   | Endpoint                 | Auth | Description        |
| -------- | ------------------------ | ---- | ------------------ |
| `GET`    | `/articles?page=&limit=` | —    | Paginated articles |
| `GET`    | `/articles/:id`          | —    | Single article     |
| `POST`   | `/new-article`           | —    | Create article     |
| `PUT`    | `/articles/:id`          | —    | Update article     |
| `DELETE` | `/articles/:id`          | —    | Delete article     |
| `GET`    | `/instructors`           | —    | List instructors   |
| `GET`    | `/popular-instructors`   | —    | Top 6 instructors  |

### 🛡️ Admin & Misc

| Method | Endpoint                   | Auth        | Description             |
| ------ | -------------------------- | ----------- | ----------------------- |
| `GET`  | `/admin-stats`             | JWT + Admin | Dashboard stats         |
| `GET`  | `/enrolled-classes/:email` | JWT         | User's enrolled classes |
| `POST` | `/as-instructor`           | —           | Apply as instructor     |

---

## 🧭 Frontend Routes

| Path                         | Page                                                           | Auth    |
| ---------------------------- | -------------------------------------------------------------- | ------- |
| `/`                          | Home (hero + gallery + popular classes + articles + BMI + FAQ) | —       |
| `/instructors`               | Instructors grid                                               | —       |
| `/classes`                   | Classes listing with pagination                                | —       |
| `/class/:id`                 | Single class detail with discount                              | —       |
| `/articles`                  | Articles listing                                               | —       |
| `/articles/:id`              | Single article (reading view)                                  | —       |
| `/products`                  | Products grid                                                  | —       |
| `/cart`                      | Shopping cart                                                  | ✓       |
| `/login`                     | Login page                                                     | —       |
| `/register`                  | Register page                                                  | —       |
| `/dashboard`                 | Dashboard home (stats + charts)                                | ✓       |
| `/dashboard/users`           | Manage users                                                   | ✓ Admin |
| `/dashboard/classes`         | Manage classes                                                 | ✓       |
| `/dashboard/payments`        | Payments                                                       | ✓       |
| `/dashboard/workout-plans`   | Workout plans                                                  | ✓       |
| `/dashboard/diet-plans`      | Diet plans                                                     | ✓       |
| `/dashboard/articles`        | Articles management                                            | ✓       |
| `/dashboard/daily-reports`   | Daily reports                                                  | ✓       |
| `/dashboard/monthly-reports` | Monthly reports                                                | ✓       |
| `/dashboard/analytics`       | Analytics                                                      | ✓       |
| `/dashboard/admin`           | Admin panel                                                    | ✓ Admin |
| `/dashboard/settings`        | Settings                                                       | ✓       |
| `*`                          | 404 NotFound                                                   | —       |

---

## 🔄 Auth Flow (Visualized)

```
┌─────────────┐    POST /new-user    ┌─────────────┐
│  Register   │ ────────────────────>│   Backend   │
└─────────────┘                      │             │
                                     │  bcrypt hash│
                                     │  insert user│
┌─────────────┐  POST /login         │             │
│    Login    │ ────────────────────>│             │
└─────────────┘  (email, password)   │  jwt.sign() │
                                     │  set cookie │
                                     └──────┬──────┘
                                            │
                                            │ { user, token }
                                            ▼
┌─────────────┐  Authorization: Bearer ┌─────────────┐
│   Redux     │ <──────────────────── │  Frontend   │
│   Store     │      token            │   (React)   │
└─────────────┘                       └─────────────┘
```

---

## 🔧 Notable Fixes (From the Original Codebase)

This project wasn't built from scratch — it was **rescued**. Here's what was fixed:

- 🩹 **Every broken page now renders.** No more blank screens.
- 📊 **Dashboard is no longer empty** — it has stat cards, charts, and an activity feed.
- 🖼️ **Gallery uses all images** instead of a subset.
- 🌐 **Full bilingual support** with proper RTL/LTR handling.
- 🐛 **Centralized error handler** was registered _after_ all routes (it was a bug before!).

---

## 🗺️ Roadmap

- [ ] Add unit tests for critical auth flows
- [ ] Implement instructor-specific dashboard views
- [ ] Add real-time notifications for class approvals
- [ ] Build a mobile app companion (React Native)
- [ ] Add Stripe as an alternative payment gateway

---

## 🤝 Contributing

Got an idea? Found a bug? Want to add a feature?

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-thing`)
3. Commit your changes (`git commit -m 'Add amazing thing'`)
4. Push to the branch (`git push origin feature/amazing-thing`)
5. Open a Pull Request

All contributions are welcome — big or small.

---

## 📄 License

MIT — do whatever you want, just don't blame us if it breaks.

---

<div align="center">

**LET'S MAKE IT WORK.**

</div>
