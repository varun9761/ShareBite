# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## For ShareBite — Surplus Food Recovery & NGO Redistribution Platform
### Document Reference: SB-SRS-IEEE-830-2026-V1.0
### Standard: IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018

---

| Specification Attribute | Detail |
| :--- | :--- |
| **Project Title** | **ShareBite** (Surplus Food Recovery & Distribution Ecosystem) |
| **Document Type** | Software Requirements Specification (SRS) |
| **Standard Reference** | IEEE Std 830-1998 / ISO/IEC/IEEE 29148 |
| **Version** | 1.0.0 (Release) |
| **Date of Creation** | September 20, 2026 |
| **System Classification** | Full-Stack Geospatial Web Application |
| **Development Team** | ShareBite Engineering Team |

---

## TABLE OF CONTENTS

- [1. INTRODUCTION](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Document Conventions](#12-document-conventions)
  - [1.3 Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
  - [1.4 Product Scope](#14-product-scope)
  - [1.5 References](#15-references)
- [2. OVERALL DESCRIPTION](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions (High-Level Functional Summary)](#22-product-functions-high-level-functional-summary)
  - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  - [2.4 Operating Environment](#24-operating-environment)
  - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  - [2.6 User Documentation](#26-user-documentation)
  - [2.7 Assumptions and Dependencies](#27-assumptions-and-dependencies)
- [3. EXTERNAL INTERFACE REQUIREMENTS](#3-external-interface-requirements)
  - [3.1 User Interfaces (UI)](#31-user-interfaces-ui)
  - [3.2 Hardware Interfaces](#32-hardware-interfaces)
  - [3.3 Software Interfaces](#33-software-interfaces)
  - [3.4 Communications Interfaces](#34-communications-interfaces)
- [4. SYSTEM FEATURES (FUNCTIONAL REQUIREMENTS)](#4-system-features-functional-requirements)
  - [4.1 System Feature 1: User Authentication & Role-Based Access Control (RBAC)](#41-system-feature-1-user-authentication--role-based-access-control-rbac)
  - [4.2 System Feature 2: Surplus Food Listing Management](#42-system-feature-2-surplus-food-listing-management)
  - [4.3 System Feature 3: Geospatial Search, Radius Filtering & Map Discovery](#43-system-feature-3-geospatial-search-radius-filtering--map-discovery)
  - [4.4 System Feature 4: Food Batch Reservation & Claim Processing](#44-system-feature-4-food-batch-reservation--claim-processing)
  - [4.5 System Feature 5: Secure Cryptographic OTP Handover & Verification](#45-system-feature-5-secure-cryptographic-otp-handover--verification)
  - [4.6 System Feature 6: Real-World NGO Discovery & Direct Allocation](#46-system-feature-6-real-world-ngo-discovery--direct-allocation)
  - [4.7 System Feature 7: Real-Time Turn-by-Turn Route Navigation & Geocoding](#47-system-feature-7-real-time-turn-by-turn-route-navigation--geocoding)
  - [4.8 System Feature 8: Automated Shelf-Life & Food Safety Cron Engine](#48-system-feature-8-automated-shelf-life--food-safety-cron-engine)
  - [4.9 System Feature 9: Administrative Oversight, Partner Credentialing & Impact Analytics](#49-system-feature-9-administrative-oversight-partner-credentialing--impact-analytics)
  - [4.10 System Feature 10: Verifiable Digital Impact Certification](#410-system-feature-10-verifiable-digital-impact-certification)
- [5. NON-FUNCTIONAL REQUIREMENTS](#5-non-functional-requirements)
  - [5.1 Performance Requirements](#51-performance-requirements)
  - [5.2 Safety & Food Health Requirements](#52-safety--food-health-requirements)
  - [5.3 Security Requirements](#53-security-requirements)
  - [5.4 Software Quality Attributes](#54-software-quality-attributes)
  - [5.5 Business Rules](#55-business-rules)
- [6. DATA MODEL & DATABASE REQUIREMENTS](#6-data-model--database-requirements)
  - [6.1 Relational Schema & Storage Architecture](#61-relational-schema--storage-architecture)
  - [6.2 Entity-Relationship Specifications](#62-entity-relationship-specifications)
- [7. APPENDICES](#7-appendices)
  - [7.1 Appendix A: Glossary of Terms & Acronyms](#71-appendix-a-glossary-of-terms--acronyms)
  - [7.2 Appendix B: Requirements Traceability Matrix (RTM)](#72-appendix-b-requirements-traceability-matrix-rtm)

---

## 1. INTRODUCTION

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a complete, definitive, and formal specification of the functional and non-functional requirements for the **ShareBite** web application. This document is drafted in rigorous conformance with the **IEEE Std 830-1998** standard. It establishes the baseline contract for developers, quality assurance engineers, project evaluators, and organizational stakeholders across all phases of the software development life cycle (SDLC).

### 1.2 Document Conventions
- **Requirement Tagging**:
  - `[FR-<MODULE>-<ID>]`: Designates a Functional Requirement.
  - `[NFR-<CATEGORY>-<ID>]`: Designates a Non-Functional Requirement.
  - `[BR-<ID>]`: Designates a Business Rule.
- **Requirement Weighting**:
  - **High (Essential)**: Indispensable core capability required for baseline system operation.
  - **Medium (Desirable)**: Significant functional feature that enriches platform capabilities.
  - **Low (Optional)**: Value-added feature for subsequent iterative enhancement.
- **Standards & Terminology**: The terms **SHALL** (mandatory), **SHOULD** (recommended), and **MAY** (optional) follow **RFC 2119** guidelines.

### 1.3 Intended Audience and Reading Suggestions
This document is targeted toward:
1. **Academic Instructors & Evaluators**: To assess the formal software specification, architectural rigor, and adherence to IEEE 830 standards.
2. **System Architects and Software Engineers**: To guide component design, RESTful API implementation, database migration scripts, and frontend integration.
3. **Quality Assurance & Verification Teams**: To derive end-to-end test suites, boundary condition checks, and security validation vectors.
4. **NGO Partners & Food Donors**: To understand user workflows, OTP verification steps, and food safety protocols.

### 1.4 Product Scope
**ShareBite** is an end-to-end surplus food recovery and non-profit redistribution platform designed to bridge the gap between commercial surplus food generators (restaurants, banquet halls, caterers, bakeries) and hunger relief organizations (NGOs, community kitchens, shelter homes).

Major objectives accomplished by the system:
1. **Minimizing Edible Food Waste**: Enabling rapid real-time listing of prepared surplus meals with precise perishability deadlines.
2. **Geospatial Discovery & Interactive Mapping**: Utilizing HTML5 geolocation, Leaflet maps, and OpenStreetMap (Overpass & Nominatim) to identify nearby food sources and charity distribution centers.
3. **Fraud-Proof Pickup via OTP**: Preventing misallocation or unauthorized pickups through a two-party cryptographic 6-digit One-Time Password verification protocol.
4. **Automated Food Safety Enforcement**: Maintaining public health standards via automated background scheduler jobs (`node-cron`) that instantly deprecate expired listings.
5. **Auditable Social Impact**: Automatically calculating cumulative metrics (meals saved, kilograms diverted, $\text{CO}_2$ offset) and generating verified certificates.

### 1.5 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. ISO/IEC/IEEE 29148:2018: *Systems and Software Engineering — Requirements Engineering*.
3. RFC 7519: *JSON Web Token (JWT) Architecture and Implementation*.
4. OpenStreetMap Overpass API Specification & Query Language (Overpass QL).
5. OpenStreetMap Nominatim Geocoding Services Documentation.
6. Food Safety and Standards Authority of India (FSSAI): *Surplus Food Recovery Regulations*.
7. ShareBite Source Repository: `ShareBite/server`, `ShareBite/client`, `ShareBite/README.md`.

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
ShareBite is an autonomous, cloud-ready, 3-tier distributed client-server application. It operates as an independent platform while integrating external GIS services for live geolocation and routing.

```
+-----------------------------------------------------------------------------------+
|                             PRESENTATION TIER (Client)                            |
|             React 19 (Vite) + Tailwind CSS v4 + Leaflet & React-Leaflet           |
|        - Claimer Dashboard     - Donor Dashboard     - Admin Governance Hub       |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON REST API
                                           v
+-----------------------------------------------------------------------------------+
|                            APPLICATION LOGIC TIER (Server)                        |
|                     Node.js & Express 5 (Stateless REST Micro-Kernel)             |
|   - JWT Token Authentication Engine           - OTP Verification Engine           |
|   - Haversine Geospatial Sorting              - 60s node-cron Food Safety Daemon  |
+---------------------+---------------------------------------+---------------------+
                      |                                       |
                      v                                       v
+-------------------------------------+     +---------------------------------------+
|            DATA PERSISTENCE TIER    |     |          EXTERNAL SERVICES TIER       |
|  - PostgreSQL 16 (Relational ACID)  |     |  - OpenStreetMap Overpass API         |
|  - Automatic DDL Schema Migrations  |     |  - OpenStreetMap Nominatim Geocoder   |
|  - High-Fidelity In-Memory Fallback |     |  - OSRM Turn-by-Turn Routing Engine   |
+-------------------------------------+     +---------------------------------------+
```

### 2.2 Product Functions (High-Level Functional Summary)
- **Account & Identity Management**: Role-based registration and authentication (`donor`, `claimer`, `admin`).
- **Food Donation Publishing**: Geotagged listing submission with dietary categorization (`veg` / `non-veg`), quantity units (`servings`, `kg`, `boxes`), and shelf-life timestamps.
- **Geospatial Proximity Filtering**: Haversine distance-based radius filtering (2 km to 50 km) across surplus listings, registered charities, and donating restaurants.
- **Interactive Multi-Layer Mapping**: Real-time Leaflet map displaying user GPS coordinates alongside color-coded radar marker pins.
- **Reservation & OTP Lifecycle**: Single-click food claiming, instant generation of a 6-digit OTP, physical handover verification, and automatic status transition.
- **Automated Food Safety Sweeper**: Continuous background monitoring expiring listings past their safe-by horizon every 60 seconds.
- **Direct NGO Dispatch**: One-click allocation matching food donors directly to live community charities discovered via OpenStreetMap Overpass.
- **Turn-by-Turn Driving Navigation**: Calculation of optimal driving paths, distance (km), and transit duration (minutes) between claimer and donor.
- **Social Impact Auditing & Certification**: Aggregate statistics calculation and generation of printable digital impact certificates.

### 2.3 User Classes and Characteristics

| User Class | Sub-Role | Responsibilities & Operations | Technical Sophistication |
| :--- | :--- | :--- | :--- |
| **Donor** | Restaurant Manager, Caterer, Baker, Corporate Kitchen Admin | Publishes surplus batches, tracks active listings, reviews incoming claims, enters 6-digit OTP to verify volunteer handover. | Beginner to Intermediate |
| **Claimer** | NGO Coordinator, Food Bank Volunteer, Shelter Staff | Scans geospatial map, applies dietary/radius filters, reserves food batches, presents OTP during collection. | Intermediate |
| **Admin** | System Auditor, Municipal Food Inspector | Inspects system-wide food rescue metrics, audits partner credentials, verifies newly onboarded donors and NGOs. | Advanced |
| **Public** | Unregistered Guest Visitor | Inspects live impact metrics, views public relief center maps, reads food rescue guidelines. | Beginner |

### 2.4 Operating Environment
- **Client Platforms**:
  - Web Browsers: Google Chrome 110+, Mozilla Firefox 115+, Apple Safari 16+, Microsoft Edge 110+.
  - Responsive Viewports: Mobile screens ($360\text{px} \times 640\text{px}$), Tablets ($768\text{px} \times 1024\text{px}$), and Desktops ($1920\text{px} \times 1080\text{px}$).
- **Server Runtime**:
  - Runtime: Node.js version $\ge 18.0.0$ (LTS 20.x or 22.x recommended).
  - Web Framework: Express v5.
- **Database Environments**:
  - Primary: PostgreSQL 14 / 15 / 16 (Local or Cloud-hosted on Supabase, Neon, Render, AWS RDS).
  - Fail-safe Secondary: Built-in high-fidelity in-memory transactional store.

### 2.5 Design and Implementation Constraints
1. **Zero-Configuration Fallback Constraint**: The platform must guarantee seamless startup without crashing when PostgreSQL is absent or offline.
2. **Stateless Scalability**: The backend must adhere to stateless REST conventions; session state is managed via cryptographically signed JWTs.
3. **External Rate-Limiting & Timeout Safeguards**: Outbound HTTP requests to OpenStreetMap Overpass and Nominatim APIs must enforce a strict 5000 ms timeout with automatic fallback to local records.
4. **Food Safety Timestamp Integrity**: Under no circumstances may an expired listing be claimed or verified.

### 2.6 User Documentation
- Technical Quickstart Guide (`README.md`).
- Contextual UI tooltips and confirmation modals for OTP pickup.
- In-app printable Food Recovery Impact Certificates.

### 2.7 Assumptions and Dependencies
- **User Location Access**: Client devices support the W3C Geolocation API; if permission is denied, users can select from pre-configured municipal presets.
- **Donor Honesty on Expiry**: Donors accurately estimate safe consumption timestamps based on proper culinary storage conditions.
- **Network Availability**: Internet access is available to query map tiles and communicate with the backend REST API.

---

## 3. EXTERNAL INTERFACE REQUIREMENTS

### 3.1 User Interfaces (UI)
The frontend delivers a modern single-page dashboard featuring:
1. **Global Header & Navigation Bar**:
   - Platform brand identity (`ShareBite 🍲`).
   - Theme toggle (Light Mode / Dark Mode with persistent `localStorage`).
   - Live location indicator with high-accuracy GPS trigger ("Track My Exact Location") and Municipal City Presets dropdown (Bengaluru, Delhi, Mumbai, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad).
   - Role switcher tabs (`Claimer View`, `Donor View`, `Admin Hub`).
2. **Claimer & Discovery Dashboard**:
   - Filter bar: Dietary category chips (`All`, `Veg`, `Non-Veg`), real-time search input, and radial distance selector (`2 km`, `5 km`, `10 km`, `15 km`, `25 km`, `50 km`).
   - 3 Discovery sub-tabs: `Surplus Food Listings`, `Nearby NGOs & Charities`, `Donating Restaurants`.
   - Dual presentation mode: Responsive Grid Card View and Interactive Full-Screen Leaflet Map.
3. **Donor Management Dashboard**:
   - Active surplus listings summary cards with live status badges (`pending`, `claimed`, `picked_up`, `expired`).
   - Action triggers: "Post Surplus Food" and "Verify Pickup OTP".
4. **Admin Safety & Impact Hub**:
   - KPI counters: Total Meals Saved, Total Kilograms Rescued, Active Listings, Verified Partner Count.
   - User Credential Table with 1-click verification toggles.
5. **Modal Interfaces**:
   - `FoodModal`: Creation dialog with GPS auto-detection, quantity counters, and expiration selectors.
   - `ClaimSuccessModal`: Claim confirmation displaying donor phone, physical address, and 6-digit OTP.
   - `OTPVerifyModal`: Secure PIN input verifying volunteer pickup.
   - `ImpactCertificateModal`: Formatted printable certificate verifying environmental and hunger relief impact.

### 3.2 Hardware Interfaces
- **GPS / Geolocation Hardware**: Interfaces via the browser's `navigator.geolocation` API with `enableHighAccuracy: true` to acquire latitude, longitude, and accuracy radius.
- **Client Displays**: Supports desktop, tablet, and smartphone touchscreens.

### 3.3 Software Interfaces
- **Express Backend API**: RESTful JSON service listening on Port 4000.
- **PostgreSQL Database Engine**: Communicates over standard TCP port 5432 using the `pg` connection pool.
- **OpenStreetMap Overpass API**: Outbound HTTP requests executing Overpass QL queries for tags:
  - `amenity=social_facility`
  - `office=ngo`
  - `office=charity`
  - `social_facility=soup_kitchen`
  - `amenity=food_sharing`
- **OSM Nominatim API**: Resolves coordinates $(lat, lng)$ into human-readable postal addresses.
- **OSRM Engine**: Fetches driving routes, transit distance (km), and travel duration (minutes).

### 3.4 Communications Interfaces
- **Transfer Protocol**: HTTPS / HTTP REST API with JSON payloads (`Content-Type: application/json`).
- **Security Standard**: JSON Web Tokens (JWT) using HMAC-SHA256 signature algorithm.
- **CORS Policies**: Express CORS middleware validating client origin (`CLIENT_ORIGIN` environment parameter).

---

## 4. SYSTEM FEATURES (FUNCTIONAL REQUIREMENTS)

```
+----------------------------------------------------------------------------------+
|                            SHAREBITE SYSTEM FEATURE MAP                          |
+-------------------+----------------------------------------+---------------------+
| Feature ID        | Feature Name                           | Priority            |
+-------------------+----------------------------------------+---------------------+
| [SF-01]           | User Authentication & RBAC             | High (Essential)    |
| [SF-02]           | Surplus Food Listing Management        | High (Essential)    |
| [SF-03]           | Geospatial Search & Map Discovery      | High (Essential)    |
| [SF-04]           | Food Reservation & Claim Processing    | High (Essential)    |
| [SF-05]           | Secure OTP Handover & Verification     | High (Essential)    |
| [SF-06]           | NGO Discovery & Direct Allocation      | Medium (Core)       |
| [SF-07]           | Turn-by-Turn Navigation & Geocoding    | Medium (Core)       |
| [SF-08]           | Automated Shelf-Life Cron Safety Engine| High (Essential)    |
| [SF-09]           | Admin Oversight & Partner Verification | Medium (Core)       |
| [SF-10]           | Digital Impact Certification           | Low (Enhancement)   |
+-------------------+----------------------------------------+---------------------+
```

### 4.1 System Feature 1: User Authentication & Role-Based Access Control (RBAC)
- **Description**: Provides secure registration, credential hashing, and JWT token issuance for `donor`, `claimer`, and `admin` roles.
- **Priority**: High (Essential)
- **Stimulus/Response Sequences**:
  - *Stimulus*: User submits registration form with email, password, and role.
  - *Response*: System verifies uniqueness, hashes password with Bcrypt, persists user, and returns signed JWT token.
- **Detailed Functional Requirements**:
  - `[FR-AUTH-01]`: The system SHALL allow users to register with name, email, password, role (`donor`, `claimer`, `admin`), phone, and physical address.
  - `[FR-AUTH-02]`: The system SHALL enforce uniqueness on user email addresses, returning HTTP 409 Conflict if an email is already registered.
  - `[FR-AUTH-03]`: The system SHALL hash passwords using Bcrypt with a work factor (salt rounds) $\ge 10$ prior to storage.
  - `[FR-AUTH-04]`: The system SHALL validate credentials on login and issue a signed JSON Web Token (JWT) with a 24-hour expiration.
  - `[FR-AUTH-05]`: The system SHALL authenticate requests bearing a valid `Authorization: Bearer <token>` header and attach the user profile to request context.
  - `[FR-AUTH-06]`: The system SHALL restrict administrative operations (e.g., verifying partners) strictly to users authenticated with `role: 'admin'`.

### 4.2 System Feature 2: Surplus Food Listing Management
- **Description**: Enables food donors to post, manage, and track surplus food items with perishability deadlines.
- **Priority**: High (Essential)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Donor submits new food details via `FoodModal`.
  - *Response*: Server validates inputs, persists listing in status `pending`, and publishes it to discovery feeds.
- **Detailed Functional Requirements**:
  - `[FR-FOOD-01]`: The system SHALL provide a submission endpoint `POST /api/listings` accepting `foodType`, `foodCategory` (`veg` or `non-veg`), `quantity`, `quantityUnit` (`servings`, `kg`, `boxes`), `preparedAt`, `expiresAt`, `address`, `lat`, and `lng`.
  - `[FR-FOOD-02]`: The system SHALL validate that `expiresAt` is chronologically later than `preparedAt` and later than current system time.
  - `[FR-FOOD-03]`: The system SHALL assign an initial status of `pending` to newly created listings.
  - `[FR-FOOD-04]`: The system SHALL link each listing to the donor's user ID and contact telephone number.
  - `[FR-FOOD-05]`: The system SHALL provide `GET /api/donor/listings` to allow donors to review their own active and historical listings.

### 4.3 System Feature 3: Geospatial Search, Radius Filtering & Map Discovery
- **Description**: Calculates Haversine distances to discover available food listings, NGOs, and food donors within dynamic radius bands.
- **Priority**: High (Essential)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Claimer adjusts radius filter to 15 km with dietary filter set to `veg`.
  - *Response*: Server executes proximity filtering and returns matching records sorted by selected criteria.
- **Detailed Functional Requirements**:
  - `[FR-MAP-01]`: The system SHALL compute distance $d$ in kilometers using the Haversine great-circle formula:
    $$d = 2R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$
    where $R = 6371\text{ km}$, $\phi$ is latitude, and $\lambda$ is longitude in radians.
  - `[FR-MAP-02]`: The system SHALL filter listings within selectable radial distances: 2 km, 5 km, 10 km, 15 km, 25 km, and 50 km.
  - `[FR-MAP-03]`: The system SHALL support dietary filtering by `all`, `veg`, and `non-veg`.
  - `[FR-MAP-04]`: The system SHALL support multi-attribute sorting by `expiry` (soonest expiring first), `distance` (nearest first), and `quantity` (largest first).
  - `[FR-MAP-05]`: The system SHALL plot listings, NGOs, and donors on an interactive Leaflet map using distinct marker styles:
    - User GPS: Pulsing Blue Radar Pin
    - Food Listings: Orange Pin
    - NGOs / Soup Kitchens: Blue Pin
    - Donating Restaurants: Emerald Pin

### 4.4 System Feature 4: Food Batch Reservation & Claim Processing
- **Description**: Allows authenticated claimers and NGOs to reserve available food batches and lock them against concurrent claims.
- **Priority**: High (Essential)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Claimer clicks "Claim Food" on an active listing.
  - *Response*: Server verifies availability, transitions status to `claimed`, generates a 6-digit OTP, and records claimer details.
- **Detailed Functional Requirements**:
  - `[FR-CLAIM-01]`: The system SHALL permit claiming via `POST /api/listings/:id/claim` only if the listing is currently in `pending` status and unexpired.
  - `[FR-CLAIM-02]`: The system SHALL update the listing's status to `claimed` and record `claimed_by`, `claimed_by_id`, and `claimed_at = NOW()`.
  - `[FR-CLAIM-03]`: The system SHALL prevent double-claiming through atomic state transitions.
  - `[FR-CLAIM-04]`: Upon successful claim, the system SHALL display the claim confirmation dialog (`ClaimSuccessModal`) containing donor contact, address, and OTP.

### 4.5 System Feature 5: Secure Cryptographic OTP Handover & Verification
- **Description**: Validates physical food collection using a two-party 6-digit One-Time Password protocol.
- **Priority**: High (Essential)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Claimer presents 6-digit OTP to donor upon arrival. Donor enters OTP into `OTPVerifyModal`.
  - *Response*: Server validates OTP match. On success, transitions listing status to `picked_up` and updates impact metrics.
- **Detailed Functional Requirements**:
  - `[FR-OTP-01]`: The system SHALL generate a 6-digit numeric OTP ($100000 \le \text{OTP} \le 999999$) using cryptographically strong pseudo-random generation upon claim.
  - `[FR-OTP-02]`: The system SHALL disclose the OTP strictly to the claiming party.
  - `[FR-OTP-03]`: The system SHALL provide `POST /api/listings/:id/verify-pickup` accepting `{ otp: "<6-digit-code>" }`.
  - `[FR-OTP-04]`: Upon verification match, the system SHALL set status to `picked_up`, record `picked_up_at = NOW()`, and invalidate the OTP.
  - `[FR-OTP-05]`: The system SHALL reject invalid OTP submissions with HTTP 400 Bad Request.

### 4.6 System Feature 6: Real-World NGO Discovery & Direct Allocation
- **Description**: Integrates OpenStreetMap Overpass queries with registered local NGOs and enables direct surplus allocation.
- **Priority**: Medium (Core)
- **Stimulus/Response Sequences**:
  - *Stimulus*: User opens "Nearby NGOs" tab.
  - *Response*: Server queries both local database and OSM Overpass API, merges results, removes duplicates, and returns sorted list.
- **Detailed Functional Requirements**:
  - `[FR-NGO-01]`: The system SHALL query OpenStreetMap Overpass API for nodes and ways tagged with `amenity=social_facility`, `office=ngo`, `office=charity`, or `social_facility=soup_kitchen`.
  - `[FR-NGO-02]`: The system SHALL deduplicate Overpass results against local database records based on proximity threshold ($< 200\text{ meters}$) and name similarity.
  - `[FR-NGO-03]`: The system SHALL permit donors to directly assign a food batch to a chosen NGO via `POST /api/listings/:id/assign-ngo`.
  - `[FR-NGO-04]`: The system SHALL provide an NGO registration endpoint `POST /api/ngo/register` capturing name, address, contact phone, capacity, and cause.

### 4.7 System Feature 7: Real-Time Turn-by-Turn Route Navigation & Geocoding
- **Description**: Delivers address geocoding and driving routes from claimer position to donor location.
- **Priority**: Medium (Core)
- **Stimulus/Response Sequences**:
  - *Stimulus*: User clicks "Get Directions" on a claimed food batch.
  - *Response*: System queries OSRM driving engine and renders the route polyline on the Leaflet map with distance and ETA.
- **Detailed Functional Requirements**:
  - `[FR-NAV-01]`: The system SHALL reverse geocode coordinates $(lat, lng)$ to street addresses via `GET /api/geocode/reverse` using OSM Nominatim.
  - `[FR-NAV-02]`: The system SHALL proxy turn-by-turn route calculations via `GET /api/route?startLat=...&startLng=...&endLat=...&endLng=...` returning polyline geometry, distance in km, and duration in minutes.
  - `[FR-NAV-03]`: The client SHALL render the calculated route polyline on the Leaflet map canvas.

### 4.8 System Feature 8: Automated Shelf-Life & Food Safety Cron Engine
- **Description**: Automatically invalidates food batches that exceed their safe consumption shelf-life deadline.
- **Priority**: High (Essential Safety)
- **Stimulus/Response Sequences**:
  - *Stimulus*: `node-cron` daemon triggers at schedule `* * * * *` (every 60 seconds).
  - *Response*: Engine executes batch update marking uncollected expired listings as `expired`.
- **Detailed Functional Requirements**:
  - `[FR-SAFE-01]`: The system SHALL run a scheduled background task every minute using `node-cron`.
  - `[FR-SAFE-02]`: The task SHALL update all listings where `status IN ('pending', 'claimed')` and `expires_at < NOW()` to status `expired`.
  - `[FR-SAFE-03]`: The system SHALL record the timestamp of expiration in `expired_at`.
  - `[FR-SAFE-04]`: Expired listings SHALL be excluded from active discovery feeds and blocked from claim attempts.

### 4.9 System Feature 9: Administrative Oversight, Partner Credentialing & Impact Analytics
- **Description**: Gives platform administrators oversight over ecosystem metrics and partner verification.
- **Priority**: Medium (Core)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Administrator requests metrics dashboard.
  - *Response*: Server calculates aggregated totals (meals saved, kg rescued, active listings, verified partners).
- **Detailed Functional Requirements**:
  - `[FR-ADM-01]`: The system SHALL aggregate metrics via `GET /api/admin/metrics` computing:
    - Total Meals Saved
    - Total Kilograms Rescued ($1\text{ serving} \approx 0.4\text{ kg}$, $1\text{ box} \approx 2.5\text{ kg}$)
    - Active Live Listings Count
    - Total Verified Partner Count
  - `[FR-ADM-02]`: The system SHALL provide `GET /api/admin/users` listing all registered users and partner organizations.
  - `[FR-ADM-03]`: The system SHALL allow administrators to toggle user verification status via `POST /api/admin/users/:id/verify`.

### 4.10 System Feature 10: Verifiable Digital Impact Certification
- **Description**: Generates printable/downloadable impact certificates for donors upon successful food pickup.
- **Priority**: Low (Enhancement)
- **Stimulus/Response Sequences**:
  - *Stimulus*: Donor clicks "Certificate" on a completed listing.
  - *Response*: System generates an impact certificate displaying donor name, meals saved, and verification stamp.
- **Detailed Functional Requirements**:
  - `[FR-CERT-01]`: The system SHALL provide an impact certificate modal for listings in `picked_up` status.
  - `[FR-CERT-02]`: The certificate SHALL detail donor name, date of pickup, quantity rescued, estimated carbon reduction, and unique listing reference.
  - `[FR-CERT-03]`: The modal SHALL provide a print trigger formatted for standard A4 landscape output.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance Requirements
- **[NFR-PERF-01] Response Time**: Active listing queries (`GET /api/listings`) SHALL respond in $\le 200\text{ ms}$ under normal load conditions.
- **[NFR-PERF-02] Spatial Calculation Throughput**: Haversine distance computations across 1,000 spatial nodes SHALL complete in $\le 50\text{ ms}$.
- **[NFR-PERF-03] External Service Timeout**: All outbound requests to OpenStreetMap (Overpass/Nominatim) SHALL enforce an abort timeout of 5000 ms with graceful fallback to local records.
- **[NFR-PERF-04] Client Map Rendering**: Leaflet map layers SHALL sustain 60 FPS rendering performance with up to 100 simultaneous active markers.

### 5.2 Safety & Food Health Requirements
- **[NFR-SAFE-01] Zero Tolerance for Expired Food**: The system SHALL strictly prohibit reservation, claiming, or pickup verification of listings whose `expires_at` timestamp has elapsed.
- **[NFR-SAFE-02] Dietary Allergen Categorization**: All food listings MUST carry mandatory dietary classification (`veg` vs `non-veg`) to prevent health and ethical violations.
- **[NFR-SAFE-03] Complete Lifecycle Audit Trail**: Every status transition (`pending` $\rightarrow$ `claimed` $\rightarrow$ `picked_up` / `expired`) MUST record an immutable UTC timestamp.

### 5.3 Security Requirements
- **[NFR-SEC-01] Password Cryptographic Storage**: User passwords SHALL NEVER be stored in plaintext. Passwords must be hashed using Bcrypt with salt rounds $\ge 10$.
- **[NFR-SEC-02] JWT Token Integrity**: State-changing endpoints SHALL require a valid JWT token signed with HMAC-SHA256 transmitted via the `Authorization: Bearer <token>` header.
- **[NFR-SEC-03] SQL Injection Prevention**: All database interactions with PostgreSQL SHALL use parameterized SQL statements (`$1, $2, ...`) without string concatenation.
- **[NFR-SEC-04] OTP Cryptographic Strength**: The 6-digit pickup verification OTP MUST be generated via cryptographically secure pseudo-random generators with an entropy space of $10^6$ combinations.
- **[NFR-SEC-05] Cross-Origin Security**: The backend SHALL enforce CORS policies restricting resource access to authorized origins.

### 5.4 Software Quality Attributes
- **Availability (99.9%)**: The backend features a dual-mode persistence architecture; if PostgreSQL is unavailable, the application immediately falls back to an in-memory data store without downtime.
- **Reliability**: Mean Time Between Failures (MTBF) SHALL exceed 720 hours. Global error-handling middleware intercepts all runtime exceptions without process termination.
- **Usability**: The application interface allows a volunteer to claim a food batch in $\le 3$ clicks from the home dashboard. Responsive themes (Light/Dark) enhance visual accessibility.
- **Maintainability**: Layered architectural design separating routes (`server/src/index.js`), data access (`server/src/db.js`), external geocoding (`server/src/services/osmService.js`), and React UI components.
- **Portability**: Platform-agnostic execution across Windows, macOS, and Linux operating systems with zero native compilation dependencies.

### 5.5 Business Rules
- **[BR-01] Exclusive Reservation Rule**: A food listing can be reserved by at most one claiming organization at a time.
- **[BR-02] Mandatory Physical Handover Rule**: Donors SHALL NOT release physical food items without verifying the 6-digit OTP presented by the volunteer.
- **[BR-03] Free Charitable Distribution Rule**: All food items listed on ShareBite are legally designated as free donations; no monetary transactions are permitted.

---

## 6. DATA MODEL & DATABASE REQUIREMENTS

### 6.1 Relational Schema & Storage Architecture
The persistence tier utilizes PostgreSQL with automatic table creation and data seeding via `initDatabase()` and `runMigrations()`.

```
               +-----------------------------+
               |            USERS            |
               +-----------------------------+
               | id (PK)                     |
               | email (UNIQUE)              |
               | password_hash               |
               | role                        |
               | verified                    |
               +--------------+--------------+
                              | 1
                              |
                              | has many
                              |
                              | *
               +--------------v--------------+
               |          LISTINGS           |
               +-----------------------------+
               | id (PK)                     |
               | donor_id (FK -> users.id)   |
               | food_type                   |
               | food_category (veg/non-veg) |
               | quantity & quantity_unit    |
               | prepared_at & expires_at    |
               | status                      |
               | claimed_by_id (FK)          |
               | otp                         |
               | picked_up_at                |
               +-----------------------------+
```

### 6.2 Entity-Relationship Specifications

#### 6.2.1 Table: `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) NOT NULL,
  verified BOOLEAN DEFAULT false,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6.2.2 Table: `listings`
```sql
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(64) PRIMARY KEY,
  donor_id VARCHAR(64) NOT NULL REFERENCES users(id),
  donor_name VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(64),
  food_type VARCHAR(255) NOT NULL,
  food_category VARCHAR(32) DEFAULT 'veg',
  quantity NUMERIC NOT NULL,
  quantity_unit VARCHAR(32) DEFAULT 'servings',
  prepared_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(32) DEFAULT 'pending',
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  claimed_by VARCHAR(255),
  claimed_by_id VARCHAR(64),
  otp VARCHAR(16),
  claimed_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6.2.3 Table: `ngos`
```sql
CREATE TABLE IF NOT EXISTS ngos (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cause VARCHAR(255),
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  contact_phone VARCHAR(64),
  contact_email VARCHAR(255),
  verified BOOLEAN DEFAULT true,
  capacity NUMERIC DEFAULT 500,
  operating_hours VARCHAR(128) DEFAULT '08:00 - 22:00',
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6.2.4 Table: `donors`
```sql
CREATE TABLE IF NOT EXISTS donors (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(64) DEFAULT 'Restaurant',
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(255),
  verified BOOLEAN DEFAULT true,
  total_donations NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. APPENDICES

### 7.1 Appendix A: Glossary of Terms & Acronyms

| Term / Acronym | Full Form & Contextual Definition |
| :--- | :--- |
| **API** | Application Programming Interface (REST JSON endpoints) |
| **Bcrypt** | Password hashing function based on the Blowfish cipher with adaptive salt |
| **CORS** | Cross-Origin Resource Sharing |
| **DDL** | Data Definition Language (`CREATE TABLE`, `ALTER TABLE`) |
| **FSSAI** | Food Safety and Standards Authority of India |
| **GIS** | Geographic Information System |
| **GPS** | Global Positioning System (W3C HTML5 Geolocation) |
| **Haversine** | Trigonometric formula calculating spherical distance between two coordinates |
| **IEEE** | Institute of Electrical and Electronics Engineers |
| **JWT** | JSON Web Token (RFC 7519 standard for token authorization) |
| **MTBF** | Mean Time Between Failures |
| **NGO** | Non-Governmental Organization (charitable relief foundation) |
| **Nominatim** | OpenStreetMap reverse geocoding engine |
| **OSM** | OpenStreetMap (open-access global geospatial database) |
| **OSRM** | Open Source Routing Machine (turn-by-turn road routing engine) |
| **OTP** | One-Time Password (6-digit numeric verification code) |
| **Overpass QL** | OpenStreetMap Overpass Query Language |
| **RBAC** | Role-Based Access Control (`donor`, `claimer`, `admin`) |
| **RTM** | Requirements Traceability Matrix |
| **SDLC** | Software Development Life Cycle |
| **SPA** | Single-Page Application (React 19 client architecture) |
| **SRS** | Software Requirements Specification |
| **UTC** | Coordinated Universal Time |

### 7.2 Appendix B: Requirements Traceability Matrix (RTM)

| Requirement ID | Module / Component | Implementation Code Reference | Verification Method | Acceptance Test ID |
| :--- | :--- | :--- | :--- | :--- |
| **[FR-AUTH-01]** | Auth Engine | `server/src/index.js:61-88` | Integration Test | `TC-AUTH-01` |
| **[FR-AUTH-03]** | Security | `server/src/index.js:73` | Unit Test | `TC-SEC-01` |
| **[FR-AUTH-04]** | JWT Token | `server/src/index.js:25-31` | Unit Test | `TC-AUTH-02` |
| **[FR-FOOD-01]** | Food Module | `server/src/index.js:131-145` | Functional Test | `TC-FOOD-01` |
| **[FR-FOOD-02]** | Food Safety | `server/src/db.js:560-575` | Boundary Test | `TC-SAFE-01` |
| **[FR-MAP-01]** | GIS Engine | `server/src/db.js:520-530` | Mathematical Test | `TC-GEO-01` |
| **[FR-MAP-02]** | Discovery | `server/src/index.js:115-129` | Functional Test | `TC-GEO-02` |
| **[FR-MAP-05]** | Map Canvas | `client/src/App.jsx:320-390` | UI Visual Test | `TC-UI-01` |
| **[FR-CLAIM-01]**| Claim Engine | `server/src/index.js:157-168` | Concurrency Test | `TC-CLAIM-01` |
| **[FR-OTP-01]** | OTP Security | `server/src/db.js:650-660` | Entropy Test | `TC-OTP-01` |
| **[FR-OTP-03]** | Verification | `server/src/index.js:184-199` | Integration Test | `TC-OTP-02` |
| **[FR-NGO-01]** | OSM Overpass | `server/src/services/osmService.js:15-80` | External API Test | `TC-EXT-01` |
| **[FR-NAV-01]** | Nominatim | `server/src/services/osmService.js:82-120` | External API Test | `TC-EXT-02` |
| **[FR-NAV-02]** | OSRM Routing | `server/src/index.js:286-302` | Route Geometry Test | `TC-NAV-01` |
| **[FR-SAFE-01]**| Cron Sweeper | `server/src/index.js:378-382` | Automated Timer Test | `TC-SAFE-02` |
| **[FR-ADM-01]** | Admin Hub | `server/src/index.js:341-348` | Aggregation Test | `TC-ADM-01` |
| **[FR-ADM-03]** | Admin Hub | `server/src/index.js:359-367` | Security & RBAC Test | `TC-ADM-02` |
| **[FR-CERT-01]**| Certification| `client/src/components/modals/ImpactCertificateModal.jsx` | UI Print Test | `TC-UI-02` |

---
**[End of Software Requirements Specification Document]**
