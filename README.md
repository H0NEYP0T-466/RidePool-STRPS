# RidePool-STRPS

<p align="center">

  <!-- Core -->
  ![GitHub License](https://img.shields.io/github/license/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=brightgreen)  
  ![GitHub Stars](https://img.shields.io/github/stars/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=yellow)  
  ![GitHub Forks](https://img.shields.io/github/forks/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blue)  
  ![GitHub Issues](https://img.shields.io/github/issues/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=red)  
  ![GitHub Pull Requests](https://img.shields.io/github/issues-pr/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=orange)  
  ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)  

  <!-- Activity -->
  ![Last Commit](https://img.shields.io/github/last-commit/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=purple)  
  ![Commit Activity](https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=teal)  
  ![Repo Size](https://img.shields.io/github/repo-size/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blueviolet)  
  ![Code Size](https://img.shields.io/github/languages/code-size/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=indigo)  

  <!-- Languages -->
  ![Top Language](https://img.shields.io/github/languages/top/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=critical)  
  ![Languages Count](https://img.shields.io/github/languages/count/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=success)  

  <!-- Optional CI/Security -->
  ![Build Status](https://img.shields.io/badge/CI-Not%20Configured-lightgrey?style=for-the-badge&logo=github)  
  ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=red)  

  <!-- Community -->
  ![Discussions](https://img.shields.io/github/discussions/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blue)  
  ![Documentation](https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white)  
  ![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)  

</p>

Smart transportation & ride-pooling system with rider, driver, and admin experiences for booking, pooling, live tracking, and operational oversight.

## 🔗 Links
- Demo: _TBD_
- Docs: [`/docs`](./docs)
- Issues: [github.com/H0NEYP0T-466/RidePool-STRPS/issues](https://github.com/H0NEYP0T-466/RidePool-STRPS/issues)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📑 Table of Contents
- [🔗 Links](#-links)
- [🚀 Installation](#-installation)
- [⚡ Usage](#-usage)
- [✨ Features](#-features)
- [📂 Folder Structure](#-folder-structure)
- [📦 Submodules](#-submodules)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🛡 Security](#-security)
- [📏 Code of Conduct](#-code-of-conduct)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Dependencies & Packages](#-dependencies--packages)

## 🚀 Installation
### Prerequisites
- Node.js 18+
- npm
- Python 3.10+
- MongoDB (local or Atlas)

### Frontend Setup
```bash
npm install
npm run dev
# Production build
npm run build
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# configure .env (copy from .env.example if present)
uvicorn app.main:socket_app --host 0.0.0.0 --port 8888 --reload
```

## ⚡ Usage
- **Development**: run `npm run dev` for the Vite dev server and `uvicorn` for the FastAPI backend.
- **Building**: `npm run build` bundles the frontend for production.
- **Seeding**: execute `python backend/seed_data/seed.py` after configuring MongoDB to load sample data.

## ✨ Features
- Rider booking with pooling support and live driver tracking.
- Driver workflows for accepting, routing, and completing rides.
- Admin dashboards for monitoring trips, users, drivers, and revenue.
- JWT-secured API with Socket.IO-powered realtime updates.
- Map visualization with Leaflet and location-aware trip flows.

## 📂 Folder Structure
Auto-generated overview of key directories:
```
.
├─ backend/
│  ├─ app/                # FastAPI application modules
│  └─ seed_data/          # Sample data loaders
├─ docs/                  # API and schema documentation
├─ public/                # Static assets served by Vite
├─ src/                   # React + TypeScript frontend
│  ├─ assets/             # Images and icons
│  ├─ components/         # UI components (common, user, driver, admin)
│  ├─ context/            # React context providers
│  ├─ pages/              # Route-level pages
│  ├─ services/           # API and websocket clients
│  ├─ types/              # Shared TypeScript types
│  └─ utils/              # Helpers and utilities
└─ vite.config.ts         # Vite configuration
```

## 📦 Submodules
No Git submodules detected in this repository.

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, coding standards, and pull request guidance.

## 📜 License
Distributed under the [MIT License](./LICENSE).

## 🛡 Security
Security guidelines and reporting instructions are available in [SECURITY.md](./SECURITY.md).

## 📏 Code of Conduct
Participation in this project is governed by the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## 🛠 Tech Stack
**Languages**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Frameworks & Libraries**

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.0-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Databases**

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

**DevOps / CI / Tools**

![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automation-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![npm](https://img.shields.io/badge/npm-Registry-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Dev%20Server-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Cloud / Hosting**

![Self Hosted](https://img.shields.io/badge/Hosting-Self--managed-lightgrey?style=for-the-badge&logo=serverfault&logoColor=white)

## 📦 Dependencies & Packages
<details>
<summary>Runtime Dependencies</summary>

**Frontend**

[![react](https://img.shields.io/npm/v/react?style=for-the-badge&label=react)](https://www.npmjs.com/package/react)
[![react-dom](https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=react-dom)](https://www.npmjs.com/package/react-dom)
[![react-router-dom](https://img.shields.io/npm/v/react-router-dom?style=for-the-badge&label=react-router-dom)](https://www.npmjs.com/package/react-router-dom)
[![axios](https://img.shields.io/npm/v/axios?style=for-the-badge&label=axios)](https://www.npmjs.com/package/axios)
[![leaflet](https://img.shields.io/npm/v/leaflet?style=for-the-badge&label=leaflet)](https://www.npmjs.com/package/leaflet)
[![socket.io-client](https://img.shields.io/npm/v/socket.io-client?style=for-the-badge&label=socket.io-client)](https://www.npmjs.com/package/socket.io-client)

**Backend**

[![fastapi](https://img.shields.io/pypi/v/fastapi?style=for-the-badge&label=fastapi)](https://pypi.org/project/fastapi/)
[![uvicorn](https://img.shields.io/pypi/v/uvicorn?style=for-the-badge&label=uvicorn)](https://pypi.org/project/uvicorn/)
[![pymongo](https://img.shields.io/pypi/v/pymongo?style=for-the-badge&label=pymongo)](https://pypi.org/project/pymongo/)
[![python-jose](https://img.shields.io/pypi/v/python-jose?style=for-the-badge&label=python-jose)](https://pypi.org/project/python-jose/)
[![bcrypt](https://img.shields.io/pypi/v/bcrypt?style=for-the-badge&label=bcrypt)](https://pypi.org/project/bcrypt/)
[![python-multipart](https://img.shields.io/pypi/v/python-multipart?style=for-the-badge&label=python-multipart)](https://pypi.org/project/python-multipart/)
[![python-socketio](https://img.shields.io/pypi/v/python-socketio?style=for-the-badge&label=python-socketio)](https://pypi.org/project/python-socketio/)
[![python-dotenv](https://img.shields.io/pypi/v/python-dotenv?style=for-the-badge&label=python-dotenv)](https://pypi.org/project/python-dotenv/)
[![pydantic](https://img.shields.io/pypi/v/pydantic?style=for-the-badge&label=pydantic)](https://pypi.org/project/pydantic/)
[![email-validator](https://img.shields.io/pypi/v/email-validator?style=for-the-badge&label=email-validator)](https://pypi.org/project/email-validator/)

</details>

<details>
<summary>Dev / Build / Test Dependencies</summary>

[![typescript](https://img.shields.io/npm/v/typescript?style=for-the-badge&label=typescript)](https://www.npmjs.com/package/typescript)
[![vite](https://img.shields.io/npm/v/vite?style=for-the-badge&label=vite)](https://www.npmjs.com/package/vite)
[![eslint](https://img.shields.io/npm/v/eslint?style=for-the-badge&label=eslint)](https://www.npmjs.com/package/eslint)
[![@typescript-eslint](https://img.shields.io/npm/v/typescript-eslint?style=for-the-badge&label=typescript-eslint)](https://www.npmjs.com/package/typescript-eslint)
[![@vitejs/plugin-react](https://img.shields.io/npm/v/@vitejs/plugin-react?style=for-the-badge&label=@vitejs/plugin-react)](https://www.npmjs.com/package/@vitejs/plugin-react)
[![@eslint/js](https://img.shields.io/npm/v/@eslint/js?style=for-the-badge&label=@eslint/js)](https://www.npmjs.com/package/@eslint/js)
[![eslint-plugin-react-hooks](https://img.shields.io/npm/v/eslint-plugin-react-hooks?style=for-the-badge&label=eslint-plugin-react-hooks)](https://www.npmjs.com/package/eslint-plugin-react-hooks)
[![eslint-plugin-react-refresh](https://img.shields.io/npm/v/eslint-plugin-react-refresh?style=for-the-badge&label=eslint-plugin-react-refresh)](https://www.npmjs.com/package/eslint-plugin-react-refresh)
[![globals](https://img.shields.io/npm/v/globals?style=for-the-badge&label=globals)](https://www.npmjs.com/package/globals)
[![@types/node](https://img.shields.io/npm/v/@types/node?style=for-the-badge&label=@types/node)](https://www.npmjs.com/package/@types/node)
[![@types/react](https://img.shields.io/npm/v/@types/react?style=for-the-badge&label=@types/react)](https://www.npmjs.com/package/@types/react)
[![@types/react-dom](https://img.shields.io/npm/v/@types/react-dom?style=for-the-badge&label=@types/react-dom)](https://www.npmjs.com/package/@types/react-dom)
[![@types/leaflet](https://img.shields.io/npm/v/@types/leaflet?style=for-the-badge&label=@types/leaflet)](https://www.npmjs.com/package/@types/leaflet)

No peer or optional dependencies detected.
</details>

<p align="center">Made with ❤ by H0NEYP0T-466</p>
