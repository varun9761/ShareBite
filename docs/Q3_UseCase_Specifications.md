# QUESTION 3: PRECONDITIONS, POSTCONDITIONS & FUNCTIONS OF USE CASES
## Project: ShareBite (Surplus Food Recovery & Distribution Platform)

---

## 1. OVERVIEW

This document states the **Function (Description)**, **Preconditions**, and **Postconditions** for each core Use Case identified in the ShareBite platform, formatted according to standard software engineering documentation specifications.

---

## 2. DETAILED USE CASE SPECIFICATIONS

### UC-01: User Registration & Authentication
- **Function**: Allows new users (donors, claimers, admins) to securely register an account, hash credentials using Bcrypt, and receive a signed JWT upon login.
- **Preconditions**: User must have a valid email address and network access to the application.
- **Postconditions (Success)**: User record is persisted in the database; a valid 24-hour JSON Web Token (JWT) is returned and stored in the client session.
- **Postconditions (Failure)**: If email already exists or password validation fails, system responds with an HTTP 409 or 401 status and no token is issued.

---

### UC-02: Post Surplus Food Listing
- **Function**: Enables food donors to publish excess edible food with food type, category (`veg`/`non-veg`), quantity, unit, preparation timestamp, safe-by expiration timestamp, and GPS address.
- **Preconditions**:
  1. The user must be authenticated with `role: 'donor'`.
  2. Safe-by expiration time must be chronologically greater than the preparation time and current system time.
- **Postconditions (Success)**: The listing is persisted in status `pending` and immediately visible on the public discovery map and listings feed.
- **Postconditions (Failure)**: If required parameters are missing or invalid, an HTTP 400 error is returned and no listing is saved.

---

### UC-03: Set Expiry & Perishability Time (`<<include>>` in UC-02)
- **Function**: Calculates and sets the maximum safe consumption window (shelf-life deadline) for a surplus food batch to prevent foodborne illness.
- **Preconditions**: The donor is actively creating or updating a food listing.
- **Postconditions (Success)**: `expires_at` timestamp is computed and bound to the listing record.
- **Postconditions (Failure)**: If the selected time is in the past, form submission is blocked with an validation alert.

---

### UC-04: View & Manage Donor Listings
- **Function**: Displays a donor's published listings grouped by status (`pending`, `claimed`, `picked_up`, `expired`) along with recipient details and action triggers.
- **Preconditions**: Donor must be authenticated.
- **Postconditions (Success)**: The client displays all listings created by the donor with real-time countdown timers.
- **Postconditions (Failure)**: Empty list is rendered if no listings exist.

---

### UC-05: Browse & Search Surplus Food
- **Function**: Allows claimers and NGOs to discover available surplus food listings in real time via an interactive list and multi-layer Leaflet map.
- **Preconditions**: Client location coordinates must be set (via live GPS or selected city preset).
- **Postconditions (Success)**: System returns all active unexpired listings within the designated geographic scope.
- **Postconditions (Failure)**: If no surplus is available within range, a polite "No listings found in this radius" notice is displayed.

---

### UC-06: Apply Proximity & Dietary Filters (`<<extend>>` to UC-05)
- **Function**: Filters the surplus food discovery feed by radial distance (2, 5, 10, 15, 25, 50 km) and dietary preference (`All`, `Veg`, `Non-Veg`).
- **Preconditions**: User is actively browsing the surplus food catalog.
- **Postconditions (Success)**: The listings feed and map marker pins dynamically re-render to display only records satisfying both criteria.
- **Postconditions (Failure)**: Reverts to unfiltered view if reset is triggered.

---

### UC-07: Claim Surplus Food Batch
- **Function**: Allows a verified claimer/NGO to reserve an active food listing, preventing other organizations from claiming the same batch.
- **Preconditions**:
  1. User is authenticated as a `claimer` (or submits valid NGO credentials).
  2. The target listing must be in status `pending` and its `expires_at` timestamp must not have passed.
- **Postconditions (Success)**:
  1. Listing status transitions from `pending` to `claimed`.
  2. Listing is assigned to `claimed_by` and `claimed_at = NOW()`.
  3. A unique 6-digit verification OTP is generated (`UC-08`).
  4. Confirmation modal opens showing pickup instructions and donor contact.
