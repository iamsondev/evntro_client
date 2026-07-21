# Evntro — Event Management Platform

A full-stack event management web application that allows users to discover, register for, and manage events. Admins can create and moderate events, manage categories, and oversee registrations.

🌐 **Live Site:** [https://evntro.netlify.app](https://evntro.netlify.app)
🔗 **Backend API:** [https://envtro-server.onrender.com/api/v1](https://envtro-server.onrender.com/api/v1)

---

## 🚀 Features

### User
- Browse and search events by category
- Register for events with **Stripe** payment integration
- Google OAuth sign-in
- Wishlist events
- Leave reviews on attended events
- Real-time notifications
- Personal dashboard (My Hub)

### Admin
- Create, edit, and moderate events
- Manage event categories
- View and manage all registrations
- Admin-only dashboard panel

---

## 🛠️ Tech Stack

### Frontend (`evntro_client`)
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v8 | Client-side routing |
| Tailwind CSS v4 | Styling |
| shadcn/ui + Radix UI | UI components |
| GSAP + Lenis | Animations & smooth scroll |
| Axios | HTTP requests |
| React Hook Form + Zod | Form validation |
| @react-oauth/google | Google Sign-In |
| Sonner | Toast notifications |
| Stripe.js | Payment UI |

### Backend (`envtro_server`)
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Database |
| JWT + Cookies | Authentication |
| Google Auth Library | Google OAuth verification |
| Stripe | Payment processing |
| bcryptjs | Password hashing |
| express-validator | Input validation |

---

## 📁 Project Structure

```
evntro_client/
├── public/
│   └── _redirects          # Netlify SPA redirect rule
├── src/
│   ├── api/                # Axios API wrappers
│   ├── components/         # Shared components (NotificationBell, etc.)
│   ├── context/            # React context providers
│   ├── layout/             # Layout wrappers
│   ├── pages/
│   │   ├── Authentication/ # Login & Register
│   │   ├── Dashboard/      # Admin dashboard panel
│   │   ├── Events/         # Event listing & creation
│   │   ├── Home/           # Landing page sections
│   │   ├── User/           # My Hub (user dashboard)
│   │   ├── About/
│   │   └── Contact/
│   ├── routes/             # React Router config
│   └── main.jsx
├── netlify.toml            # Netlify deploy config
└── .env                    # Environment variables
```

```
envtro_server/
└── src/
    ├── modules/
    │   ├── auth/           # Login, register, Google OAuth
    │   ├── event/          # CRUD for events
    │   ├── category/       # Event categories
    │   ├── registration/   # Event registrations
    │   ├── payment/        # Stripe checkout
    │   ├── review/         # Event reviews
    │   ├── notification/   # User notifications
    │   └── wishlist/       # Saved events
    ├── middlewares/        # Auth, error handling
    ├── shared/             # Shared utilities
    ├── app.js              # Express app setup
    └── server.js           # Entry point
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB connection string (Atlas or local)

### 1. Clone the repo

```bash
git clone <repo-url>
```

### 2. Setup Backend

```bash
cd envtro_server
npm install
```

Create `.env` in `envtro_server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=your_stripe_secret_key
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd evntro_client
npm install
```

Create `.env` in `evntro_client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Create Admin User

```bash
cd envtro_server
npm run seed
```

---

## 🌍 Deployment

| Service | Platform |
|---|---|
| Frontend | [Netlify](https://netlify.com) |
| Backend | [Render](https://render.com) |
| Database | MongoDB Atlas |
| Media | Cloudinary |

### Environment Variables to set on Render (Backend):
- `PORT`, `MONGODB_URI`, `JWT_SECRET`
- `CLIENT_URL` → `https://evntro.netlify.app`
- `GOOGLE_CLIENT_ID`, `STRIPE_SECRET_KEY`

### Environment Variables to set on Netlify (Frontend):
- All `VITE_*` variables from `.env`

---

## 📜 License

MIT
