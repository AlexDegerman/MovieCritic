# 🎬 MovieCritic – Full-Stack Movie Discovery App

## Overview
MovieCritic is a full-stack movie discovery and review app featuring an infinite-scroll movie wall, allowing users to explore a wide variety of films. It combines a performant React + Vite frontend with a robust Node.js / Express backend and a MySQL database managed via Sequelize ORM.

![Infinite Scroll Demo](./public/infinitescroll.gif)  
[Full 1080p 60fps demo](https://youtu.be/67wY0n5HYX0)

## 🌐 Live Demo
**[View Live Site](https://moviecriticfi.onrender.com)** ⭐ Try it out without any setup!

> **Note:** The live site automatically logs you in as a demo user for instant access. This demo mode prevents database tampering, so some features are view-only (adding members, updating profiles, changing passwords, adding/deleting movies and reviews are disabled). You can still browse the full movie collection, explore detailed movie pages, and read community reviews.

## ✨ Key Features

### 🎥 Movie Discovery
- **Infinite scrolling movie wall** powered by TMDb API for smooth, continuous content loading
- **Advanced filtering** with search functionality and genre selection
- **Detailed movie pages** featuring comprehensive information, average review scores, and community reviews

### 👤 User Management
- **Secure authentication** using JWT tokens with 24-hour expiration
- **Personal profile pages** for each member with editable details
- **Review history tracking** displaying all reviews left by the user
- **Password management** with bcrypt hashing for secure credential storage

### 💬 Review System
- **Community-driven reviews** with star ratings stored in MySQL
- **Review aggregation** showing average scores on movie pages
- **Member attribution** linking reviews to user profiles

### 🔐 Security
- **Google reCAPTCHA v3 integration** protecting login routes from bots and spam
- **JWT authentication** securing all member-specific routes
- **Demo token system** with 10-minute expiration and automatic cleanup for secure demo access
- **Password encryption** using bcrypt for all stored credentials

### 🎨 User Interface
- **Responsive design** optimized for all device sizes
- **Lucide React icons** for consistent, modern iconography
- **Smooth interactions** with optimized loading states

## 🔧 Tech Stack

**Frontend:** React • JavaScript • CSS • Vite • Zustand  
**Backend:** Node.js • Express • REST API • JWT  
**Database:** MySQL • Sequelize ORM
**Security:** Google reCAPTCHA v3 • bcrypt • JWT  
**Icons:** Lucide React  
**DevOps:** Docker • GitHub Actions • Render  

## 📖 How It Works

1. **Browse movies** via infinite scroll powered by the TMDb API with search and genre filters
2. **Automatic demo login** grants instant access to explore the platform (live site)
3. **Explore movie details** including cast, crew, ratings, and community reviews
4. **View community reviews** from other members
5. **Experience the UI** including profile pages and review displays (read-only in demo mode)

*Full version includes: member registration, profile editing, password management, and the ability to add movies and write reviews*

## 🎯 Development Highlights

- **Full-stack architecture** with separate client/server structure
- **RESTful API design** enabling scalable and maintainable backend services
- **Responsive UI** optimized for all device sizes and performance
- **Secure authentication flow** with JWT tokens and demo token system
- **Database optimization** with Sequelize ORM, migrations, and proper indexing
- **Production deployment** with frontend and backend hosted on Render, MySQL database on Aiven
- **Docker containerization** available for local development
- **Strategic cloud database migration** (Railway → Azure SQL → Aiven) for cost-effectiveness, scalability, and security
- **CI/CD automation** via GitHub Actions for consistent build and deployment workflows
- **Demo mode implementation** with time-limited tokens and automatic cleanup for safe public access