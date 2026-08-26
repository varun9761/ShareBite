# ShareBite 🍲

> **ShareBite** is a full-stack surplus food recovery and NGO redistribution platform that connects restaurants, caterers, and food donors with nearby NGOs, charities, soup kitchens, and volunteers in real time to eliminate hunger and reduce food waste.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Quickstart Guide](#-step-by-step-quickstart-guide)
- [Database Setup (PostgreSQL or Zero-Config)](#-database-setup-postgresql-or-zero-config)
- [Free APIs & Geolocation Integration](#-free-apis--geolocation-integration)
- [Application Features & User Roles](#-application-features--user-roles)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Troubleshooting & Common Issues](#-troubleshooting--common-issues)
- [License](#-license)

---

## 🌟 Overview & Architecture

ShareBite bridges the gap between surplus food generators (restaurants, banquet halls, caterers, bakeries) and food rescue organizations (NGOs, community kitchens, shelter homes).

```
                      ┌───────────────────────────────────────────────┐
                      │              ShareBite Frontend               │
                      │  (React 19 + Tailwind CSS + Leaflet Maps)     │
                      └───────┬───────────────────────────────▲───────┘
                              │                               │
                      HTML5 GPS / Claims / Listings     Real-time NGOs & Maps
                              │                               │
                              ▼                               │
                      ┌───────────────────────────────────────┴───────┐
                      │               Node.js Express API             │
                      │                (Port: 4000)                   │
                      └───────┬───────────────────────────────┬───────┘
                              │                               │
                     SQL Queries / Fallback           Overpass API & Reverse Geocode
                              │                               │
                              ▼                               ▼
                      ┌───────────────┐               ┌───────────────────────┐
                      │  PostgreSQL   │               │   OpenStreetMap API   │
                      │   Database    │               │  (Overpass + Nominatim)│
                      └───────────────┘               └───────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend (`client/`)**:
  - **Framework**: React 19 (Vite)
  - **Styling**: Tailwind CSS v4
  - **Maps & Geolocation**: Leaflet & React-Leaflet with custom radar marker pins
  - **Icons**: Lucide React
  - **Date Utilities**: Date-fns

- **Backend (`server/`)**:
  - **Runtime & Framework**: Node.js & Express 5
  - **Database Driver**: `pg` (node-postgres) with automatic migrations
  - **Authentication & Security**: JSON Web Tokens (JWT) & bcryptjs
  - **Task Scheduling**: `node-cron` for automated food expiration checks
  - **CORS & Environment**: CORS, Dotenv

- **External Free Services**:
  - **OpenStreetMap Overpass API**: Live NGO, soup kitchen, food sharing, and charity discovery.
  - **OpenStreetMap Nominatim**: Reverse geocoding of coordinates into physical addresses.

---

## 📋 Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v24.x`)
- **npm**: `v9.0.0` or higher
- **PostgreSQL** *(Optional)*: If you want to use a local or cloud PostgreSQL database. (If not installed, ShareBite automatically runs in a zero-config built-in storage mode).

Verify your Node.js and npm versions:
```bash
node -v
npm -v
```

---

## 🚀 Step-by-Step Quickstart Guide

Anyone can run this project in **less than 2 minutes** by following these steps:

### Step 1: Clone or Navigate to the Repository

```bash
cd ShareBite
```

### Step 2: Install All Dependencies

You can install all dependencies for both the backend and frontend in one command from the project root:

```bash
npm run install:all
```

*(Alternatively, you can install them individually:)*
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

---

### Step 3: Configure Environment Variables *(Optional)*

The backend works out-of-the-box with default settings. If you want to customize ports, secrets, or connect to a live PostgreSQL instance, create a `.env` file in the `server` folder:

```bash
# On Windows PowerShell:
cp server/.env.example server/.env

# On macOS/Linux:
cp server/.env.example server/.env
```

Contents of `server/.env`:
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secure-secret-key

# Optional PostgreSQL Connection (Local or Cloud like Supabase/Neon/Render)
# If omitted or offline, ShareBite uses its built-in zero-config database engine.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sharebite
```

---

### Step 4: Start the Application

You need to run the backend and frontend concurrently in two separate terminal windows.

#### **Terminal 1: Start Backend API**
```bash
npm run server
```
> ✅ You will see:
> ```
> 🌱 ShareBite Backend API is live on port 4000
> 📍 OpenStreetMap & Geolocation Services Ready
> 🗄️ PostgreSQL Data Layer Initialized
> ```

#### **Terminal 2: Start Frontend Client**
```bash
npm run client
```
> ✅ You will see:
> ```
>   VITE v8.2.1  ready in 250 ms
>   ➜  Local:   http://localhost:5173/
> ```

---

### Step 5: Open in Your Browser

Open your browser and visit:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🗄️ Database Setup (PostgreSQL or Zero-Config)

ShareBite features an **automatic migration system**:

### Mode A: Zero-Config In-Memory Mode (Default)
- If no PostgreSQL database is running, ShareBite automatically initializes with seed data (verified NGOs, donating restaurants, demo users, sample food listings).
- No setup or database installation required.

### Mode B: PostgreSQL Mode (Production or Local)
1. Ensure your PostgreSQL server is running and create a database:
   ```sql
   CREATE DATABASE sharebite;
   ```
2. Set your `DATABASE_URL` in `server/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sharebite
   ```
   *(Works with **Supabase**, **Neon.tech**, **ElephantSQL**, **AWS RDS**, or **local PostgreSQL**)*
3. When the server starts, it will **automatically create all tables** (`users`, `listings`, `ngos`, `donors`) and seed initial data if the tables are empty!

---

## 🗺️ Free APIs & Geolocation Integration

### 1. Live Exact Location Tracking
- Click the **"Track My Exact Location"** button on the dashboard.
- The app uses the HTML5 Geolocation API (`enableHighAccuracy: true`) to get your live latitude, longitude, and accuracy radius.

### 2. OpenStreetMap Nominatim Reverse Geocoding
- Converts raw GPS coordinates into human-readable locations (e.g. `Domlur, Bengaluru, Karnataka, 560071`).
- Endpoint: `GET /api/geocode/reverse?lat=...&lng=...`

### 3. OpenStreetMap Overpass NGO Discovery API
- Performs real-time geospatial bounding-box queries for `amenity=social_facility`, `office=ngo`, `office=charity`, `social_facility=soup_kitchen`, and `amenity=food_sharing`.
- Merges Overpass real-time points with verified database records and sorts by exact Haversine distance.
- Endpoint: `GET /api/ngo/nearby?lat=...&lng=...&radiusKm=15`

---

## 📱 Application Features & User Roles

### 1. 🧑‍🤝‍🧑 Claimer & NGO Discovery Dashboard
- **Exact Location & Radius**: Filter food and NGOs by 2 km, 5 km, 10 km, 15 km, 25 km, or 50 km, or switch between major cities with presets.
- **3 Tabbed Views**:
  1. **Surplus Food**: View available food batches, quantity, freshness countdown timer, distance, and veg/non-veg tags.
  2. **Nearby NGOs & Charities**: Real-time charities from OpenStreetMap + verified database with contact phone, website, and "Offer Surplus Food" button.
  3. **Donating Restaurants**: Establishments with active surplus recovery programs.
- **Interactive Multi-Layer Map**:
  - 🔵 **Pulsing Blue Radar Pin**: User's exact live GPS location.
  - 🟠 **Orange Pins**: Active Surplus Food Listings.
  - 🔵 **Blue Pins**: Nearby NGOs and Relief Centers.
  - 🟢 **Emerald Pins**: Donating Restaurants and Bakeries.
- **Claim Flow with OTP**: Clicking "Claim" secures the food batch and generates a 6-digit pickup OTP.

### 2. 👨‍🍳 Donor Operations Dashboard
- **Post Food Modal**:
  - Click **"Use My Current GPS"** to auto-detect your location and fill in address and coordinates automatically.
  - Enter quantity (servings/kg/boxes), preparation time, expiration safe-by time, and category (veg/non-veg).
- **OTP Pickup Verification**:
  - When an NGO volunteer arrives to collect food, the donor enters their 6-digit OTP code directly on the dashboard to verify pickup.
  - Confirmed pickups update live impact metrics in real time.

### 3. 🛡️ Admin Hub & Safety System
- **Real-Time Metrics**: Total meals saved, kg rescued, live listings count, and verified partners count.
- **Credential Review**: Verify or review newly registered donor and NGO accounts with 1-click.
- **Safety Cron Job**: `node-cron` runs automatically every minute in the background and expires listings that have exceeded their shelf-life timestamp to prevent unsafe food consumption.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service & Database health check | None |
| `GET` | `/api/listings` | Fetch active surplus food listings | `lat`, `lng`, `radiusKm`, `category` |
| `POST` | `/api/listings` | Create a surplus food listing | `foodType`, `quantity`, `quantityUnit`, `preparedAt`, `expiresAt`, `address`, `lat`, `lng` |
| `GET` | `/api/donor/listings` | Fetch donor's own listings | `donorId` (optional) |
| `POST` | `/api/listings/:id/claim` | Claim a surplus food batch | `claimerName` |
| `POST` | `/api/listings/:id/verify-pickup` | Verify OTP and complete pickup | `otp` |
| `GET` | `/api/ngo/nearby` | Real-time NGOs (OSM Overpass + DB) | `lat`, `lng`, `radiusKm` |
| `POST` | `/api/ngo/register` | Register a new NGO partner | `name`, `cause`, `address`, `contactPhone`, `contactEmail` |
| `GET` | `/api/donors/nearby` | Fetch nearby food donating restaurants | `lat`, `lng`, `radiusKm` |
| `GET` | `/api/geocode/reverse` | Reverse geocode coordinates to address | `lat`, `lng` |
| `GET` | `/api/admin/metrics` | Get aggregated rescue impact metrics | None |
| `GET` | `/api/admin/users` | List all users and partners | None |
| `POST` | `/api/admin/users/:id/verify` | Verify a partner's credentials | None |

---

## 📂 Project Directory Structure

```
ShareBite/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets & icons
│   ├── src/
│   │   ├── App.jsx                  # Main React dashboard & UI workflows
│   │   ├── index.css                # Tailwind CSS styles & custom map markers
│   │   └── main.jsx                 # React root render
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite config & backend API proxy
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── index.js                 # API routes, auth & cron jobs
│   │   ├── db.js                    # PostgreSQL pool, schemas & repository
│   │   └── services/
│   │       └── osmService.js        # OpenStreetMap Overpass & Nominatim integration
│   ├── .env.example                 # Environment configuration template
│   └── package.json                 # Backend dependencies
│
├── README.md                        # Project documentation (this file)
└── package.json                     # Root orchestrator scripts
```

---

## ❓ Troubleshooting & Common Issues

### 1. Port 4000 or 5173 is already in use
- **Backend**: Set `PORT=4001` in `server/.env` or run `PORT=4001 npm run server`.
- **Frontend**: Vite will automatically pick the next available port (e.g. `5174`).

### 2. Geolocation prompt blocked or denied
- Ensure your browser permits location access for `http://localhost:5173`.
- If GPS is not enabled on your device, you can use the **City Preset dropdown** (Bengaluru, Delhi, Mumbai, etc.) to instantly test any location.

### 3. OpenStreetMap Overpass API is slow in some regions
- The backend features a 5-second abort controller and automatic fallback to verified database NGOs to guarantee the frontend never hangs.

### 4. How to verify the build before deployment
```bash
# Verify client build
npm run build --prefix client

# Check backend syntax
node -c server/src/index.js
node -c server/src/db.js
node -c server/src/services/osmService.js
```

---

## 📄 License

This project is licensed under the ISC License. Free to use and distribute for food recovery and non-profit welfare initiatives.
