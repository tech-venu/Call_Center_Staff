# CallFlow — Enterprise Call Centre Staff Platform

Welcome to **CallFlow**, an interactive, human-centered Call Centre Staff Management application built with React, Vite, Tailwind CSS, Lucide icons, and Recharts.

---

## Quick Start (How to Run)

1. Open your terminal in this directory:
   ```bash
   cd /Users/admin/Desktop/Call_Center
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   ```
   http://localhost:5173/  (or the port shown in your terminal)
   ```

---

## Key Features

- **Executive Dashboard**: Dynamic time-based greeting, 4 interactive KPI metric cards, Recharts visualizations (weekly calls, call outcomes, hourly pace, CSAT trend), today's 5-stage schedule timeline, and live activity stream.
- **My Calls Queue**: Full telephony management with search, multi-criteria filtering (status, priority, type), sorting, pagination, table/card toggle, and call details drawer.
- **Simulated Softphone**: Frontend-only call simulator featuring connecting rings, live elapsed seconds timer, mute toggle, hold/resume toggle, DTMF keypad, and post-call wrap-up with resolution outcomes, notes, and auto-callback scheduling.
- **Customer 360° Directory**: Customer accounts with tier badges (Enterprise, VIP, Premium, Standard), full slide-over profile drawer with previous call history, and validated Add/Edit customer forms.
- **Callback Scheduling**: Calendar & categorized list views for Today, Overdue, Upcoming, and Completed callbacks with rescheduling and complete actions.
- **Performance Analytics**: Agent metrics, period switcher (Today, Week, Month, Quarter), target progress bars, and SLA tracking curves.
- **Notification Centre**: Real-time alerts, unread counts, and persistent dismissal.
- **Settings & Dual Theme**: Adaptive Light Mode and Dark Mode switcher, profile editor, queue quotas, and Reset Demo Data.
- **Command Palette (`⌘K`)**: Instant spotlight search across callers, phone numbers, and call logs.

---

## Technologies Used

- **React 19 & Vite 8**: Ultra-fast frontend development
- **Tailwind CSS v4**: Modern, tailored enterprise UI styling
- **React Router DOM 7**: Seamless client-side page routing
- **Lucide React**: Clean SVG iconography
- **Recharts**: Data visualization & analytics
- **HTML5 LocalStorage**: Persistent client-side data storage
