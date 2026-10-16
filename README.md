# QuotaHarvest AI 🚀
> An automated mobile data optimization platform designed to save unused daily prepaid mobile data before midnight expiration.

---

## 📌 Problem Statement
Millions of prepaid mobile users rely on 1.5GB or 2GB daily data plans where unused data expires at midnight. Users often avoid downloading lecture videos, study materials, or heavy updates during peak hours for fear of exhausting their quota.

## 💡 Solution
**QuotaHarvest AI** runs silently as a local queue management tool. Users drop heavy files into a queue during the day. The application monitors remaining data usage and automatically downloads queued files in priority order right before midnight, turning expiring data into an offline study/work library.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose models)
* **Architecture:** Full-stack RESTful Client-Server

---

## ⚡ Features
* **Automated Queue Management:** Prioritizes file downloads based on size and user preference.
* **Bandwidth Monitoring:** Tracks active server processes and data buffer status.
* **Responsive UI:** Clean interface built with React and Vite for easy queue tracking.

## **How to Run Locally**

```bash
# Clone the repository
git clone https://github.com/MadduriPooja/QuotaHarvest-AI.git

# Navigate into the project folder
cd QuotaHarvest-AI

# Install dependencies
npm install

# Start the development server
npm run dev



