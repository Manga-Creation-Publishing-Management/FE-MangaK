# MangaK - Manga Creation and Publishing Management System 📚✍️

**MangaK** is a feature-rich React frontend application designed to manage the end-to-end workflow of manga creation, collaborative review, editing, publishing schedule management, and digital publishing. It provides a secure, role-based portal layout with strict routing permissions, facilitating collaboration between Mangakas (Artists), Assistants, Tantou Editors (Assigned Editors), the Editorial Board, Administrators, and Readers.

---

## 👥 User Roles & Access Control (Portals)

The application implements strict role-based access control (RBAC) utilizing custom protected route wrappers (`ProtectedRoute`). Below are the primary user roles and their main privileges:

| Role | Portals & Key Features |
| :--- | :--- |
| **🎨 Mangaka (Artist)** | - **Series Management**: Create new manga series, crop covers, and edit info.<br>- **Chapter Management**: Upload manuscript files (PDF/Images) and publish chapters.<br>- **Canvas Annotation Reader**: View visual revision drawings and feedback left by Tantou Editors.<br>- **Task Delegation**: Assign specific tasks (inking, background drawing, coloring, speech bubbles) to Assistants.<br>- **Leaderboard & Profile**: Track series performance and manage profile details. |
| **🖌️ Assistant (Trợ lý)** | - **Task Management**: Access the `My Tasks` board to view assigned drawing/inking sub-tasks.<br>- **Status Tracking**: Update status, submit finished drafts, and request review.<br>- **Income Dashboard**: Monitor earned income and payment records for completed tasks. |
| **📝 Tantou Editor (Assigned Editor)** | - **Tantou Dashboard**: Track active projects of assigned Mangakas.<br>- **Interactive Canvas Review**: Draw circles, arrows, highlights, and write notes directly onto manuscripts using the Konva canvas.<br>- **Revision Management**: Provide textual feedbacks, request changes, or endorse chapters. |
| **🏛️ Editorial Board (Ban biên tập)** | - **Series Approval**: Moderate, review, and officially approve or reject new series and chapter draft submissions.<br>- **Publishing Schedule**: Set, adjust, and monitor publication dates via an interactive release calendar.<br>- **Leaderboard Import**: Monitor overall reader statistics and rank series. |
| **👑 Admin (Quản trị viên)** | - **Account Management**: List, create, update, suspend, or configure user roles and accounts.<br>- **System Logs & Metrics**: Monitor system statistics and basic configuration settings. |
| **📖 Reader (Độc giả)** | - **Reader Portal**: Search, filter, and read published manga series and chapters.<br>- **Community Interaction**: Rate, comment, and vote for favorite series (directly influencing the Leaderboard rankings). |

---

## 🚀 Tech Stack & Core Libraries

