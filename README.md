# 🍏 Ai-Calorie — Intelligent Calorie & Nutrition Coaching System

Ai-Calorie is a state-of-the-art, high-fidelity **MERN Stack application** featuring a premium deep-space dark mode interface, glassmorphism aesthetics, advanced micro-animations, and full-featured AI integrations.

---

## ✨ Features

- **📊 Calorie Core Dashboard**: Custom radial progress ring and HSL macros indicators tracking protein (Emerald), carbs (Cyan), and fats (Gold) consumption rates dynamically.
- **💧 Wave Hydration Tracker**: Log daily water cups and watch fluid-level wave animations rise instantly inside the hydrometer widget.
- **🤖 AI Meal Scanner**: Write natural language descriptions of dishes (or tap template meals) to initiate coordinates scanning grid overlays and deconstruct calories, macro splits, and customized dietitian advice.
- **📓 Category Journal Diary**: Segregate logs into Breakfast, Lunch, Dinner, and Snack sectors, complete with macro metrics and portion dials.
- **💬 AI Dietitian Consultant**: A fully implemented sports nutritionist companion chat console supporting custom targets, current diaries context, and quick prompt pills.
- **⚙️ Profile Goals**: Mifflin-St Jeor formula calculators yielding optimal daily calorie targets based on target weights and active multipliers.
- **🛡️ Double-Resilience Database**: Failover routing layers. Connects to **MongoDB** if `MONGO_URI` is present in `.env`, and silently defaults to local JSON storage if not. Runs immediately out-of-the-box!

---

## 🛠️ Project Structure

```
d:\Ai-Calorie\
├── backend\
│   ├── config\db.js         # Hybrid MongoDB / JSON Connection Layer
│   ├── routes\              # API routing logic for meals, goals, and AI
│   │   ├── mealRoutes.js
│   │   ├── goalRoutes.js
│   │   └── aiRoutes.js
│   ├── data\                # File storage fallback folder
│   ├── .env                 # Environment configurations
│   ├── server.js            # Express API Server entrypoint
│   └── package.json
├── frontend\
│   ├── src\
│   │   ├── components\      # High-fidelity dashboard, chat, and scanners
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AiScanner.jsx
│   │   │   ├── MealLogger.jsx
│   │   │   ├── AiChat.jsx
│   │   │   └── Goals.jsx
│   │   ├── App.jsx          # Context state, dates, CRUD synchronizer
│   │   ├── index.css        # Neon design system & animations
│   │   └── main.jsx
│   ├── index.html           # SEO tags and font configurations
│   └── vite.config.js       # Vite proxy setup to route /api -> server
└── start-dev.bat            # Single-click double launcher batch runner
```

---

## 🚀 Getting Started

### Quick Start (Windows)
Double-click `start-dev.bat` in the root folder. It will boot both frontend and backend automatically:
- **Client Interface**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5000](http://localhost:5000)

### Manual Start
If you prefer running terminals manually:

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## ⚙️ Environment Adjustments

To customize settings, edit `backend/.env`:
```ini
PORT=5000
# To connect to a cloud database:
MONGO_URI=mongodb+srv://YOUR_URI
# To connect real Gemini AI prompts:
GEMINI_API_KEY=AIzaSyYourGeminiApiKey
```

*Note: If no API key is specified, the application launches its Generative Mock AI engine, simulating scanning coordinates and generating highly accurate nutrition calculations and nutritionist responses locally.*
