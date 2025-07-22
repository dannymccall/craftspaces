# E-Commerce Platform

A full-stack ecommerce web application built with **Next.js**, **React**, **TypeScript**, **MySQL**, and **TailwindCSS**.  
The backend uses **Next.js API Routes** — no standalone Express server.

---

## 🚀 Functionalities

### User Features
- **Authentication & Profiles**
  - Sign up, login, and manage profiles
  - Secure JWT-based authentication
- **Product Browsing**
  - View products by category
  - Search and filtering
  - Detailed product pages with images and descriptions
- **Shopping Cart & Checkout**
  - Add, update, and remove items
  - Order summary and checkout
- **Order Management**
  - Place and view order history
  - Track order status
- **Notifications**
  - Email confirmations and updates

### Admin Features
- **Product Management**
  - Add, edit, and delete products
  - Manage categories, stock levels, and prices
- **Order Management**
  - View and manage customer orders
  - Update order statuses

### Other Features
- **Responsive Design**
  - Mobile-first UI with TailwindCSS
- **Serverless API**
  - Powered by Next.js API routes
  - Connection pooling for MySQL to support serverless environments (Vercel)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** MySQL (Clever Cloud)
- **Authentication:** JWT-based authentication
- **Deployment:** Vercel

---


### Configure environment variables
## Create a .env file:
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
SMTP_PASS=
SMTP_FROM=
SMTP_USER=
SMTP_PORT=
SMTP_HOST=
SESSION_SECRET=
NODE_ENV=
BASE_URL=
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_RESET_PASSWORD_SECRET=
NEXT_PUBLIC_REFRESH_SECRET=
NEXT_PUBLIC_ACCESS_TOKEN_SECRET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
NEXT_PUBLIC_SOCKET_URL=

### Note
## Email Service
Gmail
Emailjs

---
## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/dannymccall/craftspaces
   cd ecommerce
   npm install 

### Start Development environment
   npm run dev
   
### Start Production
npm run build 
npm start
