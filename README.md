# MangaK - Manga Creation and Publishing Management System 📚✍️

**MangaK** (FE-MangaK) là ứng dụng Frontend được xây dựng bằng **React 19** & **Vite**, phục vụ toàn bộ quy trình từ sáng tác, hỗ trợ vẽ, phân công công việc, duyệt bản thảo, ghi chú chỉnh sửa trực quan (Interactive Canvas Annotation), lên lịch xuất bản cho tới đọc truyện trực tuyến.

Hệ thống được thiết kế theo mô hình phân quyền nghiêm ngặt (**Role-Based Access Control - RBAC**) với 6 nhóm người dùng chuyên biệt.

---

## 📋 Cấu Trúc Nội Dung (Table of Contents)

1. [👥 Phân Quyền & Vai Trò Người Dùng (Roles & Portals)](#-phân-quyền--vai-trò-người-dùng-roles--portals)
2. [🚀 Công Nghệ & Thư Viện Sử Dụng (Tech Stack)](#-công-nghệ--thư-viện-sử-dụng-tech-stack)
3. [📂 Cấu Trúc Thư Mục Dự Án (Project Structure)](#-cấu-trúc-thư-mục-dự-án-project-structure)
4. [🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)](#-hướng-dẫn-cài-đặt--chạy-dự-án-getting-started)
5. [📜 Danh Sách Lệnh (NPM Scripts)](#-danh-sách-lệnh-npm-scripts)
6. [🎨 Tính Năng Đổi Mới UI/UX](#-tính-năng-đổi-mới-uiux)
7. [🌐 Cấu Hình Triển Khai (Deployment)](#-cấu-hình-triển-khai-deployment)

---

## 👥 Phân Quyền & Vai Trò Người Dùng (Roles & Portals)

Hệ thống kiểm soát truy cập phân quyền thông qua các `ProtectedRoute` wrapper. Dưới đây là các vai trò chính và đặc quyền tương ứng:

| Vai Trò | Phân Vùng Portals & Tính Năng Nổi Bật |
| :--- | :--- |
| **🎨 Mangaka (Họa sĩ chính)** | - **Quản lý bộ truyện (Series)**: Tạo truyện mới, cắt ảnh bìa, chỉnh sửa thông tin.<br>- **Quản lý chương (Chapter)**: Đăng tải bản thảo (PDF / Ảnh) và xuất bản chương.<br>- **Canvas Annotation Reader**: Xem các nét vẽ ghi chú & phản hồi trực quan từ Tantou Editor trên trang bản thảo.<br>- **Phân công nhiệm vụ**: Giao việc cụ thể (vẽ nét, vẽ nền, tô màu, chèn thoại) cho Trợ lý (Assistant).<br>- **Bảng xếp hạng & Hồ sơ**: Theo dõi hiệu suất truyện và quản lý trang cá nhân. |
| **🖌️ Assistant (Trợ lý)** | - **Quản lý công việc**: Truy cập bảng `My Tasks` để xem các phụ tá việc được giao.<br>- **Cập nhật tiến độ**: Chuyển trạng thái, nộp bản vẽ hoàn thành và gửi yêu cầu duyệt.<br>- **Thu nhập**: Theo dõi doanh thu & lịch sử thanh toán cho từng công việc đã hoàn thành. |
| **📝 Tantou Editor (BTV Trực tiếp)** | - **Tantou Dashboard**: Theo dõi danh sách dự án của các Mangaka được phân công.<br>- **Interactive Canvas Review**: Vẽ khoanh tròn, mũi tên, highlight và ghi chú trực tiếp lên trang bản thảo nhờ Konva Canvas.<br>- **Quản lý phê duyệt**: Phản hồi văn bản, yêu cầu chỉnh sửa (Request Revision) hoặc duyệt chương. |
| **🏛️ Editorial Board (Ban biên tập)** | - **Phê duyệt nội dung**: Phê duyệt hoặc từ chối các bộ truyện và chương truyện mới đăng.<br>- **Lịch xuất bản (Publishing Schedule)**: Lên lịch, điều chỉnh ngày phát hành trên bộ lịch trực quan.<br>- **Thống kê & Xếp hạng**: Theo dõi chỉ số người đọc và quản lý thứ hạng truyện trên Leaderboard. |
| **👑 Admin (Quản trị viên)** | - **Quản lý tài khoản**: Danh sách, tạo mới, cập nhật, khóa hoặc phân quyền người dùng.<br>- **Hệ thống & Cấu hình**: Monitor thống kê hệ thống và các thiết lập chung. |
| **📖 Reader (Độc giả)** | - **Reader Portal**: Tìm kiếm, lọc và đọc các bộ truyện/chương đã xuất bản.<br>- **Tương tác cộng đồng**: Đánh giá, bình luận và bình chọn bộ truyện yêu thích. |

---

## 🚀 Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

- **Core Framework:** [React 19](https://react.dev/) & [Vite 8](https://vite.dev/) (trình đóng gói ứng dụng với HMR)
- **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/) & `@tailwindcss/vite`
- **Routing & Navigation:** [React Router 7](https://reactrouter.com/) (xử lý routing lồng ghép và phân quyền `ProtectedRoute`)
- **Authentication:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) (xác thực Google OAuth2)
- **Interactive Painting & Canvas:** [Konva](https://konvajs.org/) & [React Konva](https://konvajs.org/docs/react/index.html) (canvas vẽ ghi chú bản thảo)
- **Image Editing:** [CropperJS](https://fengyuanchen.github.io/cropperjs/) & [React Cropper](https://github.com/hookyqr/react-cropper) (cắt ảnh bìa truyện & avatar)
- **Document Viewing:** [React PDF](https://github.com/wojtekmaj/react-pdf) (hiển thị file bản thảo PDF trực tiếp)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **Icons & Time Utils:** [Lucide React](https://lucide.dev/) (hệ thống icon) & [Day.js](https://day.js.org/) (xử lý ngày tháng & lịch xuất bản)
- **Code Quality & Linting:** ESLint 10 & Prettier
- **Mock Server Support:** [JSON Server](https://github.com/typicode/json-server) (chạy API giả lập khi cần dev offline)

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

Mã nguồn trong thư mục `src/` được tổ chức dạng modular rõ ràng:

```text
src/
├── app/                  # Khởi tạo App, các Providers (Theme, Auth, Router)
├── features/             # Logic nghiệp vụ chia theo domain
│   ├── auth/             # Logic xác thực, ProtectedRoute, PublicRoute
│   ├── chapters/         # Đăng chương, đọc chương, canvas ghi chú
│   ├── leaderboard/      # Thống kê & bảng xếp hạng bộ truyện
│   ├── Pagination/       # Component phân trang dùng chung
│   ├── schedule/         # Bộ quản lý lịch xuất bản
│   ├── series/           # Quản lý bộ truyện (tạo, sửa, crop ảnh bìa)
│   ├── shared/           # Features chia sẻ giữa các phân vùng
│   ├── tasks/            # Bảng phân công & theo dõi nhiệm vụ trợ lý
│   └── theme/            # Theme Context (Light/Dark mode)
├── layout/               # Giao diện chung (Header, Footer, Sidebar, Layout chính)
├── pages/                # Controller cho từng trang theo vai trò
│   ├── admin/            # Trang quản trị tài khoản & cài đặt hệ thống
│   ├── assistant/        # Trang nhiệm vụ trợ lý & bảng thu nhập
│   ├── auth/             # Đăng nhập, quên mật khẩu, đặt lại mật khẩu
│   ├── editorialBoard/   # Duyệt truyện & quản lý lịch phát hành
│   ├── mangaka/          # Trang quản lý dự án, đăng chương & giao việc
│   ├── reader/           # Trang chủ đọc truyện, tìm kiếm & xem chi tiết
│   ├── tantouEditor/     # Trang BTV trực tiếp review & ghi chú bản thảo
│   └── shared/           # Trang chung (Profile, Leaderboard, Annotation canvas...)
├── routes/               # Cấu hình định tuyến tập trung (AppRoutes.jsx)
├── services/             # HTTP client & các API service endpoints
│   ├── api.js            # Fetch wrapper tích hợp Bearer token & auto refresh logic
│   ├── authService.js    # API Đăng nhập, Google Auth, Refresh Token
│   ├── chapterService.js # API lấy & đăng chương truyện
│   ├── taskService.js    # API giao việc & cập nhật tiến độ trợ lý
│   └── ...               # (seriesService, userService, feedbackService, incomeService, v.v.)
├── shared/               # Component UI chung (Button, Input, Modal, Loader, ThemeToggle...)
└── styles/               # File CSS toàn cục (global.css, theme.css, font chữ)
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)

### 1. Yêu cầu môi trường
Đảm bảo đã cài đặt **Node.js** (Khuyên dùng phiên bản LTS `18.x` hoặc cao hơn) và **npm**.

### 2. Cài đặt các gói phụ thuộc (Dependencies)
Tải mã nguồn về máy, mở terminal tại thư mục dự án và chạy:
```bash
npm install
```

### 3. Cấu hình biến môi trường (.env)
Tạo file `.env` ở thư mục gốc của dự án với các thông số cấu hình:

```env
VITE_API_URL="https://mangaka-deploy-latest.onrender.com/api"
VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id-here"
```

- `VITE_API_URL`: Đường dẫn kết nối tới server Backend API (Render host hoặc `http://localhost:5000` khi chạy backend ở máy cục bộ).
- `VITE_GOOGLE_CLIENT_ID`: Mã Google OAuth Client ID dùng cho tính năng đăng nhập bằng tài khoản Google.

> ⚠️ **Lưu ý bảo mật:** File `.env` chứa thông tin cấu hình nhạy cảm và đã được đưa vào `.gitignore` để tránh bị lộ mã khoá bí mật trên GitHub repository.


### 4. Chạy chế độ Development
Mở server phát triển Vite với tính năng tự động tải lại (HMR):
```bash
npm run dev
```
Ứng dụng sẽ chạy mặc định tại địa chỉ: [http://localhost:5173](http://localhost:5173)

### 5. Chạy Mock Server (Tùy chọn)
Nếu muốn chạy test offline mà không có backend API, bạn có thể khởi tạo file `database.json` ở thư mục gốc và chạy:
```bash
npm run server
```
Server giả lập `json-server` sẽ lắng nghe tại cổng `http://localhost:3001`.

---

## 📜 Danh Sách Lệnh (NPM Scripts)

Các lệnh đã được định cấu hình trong `package.json`:

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy server phát triển Vite tại địa chỉ `http://localhost:5173`. |
| `npm run build` | Biên dịch và tối ưu hóa mã nguồn React thành bản sản xuất trong thư mục `/dist`. |
| `npm run preview` | Chạy xem trước bản build sản xuất từ thư mục `/dist`. |
| `npm run lint` | Kiểm tra chất lượng code và chuẩn style bằng ESLint. |
| `npm run server` | Khởi chạy REST API server giả lập ở cổng `3001` từ `database.json`. |

---

## 🎨 Tính Năng Đổi Mới UI/UX

- **Hỗ trợ Giao diện Sáng/Tối (Light/Dark Mode)**: Tích hợp CSS variables kết hợp cùng Tailwind CSS. Trạng thái theme được lưu và đồng bộ qua `ThemeContext`.
- **Thiết kế Responsive Toàn diện**: Giao diện thích ứng linh hoạt trên Desktop, Tablet và Mobile.
- **Công cụ Vẽ & Ghi chú Trực quan**: Tích hợp Konva Canvas hỗ trợ BTV vẽ khoanh vùng, mũi tên và ghi chú chỉnh sửa trực tiếp trên file PDF/ảnh bản thảo.
- **Cắt Ảnh Chuẩn Xác**: Đóng gói CropperJS giúp Mangaka dễ dàng canh chỉnh tỉ lệ ảnh bìa truyện và avatar trước khi tải lên.

---

## 🌐 Cấu Hình Triển Khai (Deployment)

Dự án được cấu hình sẵn cho việc triển khai trên **Vercel** thông qua file `vercel.json`:
- Cấu hình Single Page Application (SPA) rewrite tất cả request về `/index.html` để tránh lỗi 404 khi người dùng refresh trang ở các route lồng nhau.
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
