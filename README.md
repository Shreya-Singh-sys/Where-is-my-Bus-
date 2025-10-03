# Where Is My Bus? – Track.Plan.Ride.
A mobile/web solution for real-time bus tracking and ETA estimation, optimized for low-bandwidth environments in small cities and tier-2 towns.

## 🚍 Features

- Real-time **GPS device-based bus tracking** (integrated in buses)
- Estimated Arrival Time (ETA) at each stop
- Offline-friendly features (timetable, route info)
- Multi-language support (Hindi, English, regional languages)
- Lightweight, low-bandwidth optimized UI

## 🏗️ System Architecture

- **Commuter App:** Flutter (mobile/web, lightweight, offline-ready).
- **Backend API:** Node.js + Express, PostgreSQL, Firebase Realtime DB, MQTT/WebSockets.
- **Bus GPS Hardware:** SIM-enabled IoT tracker on each bus (no driver action needed).
- **Admin Web Dashboard:** Real-time fleet monitoring, analytics.

## 🛠️ Tech Stack

| Layer       | Technology                | Purpose                          |
|-------------|--------------------------|-----------------------------------|
| Frontend    | Flutter                  | Cross-platform mobile/web app     |
| Backend     | Node.js + Express        | APIs, sockets, real-time logic    |
| Real-Time   | MQTT/WebSockets          | Live GPS data                     |
| Database    | PostgreSQL, Firebase     | Structured + real-time storage    |
| Maps        | Google Maps, OSM         | Mapping and routing               |
| Notifications| Firebase Cloud Messaging| Push alerts                       |
| Hosting     | Firebase, AWS/GCP        | Scalable deployments              |

## 🛠️ Getting Started 

### Prerequisites
Ensure you have the following services running and configured:
- Node.js (v18+) and npm
- PostgreSQL Server
- A Firebase Project (with Realtime Database enabled)
- An MQTT Broker (e.g., Mosquitto, HiveMQ)

### Installation
1.  **Clone the repository:**
    

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configuration:** Create a file named **`.env`** in the root directory and populate it with your specific database, Firebase, and MQTT credentials.

## 🚀 Running the Server

Use the following commands to manage the backend API service:

| Command | Environment | Description |
| :--- | :--- | :--- |
| `npm run dev` | **Development Mode** | Starts the server using **Nodemon** for automatic restarts on file changes. |
| `npm start` | **Production Mode** | Starts the server using Node.js directly. |
| `npm test` | **Testing** | Executes all unit and integration tests using **Jest**. |

## 📄 Project Details

### Directory Structure
The source code is organized within the `src/` directory, following an MVC pattern with dedicated worker processes:
- `config/`: Database and service initialization.
- `controllers/`: API request handling.
- `middleware/` : JWT authentication and request validation.
- `services/`: Core logic (ETA calculation, notifications, data archiving).
- `processes/`: Background workers (MQTT Listener, ETA scheduler).
- `models/`: PostgreSQL schemas.
- `routes/`: API endpoint definitions.

### Credits & License
Authored by: 

This project is licensed under the ISC License.
