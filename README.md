# MangaK - Hệ thống Quản lý Sáng tác và Xuất bản Truyện tranh 📚✍️

**MangaK** là ứng dụng frontend quản lý toàn bộ quy trình sáng tác, biên tập, phê duyệt và xuất bản truyện tranh trực tuyến. Ứng dụng hỗ trợ quy trình làm việc khép kín và phân quyền rõ ràng giữa tác giả (Mangaka), trợ lý (Assistant), biên tập viên (Tantou Editor), ban biên tập (Editorial Board), quản trị viên (Admin) và độc giả (Reader).

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

Dự án được xây dựng dựa trên các công nghệ hiện đại, đảm bảo hiệu năng tối ưu và giao diện trực quan:

- **Core Framework:** [React 19](https://react.dev/) & [Vite 8](https://vite.dev/) (HMR siêu tốc)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Tối ưu hiệu năng css)
- **Routing:** [React Router 7](https://reactrouter.com/) (Hỗ trợ cấu trúc route lồng nhau và bảo mật phân quyền)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linter & Formatter:** ESLint 10 & Prettier
- **Mock Database:** [JSON Server](https://github.com/typicode/json-server) (Sử dụng cho môi trường phát triển giả lập dữ liệu thông qua `database.json`)

---

## 👥 Vai Trò & Tính Năng Phân Quyền (User Roles & Portals)

Hệ thống được thiết kế với cấu trúc phân quyền chặt chẽ thông qua các route được bảo vệ (`ProtectedRoute`). Dưới đây là các vai trò chính:

| Vai trò | Mô tả & Tính năng chính |
| :--- | :--- |
| **🎨 Mangaka (Họa sĩ)** | - Quản lý danh sách truyện tranh (`Series Management`).<br>- Thêm mới chương (`Chapter`), tải lên bản thảo (`Manuscript Url`) hoặc bản pdf chính thức.<br>- Phân công và quản lý công việc cho Trợ lý (`Task Management`).<br>- Xem phản hồi từ Biên tập viên phụ trách. |
| **🖌️ Assistant (Trợ lý)** | - Nhận nhiệm vụ từ Mangaka vẽ nét (inking), vẽ nền (background), viết thoại,...<br>- Xem danh sách nhiệm vụ được giao (`My Tasks`) và cập nhật trạng thái hoàn thành. |
| **📝 Tantou Editor (Biên tập viên)** | - Theo dõi tiến độ sáng tác của các họa sĩ phụ trách (`Tantou Dashboard`).<br>- Đọc duyệt thử các chương truyện mới phát hành nháp, gửi đánh giá/phản hồi (`Series Review`). |
| **🏛️ Editorial Board (Ban biên tập)** | - Duyệt phát hành chính thức các bộ truyện mới (`Series Approval`).<br>- Lập lịch xuất bản truyện (`Publishing Schedule`).<br>- Nhập dữ liệu bình chọn từ độc giả (`Voting Data Import`) để xếp hạng tác phẩm. |
| **👑 Admin (Quản trị viên)** | - Quản trị hệ thống tổng thể, cấu hình quyền và tài khoản người dùng (`Admin Dashboard`). |
| **📖 Reader (Độc giả)** | - Xem danh sách truyện đã xuất bản, đánh giá, bình chọn tác phẩm (`Reader Dashboard`). |

---

## 📂 Cấu Trúc Thư Mục (Folder Structure)

Thư mục nguồn (`src/`) được tổ chức theo mô hình module hóa rõ ràng, dễ bảo trì:

```text
src/
├── app/                  # Chứa component gốc App.jsx định nghĩa các Provider (Theme, Router)
├── features/             # Chứa logic nghiệp vụ được chia theo tính năng chính
│   ├── auth/             # Quản lý Đăng nhập, Route Bảo vệ (ProtectedRoute, PublicRoute)
│   ├── chapters/         # Logic liên quan đến chương truyện
│   ├── schedule/         # Logic liên quan đến lịch phát hành
│   ├── series/           # Logic liên quan đến bộ truyện
│   ├── tasks/            # Logic liên quan đến phân công nhiệm vụ
│   └── theme/            # Quản lý giao diện Sáng/Tối (Light/Dark Theme)
├── pages/                # Các trang giao diện phân chia theo vai trò
│   ├── admin/            # Trang dành cho Admin
│   ├── assistant/        # Trang dành cho Assistant
│   ├── auth/             # Trang Đăng nhập, Đăng ký
│   ├── editorialBoard/   # Trang dành cho Ban biên tập
│   ├── mangaka/          # Trang dành cho Họa sĩ sáng tác
│   ├── reader/           # Trang dành cho Độc giả
│   ├── tantouEditor/     # Trang dành cho Biên tập viên
│   └── shared/           # Các trang dùng chung (Home, Detail, Profile, Layout)
├── routes/               # Cấu hình định tuyến (AppRoutes.jsx)
├── services/             # Axios/Fetch API client wrapper (api.js, authService.js)
├── shared/               # Các component và helper tái sử dụng toàn dự án (ThemeToggle,...)
└── styles/               # Chứa các tệp CSS toàn cục (global.css)
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Chuẩn bị môi trường
Yêu cầu máy tính đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS v18 trở lên).

### 2. Cài đặt các gói phụ thuộc
Di chuyển vào thư mục dự án và chạy lệnh sau để tải các thư viện cần thiết:
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc (hoặc chỉnh sửa file `.env` hiện có) với nội dung:
```env
VITE_API_URL="http://localhost:5053"
```
*(Thay thế URL trên bằng địa chỉ chạy API Backend thực tế của bạn).*

### 4. Khởi chạy máy chủ cơ sở dữ liệu giả lập (Mock DB)
Dự án có cấu hình sẵn một Mock server thông qua `json-server` sử dụng file `database.json`. Chạy lệnh sau để bật mock server (cổng `3001`):
```bash
npm run server
```

### 5. Khởi chạy ứng dụng Frontend
Để bắt đầu quá trình phát triển (development mode) với HMR, hãy chạy:
```bash
npm run dev
```
Trình duyệt sẽ tự động mở hoặc bạn có thể truy cập qua link cục bộ thường là `http://localhost:5173`.

---

## 📜 Các Lệnh Run Scripts Trong package.json

| Lệnh | Chức năng |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ frontend cho nhà phát triển (Vite). |
| `npm run server` | Khởi chạy mock json-server tại cổng `3001` sử dụng `database.json`. |
| `npm run build` | Biên dịch tối ưu hóa và đóng gói ứng dụng để đưa lên production (thư mục `dist`). |
| `npm run preview`| Chạy thử bản build production cục bộ. |
| `npm run lint` | Kiểm tra lỗi cú pháp và định dạng code với ESLint. |

---

## 🎨 Giao diện & Trải nghiệm người dùng
- **Dark Mode Support**: Hỗ trợ chuyển đổi giao diện Sáng/Tối linh hoạt được quản lý bởi `ThemeContext` kết hợp với Tailwind CSS.
- **Responsive Layout**: Giao diện hiển thị tối ưu trên cả thiết bị di động, tablet và máy tính để bàn.
