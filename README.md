# MangaK - Manga Creation and Publishing Management System 📚✍️

**MangaK** (FE-MangaK) is a Frontend application built with **React 19** and **Vite**, supporting the entire manga production workflow—from creation, drawing assistance, task assignment, manuscript review, interactive canvas annotation, publication scheduling, to online manga reading.

The system is designed with a strict **Role-Based Access Control (RBAC)** architecture, providing six specialized user roles.

---

## 📋 Table of Contents

1. [👥 User Roles & Portals](#-user-roles--portals)
2. [🚀 Tech Stack](#-tech-stack)
3. [📂 Project Structure](#-project-structure)
4. [🛠️ Getting Started](#-getting-started)
5. [📜 NPM Scripts](#-npm-scripts)
6. [🎨 UI/UX Enhancements](#-uiux-enhancements)
7. [🌐 Deployment Configuration](#-deployment-configuration)

---

## 👥 User Roles & Portals

The system enforces access control using `ProtectedRoute` wrappers. Below are the primary user roles and their corresponding permissions.

| Role | Portals & Key Features |
| :--- | :--- |
| **🎨 Mangaka (Lead Artist)** | - **Series Management**: Create new manga series with essential information (title, description, slug) and crop cover images.<br>- **Chapter Management**: Upload manuscripts (PDF / Images) and publish chapters.<br>- **Canvas Annotation Viewer**: View visual annotations and feedback made by the Tantou Editor directly on manuscript pages.<br>- **Interactive Canvas Review**: Draw annotations and provide feedback on completed tasks submitted by Assistants.<br>- **Task Assignment**: Assign page-specific drawing tasks to Assistants.<br>- **Leaderboard & Profile**: Track series performance and manage personal profile. |
| **🖌️ Assistant** | - **Task Management**: Access the **My Tasks** board to view assigned work.<br>- **Progress Tracking**: Update task status, submit completed artwork, and request review.<br>- **Earnings**: Monitor income and payment history for completed tasks. |
| **📝 Tantou Editor** | - **Tantou Dashboard**: Monitor projects assigned to the managed Mangaka.<br>- **Interactive Canvas Review**: Draw circles, highlight issues, and leave annotations directly on manuscript pages using Konva Canvas.<br>- **Review Management**: Leave textual feedback, request revisions, or approve chapters. |
| **🏛️ Editorial Board** | - **Content Approval**: Approve or reject newly submitted manga series.<br>- **Publishing Schedule**: Plan publication dates and adjust release schedules through an interactive calendar before publication.<br>- **Statistics & Leaderboard**: Monitor performance metrics and manage manga rankings. |
| **👑 Admin** | - **User Management**: Manage users and readers, create new accounts, update profiles, suspend accounts, and assign roles.<br>- **System Administration**: Monitor system statistics and manage global configurations. |
| **📖 Reader** | - **Reader Portal**: Browse, read, search, and rate published manga chapters. |

---

## 🚀 Tech Stack

- **Core Framework:** [React 19](https://react.dev/) & [Vite 8](https://vite.dev/) (application bundler with Hot Module Replacement)
- **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) & `@tailwindcss/vite`
- **Routing & Navigation:** [React Router 7](https://reactrouter.com/) (nested routing and role-based route protection using `ProtectedRoute`)
- **Authentication:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) (Google OAuth 2.0 authentication)
- **Interactive Drawing & Canvas:** [Konva](https://konvajs.org/) & [React Konva](https://konvajs.org/docs/react/index.html) (interactive manuscript annotation canvas)
- **Image Editing:** [CropperJS](https://fengyuanchen.github.io/cropperjs/) & [React Cropper](https://github.com/hookyqr/react-cropper) (cover image and avatar cropping)
- **Document Viewer:** [React PDF](https://github.com/wojtekmaj/react-pdf) (display PDF manuscripts directly in the browser)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **Icons & Date Utilities:** [Lucide React](https://lucide.dev/) & [Day.js](https://day.js.org/) (icons, date handling, and publication scheduling)
- **Code Quality & Linting:** ESLint 10 & Prettier
- **Mock API Support:** [JSON Server](https://github.com/typicode/json-server) (mock REST API for offline development)

---

## 📂 Project Structure

The source code inside the `src/` directory follows a modular architecture:

```text
src/
├── app/                  # Application bootstrap, Providers (Theme, Auth, Router)
├── features/             # Business logic organized by domain
│   ├── auth/             # Authentication logic, ProtectedRoute, PublicRoute
│   ├── chapters/         # Chapter publishing, reading, and canvas annotations
│   ├── leaderboard/      # Statistics and manga leaderboard
│   ├── Pagination/       # Shared pagination components
│   ├── schedule/         # Publication schedule management
│   ├── series/           # Series management (create, edit, cover image cropping)
│   ├── shared/           # Shared features across multiple portals
│   ├── tasks/            # Task assignment and tracking
│   └── theme/            # Theme Context (Light/Dark Mode)
```
