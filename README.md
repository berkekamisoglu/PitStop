# Spring Roadside Assistance Project

This project provides a comprehensive digital solution for roadside tire assistance, combining a robust Spring Boot backend with a responsive React frontend. It aims to streamline tire-related roadside services efficiently.

## Features

* **User Authentication:** Secure authentication and authorization with JWT.
* **Request Management:** Create, track, and manage roadside assistance requests.
* **Real-time Notifications:** Immediate updates on request status via notifications.
* **Role-Based Access Control (RBAC):** Permissions management for customers, assistance providers, and admins.
* **Integration with Google Maps:** Location-based services for quick assistance dispatch.

## Tech Stack

* **Backend:** Spring Boot, Java
* **Frontend:** React, TypeScript
* **Database:** Microsoft SQL Server
* **Authentication:** JWT
* **Mapping:** Google Maps API
* **Tools & Practices:** Git, GitHub Actions, Maven, IntelliJ IDEA, Docker

## Getting Started

### Prerequisites

* Java 17+
* Node.js 18+
* MYSQL Server
* Leaflet Maps API Key

### Installation

1. Clone the repository

```bash
git clone https://github.com/berkekamisoglu/PitStop.git
```

2. Navigate to project directory

```bash
cd spring-roadside-assistance
```

3. Set up Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

4. Set up Frontend

```bash
cd frontend
npm install
npm start
```

## Usage

Access the frontend application at:

```
http://localhost:3000
```

Backend API endpoint available at:

```
http://localhost:8080/api
```

## Contributing

Feel free to open issues and submit pull requests. For major changes, please discuss via email first.

Contact: **[berkekamisoglu1@gmail.com](mailto:berkekamisoglu1@gmail.com)**


---

© 2025 Berke Kamisoğlu
