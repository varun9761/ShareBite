# QUESTION 2: USE CASE DIAGRAM & ACTOR ROLE SPECIFICATIONS
## Project: ShareBite (Surplus Food Recovery & Distribution Platform)

---

## 1. ACTOR IDENTIFICATION & ROLE SPECIFICATIONS

In the ShareBite ecosystem, actors are classified into **Primary Actors** (human users initiating interactions to achieve business goals) and **Secondary / Supporting Actors** (external services or automated agents invoked by the system).

| Actor Name | Type | Role & Responsibilities in ShareBite |
| :--- | :--- | :--- |
| **Food Donor** | Primary | Commercial food establishments (restaurants, bakeries, caterers, banquet halls).<br>• Publishes surplus food batches with quantity, food type, and expiry time.<br>• Tracks active, claimed, and historical donations.<br>• Validates the 6-digit OTP presented by the volunteer upon collection.<br>• Views and prints verified Impact Certificates. |
| **Claimer / NGO Volunteer** | Primary | Non-profit organizations, charities, food banks, shelters, and relief volunteers.<br>• Explores surplus food and registered NGOs via interactive map and list views.<br>• Applies proximity radius (2–50 km) and dietary filters (Veg/Non-Veg).<br>• Claims/reserves surplus food batches and receives a secure 6-digit OTP.<br>• Views turn-by-turn driving navigation to the donor location. |
| **System Administrator** | Primary | System auditors and platform overseers.<br>• Monitors system-wide health and aggregated social impact metrics.<br>• Reviews newly registered donors and NGOs, verifying their credentials with 1-click. |
| **OpenStreetMap & Routing Engine** | Supporting / External Service | External GIS provider (OSM Overpass, Nominatim, and OSRM).<br>• Resolves latitude/longitude into human-readable physical addresses.<br>• Provides real-time POI data for nearby NGOs and charities.<br>• Calculates polyline driving geometries, transit distance, and ETA. |
| **HTML5 GPS Service** | Supporting / External Service | Client device hardware/browser location sensor.<br>• Provides live high-accuracy geographic coordinates $(lat, lng)$ for user centering. |
| **Safety Cron Daemon** | Supporting / Automated Agent | Server-side scheduled worker (`node-cron`).<br>• Executes automated sweeps every 60 seconds to invalidate expired food batches. |

---

## 2. UML USE CASE DIAGRAM

```mermaid
flowchart LR
    %% Actors
    subgraph Primary_Actors ["Primary Actors"]
        Donor["👨‍🍳 Food Donor\n(Restaurant / Caterer)"]
        Claimer["🧑‍🤝‍🧑 Claimer\n(NGO / Volunteer)"]
        Admin["🛡️ Administrator"]
    end

    subgraph Secondary_Actors ["Supporting & External Systems"]
        OSM["🗺️ OpenStreetMap / OSRM\n(GIS & Routing Services)"]
        Cron["⏱️ Safety Cron Daemon\n(Scheduled Task)"]
    end

    %% ShareBite System Boundary
    subgraph ShareBite ["System Boundary: ShareBite Platform"]
        UC1(["UC-01: Register & Login (RBAC)"])
        UC2(["UC-02: Post Surplus Food Listing"])
        UC3(["UC-03: Set Expiry & Perishability Time"])
        UC4(["UC-04: View & Manage Donor Listings"])
        UC5(["UC-05: Browse & Search Surplus Food"])
        UC6(["UC-06: Apply Proximity & Dietary Filters"])
        UC7(["UC-07: Claim Surplus Food Batch"])
        UC8(["UC-08: Generate 6-Digit Pickup OTP"])
        UC9(["UC-09: Verify Pickup via OTP"])
        UC10(["UC-10: Discover Real-Time NGOs"])
        UC11(["UC-11: Get Turn-by-Turn Navigation"])
        UC12(["UC-12: Auto-Expire Stale Listings"])
        UC13(["UC-13: Audit Metrics & Verify Partners"])
        UC14(["UC-14: View & Download Impact Certificate"])
        UC15(["UC-15: Direct Dispatch to Selected NGO"])
    end

    %% Donor Relationships
    Donor --> UC1
    Donor --> UC2
    Donor --> UC4
    Donor --> UC9
    Donor --> UC14
    Donor --> UC15

    %% Claimer Relationships
    Claimer --> UC1
    Claimer --> UC5
    Claimer --> UC7
    Claimer --> UC10
    Claimer --> UC11

    %% Admin Relationships
    Admin --> UC1
    Admin --> UC13

    %% Include & Extend Relationships
    UC2 -. "<<include>>" .-> UC3
    UC5 -. "<<extend>>" .-> UC6
    UC7 -. "<<include>>" .-> UC8
    UC9 -. "<<include>>" .-> UC14

    %% Secondary Actor Connections
    UC10 <--> OSM
    UC11 <--> OSM
    Cron --> UC12
```

---

## 3. USE CASE RELATIONSHIP MATRIX

| Use Case ID | Use Case Name | Primary Actor | Associated Secondary Actors | Relationship Type |
| :--- | :--- | :--- | :--- | :--- |
| **UC-01** | Register & Login | Donor, Claimer, Admin | None | Base |
| **UC-02** | Post Surplus Food Listing | Food Donor | None | Base |
| **UC-03** | Set Expiry & Perishability Time | Food Donor | None | `<<include>>` in UC-02 |
| **UC-04** | View & Manage Listings | Food Donor | None | Base |
| **UC-05** | Browse & Search Surplus Food | Claimer / NGO | None | Base |
| **UC-06** | Apply Proximity & Dietary Filters | Claimer / NGO | None | `<<extend>>` to UC-05 |
| **UC-07** | Claim Surplus Food Batch | Claimer / NGO | None | Base |
| **UC-08** | Generate 6-Digit Pickup OTP | System | None | `<<include>>` in UC-07 |
| **UC-09** | Verify Pickup via OTP | Food Donor | None | Base |
| **UC-10** | Discover Real-Time NGOs | Claimer, Donor | OpenStreetMap Overpass | Base |
| **UC-11** | Get Turn-by-Turn Navigation | Claimer / NGO | OSRM Routing Service | Base |
| **UC-12** | Auto-Expire Stale Listings | Safety Cron Daemon | None | Base (Automated) |
| **UC-13** | Audit Metrics & Verify Partners | Administrator | None | Base |
| **UC-14** | Download Impact Certificate | Food Donor | None | `<<include>>` in UC-09 |
| **UC-15** | Direct Dispatch to Selected NGO | Food Donor | OpenStreetMap Overpass | Base |
