🇺🇦 Government App Client
<div align="left"> <h2>GOVERNMENT APP CLIENT</h2> <p> <img src="https://img.shields.io/github/last-commit/LevKosyk/ApiForGovermentApp?style=default&logo=git&logoColor=white&color=a0d1e2" alt="last-commit"> </p> </div>
🌐 Language Switch | Зміна мови
🇺🇸 English

🇺🇦 Українська

📍 Overview
React Native client for a government reporting app inspired by the movie "Law Abiding Citizen". Users can log offenses (with photos, geolocation, and time), while guests can browse offenses in a calendar view.

📁 Project Structure
bash
Копировать
Редактировать
GovermentApp/
├── assets/             # Static assets like icons and images
├── components/         # Reusable UI components
├── constants/          # App-wide constants (colors, sizes)
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen-level components
├── services/           # API and utility service layers
├── types/              # TypeScript types/interfaces
├── utils/              # Helper functions
├── App.tsx             # Main entry point
├── app.json            # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
🚀 Getting Started
☑️ Prerequisites
Language: TypeScript / JavaScript

Runtime: Node.js + Expo CLI

IDE: Visual Studio Code

⚙️ Local Installation
bash
Копировать
Редактировать
# 1. Clone the repository
git clone https://github.com/LevKosyk/GovermentApp
cd GovermentApp

# 2. Install dependencies
npm install

# 3. Update environment variables
# Edit AppService.js and replace the following:

REPLACE-ME-IP                           # your IP from `ipconfig` (IPv4)
ADD_YOUR_CLOUDINARY_URL_HERE           # Cloudinary upload URL
ADD_YOUR_CLOUDINARY_UPLOAD_PRESET_HERE # Cloudinary preset
ADD_YOUR_CLOUDINARY_CLOUD_NAME_HERE    # Cloudinary cloud name

# 4. Start the app
npx expo start
🐳 Docker Setup (For API + DB)
⚠️ This React Native client doesn't run in Docker, but the backend API does. Here's how to set that up if needed:

⚙️ Prerequisites
Docker Desktop

📄 Docker Instructions
bash
Копировать
Редактировать
# Clone the backend repository
git clone https://github.com/LevKosyk/ApiForGovermentApp
cd ApiForGovermentApp

# Run backend and MSSQL DB via Docker
docker-compose up --build
This will start the .NET Web API (web) and SQL Server (db) containers as defined in docker-compose.yml.

Default connection string:

json
Копировать
Редактировать
"ConnectionStrings": {
  "DefaultConnection": "Server=db;Database=GovernmentAppDb;User=sa;Password=Your_password123;"
}
You can customize these credentials in docker-compose.yml and appsettings.json.

📺 Tutorial video: Docker + SQL Server

🇺🇦 Огляд для користувачів
React Native застосунок для повідомлення про правопорушення. Зареєстровані користувачі можуть додавати інциденти (з фото, геолокацією та часом), а гість — переглядати їх у календарі.

☑️ Передумови
Мова: TypeScript / JavaScript

Середовище: Node.js + Expo

IDE: Visual Studio Code

Аккаунт: Cloudinary (для зберігання фото)

⚙️ Встановлення локально
bash
Копировать
Редактировать
# 1. Клонуйте репозиторій
git clone https://github.com/LevKosyk/GovermentApp
cd GovermentApp

# 2. Встановіть залежності
npm install

# 3. Налаштуйте змінні середовища:
# Відкрийте файл AppService.js і замініть:

REPLACE-ME-IP                           # Ваша IP-адреса з `ipconfig` → IPv4
ADD_YOUR_CLOUDINARY_URL_HERE           # URL для завантаження в Cloudinary
ADD_YOUR_CLOUDINARY_UPLOAD_PRESET_HERE # Ваш upload preset
ADD_YOUR_CLOUDINARY_CLOUD_NAME_HERE    # Ім’я вашої хмари у Cloudinary

# 4. Запустіть застосунок
npx expo start
🐳 Налаштування Docker (тільки для бекенду)
⚠️ Цей застосунок не запускається в Docker. Docker використовується тільки для запуску API та бази даних.

bash
Копировать
Редактировать
# Клонуйте бекенд репозиторій
git clone https://github.com/LevKosyk/ApiForGovermentApp
cd ApiForGovermentApp

# Запуск API і бази даних
docker-compose up --build
📂 У docker-compose.yml вказані два сервіси:

web: .NET API

db: MSSQL Server

🔐 Рядок підключення за замовчуванням:

json
Копировать
Редактировать
"ConnectionStrings": {
  "DefaultConnection": "Server=db;Database=GovernmentAppDb;User=sa;Password=Your_password123;"
}
Змінити параметри можна у docker-compose.yml та appsettings.json.

📺 Відеоінструкція: Docker + MSSQL

📞 Contact
If you have any questions, feel free to open an issue or contact LevKosyk via GitHub.

Made with ❤️ by a law-abiding citizen 😉