- **Postconditions (Failure)**: If listing is already claimed or expired, claim request is rejected with HTTP 404/400.

---

### UC-08: Generate 6-Digit Pickup OTP (`<<include>>` in UC-07)
- **Function**: Generates a pseudo-random, cryptographically secure 6-digit numeric OTP ($100000 \le \text{OTP} \le 999999$) bound to the claimed listing.
- **Preconditions**: Listing state transition to `claimed` has been initiated.
- **Postconditions (Success)**: OTP string is saved to the listing row and returned exclusively to the claimer's session.
- **Postconditions (Failure)**: System rolls back claim transaction if OTP generation fails.

---

### UC-09: Verify Pickup via OTP
- **Function**: Enables the donor to enter the 6-digit OTP recited by the collection volunteer to confirm authentic physical handover.
- **Preconditions**:
  1. Listing must currently be in status `claimed`.
  2. Volunteer has physically arrived at the donor venue.
- **Postconditions (Success)**:
  1. Listing status transitions to `picked_up`.
  2. `picked_up_at` timestamp is stamped.
  3. Global social impact counters (meals saved, kg rescued) are incremented.
  4. Impact certificate becomes accessible (`UC-14`).
- **Postconditions (Failure)**: If submitted OTP does not match, status remains `claimed` and an HTTP 400 error alert is shown.

---

### UC-10: Discover Real-Time NGOs
- **Function**: Queries OpenStreetMap Overpass API and local database to display real-world charities, soup kitchens, and relief foundations near the user's location.
- **Preconditions**: Valid latitude, longitude, and search radius provided.
- **Postconditions (Success)**: Returns deduplicated, Haversine-distance sorted list of NGOs with contact info and map coordinates.
- **Postconditions (Failure)**: If OSM API times out (5000 ms), gracefully returns local database NGO records without throwing errors.

---

### UC-11: Get Turn-by-Turn Navigation
- **Function**: Computes driving route polyline, total distance in km, and estimated transit time in minutes between claimer GPS and donor address.
- **Preconditions**: Start and end coordinate pairs must be valid numeric lat/lng values.
- **Postconditions (Success)**: Polyline coordinates and transit stats are returned and plotted as a navigation path on the Leaflet map.
- **Postconditions (Failure)**: If routing engine is unreachable, straight-line distance is computed and displayed.

---

### UC-12: Auto-Expire Stale Listings (Safety Daemon)
- **Function**: Automated background worker that runs every minute to scan for uncollected listings exceeding their safe-by timestamp and marks them `expired`.
- **Preconditions**: Node.js backend process is running and `node-cron` scheduler is active.
- **Postconditions (Success)**: All listings where `expires_at < NOW()` and `status IN ('pending', 'claimed')` are updated to `status = 'expired'`.
- **Postconditions (Failure)**: Error is logged to server console without crashing the server process.

---

### UC-13: Audit Metrics & Verify Partners
- **Function**: Enables system administrators to inspect platform-wide rescue impact and verify newly registered partner credentials with 1 click.
- **Preconditions**: User must be authenticated with `role: 'admin'`.
- **Postconditions (Success)**: Aggregated totals (meals, kg, active listings, verified partners) are computed; partner `verified` flag is toggled to `true`.
- **Postconditions (Failure)**: Non-admin users are rejected with HTTP 403 Forbidden.

---

### UC-14: View & Download Impact Certificate (`<<include>>` in UC-09)
- **Function**: Generates a formatted digital certificate acknowledging the donor's contribution to hunger relief and carbon reduction.
- **Preconditions**: Target listing must have status `picked_up`.
- **Postconditions (Success)**: Renders digital certificate modal with donor name, meal count, kg saved, and print/export button.
- **Postconditions (Failure)**: Certificate is unavailable for uncollected or expired listings.

---

### UC-15: Direct Dispatch to Selected NGO
- **Function**: Allows donors to bypass open marketplace claims by directly selecting a specific verified NGO discovered on the map and assigning an active food batch to them.
- **Preconditions**: Donor has an active `pending` listing and selects a valid NGO from the directory.
- **Postconditions (Success)**: Listing is assigned directly to the chosen NGO with generated OTP.
- **Postconditions (Failure)**: Reverts to pending public listing if assignment fails.
