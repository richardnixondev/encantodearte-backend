# 🛍️ Handmade E-commerce Backend (MERN Stack)

This is the **backend** for a handmade products e-commerce platform. It provides a secure and scalable REST API using the **MERN stack** (MongoDB, Express, React, Node), with admin-only access to product management.

---

## 📦 Tech Stack

- **Node.js** + **Express.js** – Backend framework
- **MongoDB** + **Mongoose** – Database and ODM
- **JWT Authentication** – Token-based access control
- **bcryptjs** – Password hashing
- **dotenv** – Environment variable management

---

## 🔐 Admin Authentication

The backend uses JWT tokens for authentication. A user can have an `isAdmin: true` flag, which restricts access to product management endpoints. Only admins can:

- Add, update or delete products
- Access admin-only routes

---