- **Core Framework:** [React 19](https://react.dev/) & [Vite 8](https://vite.dev/) (leveraging ultra-fast Hot Module Replacement)
- **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) (modern CSS compilation and utility configuration)
- **Routing:** [React Router 7](https://reactrouter.com/) (handling nested layouts and authorization middleware)
- **Authentication:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) (seamless Google authentication)
- **Interactive Painting & Feedback:** [Konva](https://konvajs.org/) & [React Konva](https://konvajs.org/docs/react/index.html) (HTML5 Canvas drawing library for manuscript annotations)
- **Image Editing:** [CropperJS](https://fengyuanchen.github.io/cropperjs/) & [React Cropper](https://github.com/hookyqr/react-cropper) (high-performance cropping tool for profile avatars and manga cover pages)
- **Document Viewing:** [React PDF](https://github.com/wojtekmaj/react-pdf) (inline client-side PDF renderer for manuscripts review)
- **State & Form Validation:** React Hook Form & Yup
- **Utility Packages:** [Lucide React](https://lucide.dev/) (icons) & [Day.js](https://day.js.org/) (date formatting and schedule calculations)
- **Mock Database Support:** [JSON Server](https://github.com/typicode/json-server) (local API server for prototyping using `database.json`)

---

## 📂 Project Directory Structure

The source directory (`src/`) is organized modularly for high maintainability and clean separation of concerns:

```text
src/
├── app/                  # Application root, defines context providers (Theme, Auth, Router)
├── features/             # Business logic split by domain features
│   ├── auth/             # Login, logout, ProtectedRoute, and PublicRoute guards
│   ├── chapters/         # Chapter creation, annotation hooks, and display logic
│   ├── Pagination/       # Standardized client-side and server-side pagination components
│   ├── schedule/         # Release scheduler components and date rules
│   ├── series/           # Series forms, crop modals, detail views, and series creation hooks
│   ├── shared/           # Features shared between multiple modules
│   ├── tasks/            # Task delegation cards, lists, status updates, and inputs
│   └── theme/            # Theme toggle context (Light/Dark mode)
├── layout/               # Global layouts (HeaderPage, FooterPage, Sidebar, Main Layout)
├── pages/                # Page controllers grouped by role access
│   ├── admin/            # Admin accounts and configuration dashboards
│   ├── assistant/        # Assistant tasks list and income summary
│   ├── auth/             # Login, Forgot/Reset password screens
│   ├── editorialBoard/   # Release schedule calendar and approval list
│   ├── mangaka/          # Mangaka series view, chapter upload, task assignment boards
│   ├── reader/           # Public reader feed and reading view
│   ├── tantouEditor/     # Tantou editor feed and review panel
│   └── shared/           # Common views (HomePage, Profile, Leaderboard, Annotation canvas, etc.)
├── routes/               # Centralized routing configuration (AppRoutes.jsx)
├── services/             # API client client/axios wrapper and endpoint services
│   ├── api.js            # Core HTTP client with authorization interceptors
│   ├── authService.js    # Auth calls (Credentials login, Google Sign-in)
│   ├── chapterService.js # Fetching, uploading, and editing chapter endpoints
│   └── ...               # (seriesService, taskService, userService, feedbackService, etc.)
├── shared/               # Universal UI components (Buttons, Inputs, Modals, Loaders, ThemeToggle)
└── styles/               # Global stylesheet rules (global.css)
```

---

## 🛠️ Getting Started & Installation

### 1. Prerequisites
Ensure you have **Node.js** installed (LTS version `18.x` or higher is recommended).

### 2. Install Dependencies
Clone the repository, navigate to the folder, and run:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (or edit the existing one) with the following parameters:
```env
VITE_API_URL="https://mangaka-deploy-latest.onrender.com/api"
VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id-here"
```
- `VITE_API_URL`: Points to the active backend API server (e.g., Render host or `http://localhost:5000` for local backend).
- `VITE_GOOGLE_CLIENT_ID`: Required for Google login authentication on the reader and login pages.

### 4. Running the Development Server
To launch the Vite development server with Hot Module Replacement (HMR), run:
```bash
npm run dev
```
By default, the application will run at [http://localhost:5173](http://localhost:5173).

### 5. Running the Mock Server (Optional)
If you are developing locally without a backend database, you can start the built-in mock server running on port `3001` (requires a valid `database.json` file in the root):
```bash
npm run server
```

---

## 📜 Available NPM Scripts

Below is a list of configured scripts inside `package.json` that you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server on port `5173`. |
| `npm run server` | Starts a mock REST API server on port `3001` using `database.json`. |
| `npm run build` | Compiles and optimizes the React code into a production bundle under the `/dist` directory. |
| `npm run preview` | Locally serves the compiled production build from the `/dist` folder for previewing. |
| `npm run lint` | Analyzes code quality and formatting standard compliance using ESLint. |

---

## 🎨 UI/UX Features

- **Light/Dark Mode Support**: Uses CSS variables combined with Tailwind CSS. Toggle states are managed by `ThemeContext` and persisted for a smooth, unified aesthetic.
- **Fully Responsive Layout**: Built with a responsive grid layout. Sidebars and data tables automatically adapt to desktop, tablet, and mobile screens.
- **Interactive Annotation Interface**: Uses Konva canvases to overlay drawn review comments on top of PDF page renderings.
- **Precise Crop Tool**: Integrates CropperJS to enable creators to adjust visual bounds before upload, standardizing covers and avatars.
