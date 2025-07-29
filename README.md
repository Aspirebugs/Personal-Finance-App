## Demo

[![Watch the demo](https://img.youtube.com/vi/QbMcKwJGuD4/0.jpg)](https://youtu.be/QbMcKwJGuD4)

# Personal Finance App

A full‑stack MERN application to track, manage, and visualize your income and expenses.  
Users can manually create transactions, upload receipts or bank statements to auto‑extract transactions, and view insightful charts.

---

## 🚀 Features

- **Manual Entry**: Create, edit, delete income & expense transactions.  
- **Bulk Upload**  
  - **POS Receipt** (image/PDF) → OCR & Gemini to perform Ner  
- **Filtering & Pagination**  
  - Date‑range filter on the dashboard  
  - Paginated listing with `page` & `limit` query params  
- **Insights Dashboard**  
  - Pie chart: breakdown by category  
  - Line chart: trends over time  
  - Toggle between **Expenses**, **Income**, or **All**  
- **Multi‑User Support**: JWT‑protected APIs; each user only sees their own data.  

---

## 🔧 Prerequisites

- Node.js v14+ & npm  
- MongoDB instance (local or Atlas)  
---

## ⚙️ Setup & Run

1. **Clone** the repo  
   ```bash
   git clone https://github.com/Aspirebugs/Personal-Finance-App.git
   cd Personal-Finance-App
   npm install
   
2. **Backend**
    ```bash
    cd backend
    npm install
    Create a .env file with:

3. **Create a env file**
    ```env
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API = your gemini api
    PORT = your server port
    
4. **Start the server**
   ```bash
   npm run dev

5. **Start the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev   

