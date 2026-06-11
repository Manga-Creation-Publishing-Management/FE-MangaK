import { FooterPage } from '../shared/FooterPage';
import { LoginForm } from './LoginForm';
import { BackButton } from './BackButton';

// Component Trang Đăng Nhập Chính (Chứa giao diện chia cột)
export function LoginPage() {

  // Tạo hoạ tiết nền dạng lưới (grid lines) mờ mờ ở phía bên phải
  const gridStyle = {
    backgroundImage: `linear-gradient(to right, rgba(155, 126, 184, 0.06) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 126, 184, 0.06) 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
  };

  return (
    <div className='min-h-screen flex flex-col '>
      {/* 
        Layout chia làm 12 cột (grid-cols-12) trên màn hình lớn.
        Bên trái 5 cột, bên phải 7 cột. Trên mobile sẽ xếp thành cột đơn.
      */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 bg-background text-foreground transition-colors duration-300 font-sans">

        {/* --- Cột bên Trái (Mảng Banner Giới Thiệu) --- */}
        {/* Bị ẩn trên màn hình nhỏ (hidden md:flex) */}
        <div className="hidden md:flex md:col-span-5 bg-foreground p-10 lg:p-12 flex-col justify-between text-background relative overflow-hidden">

          {/* Logo và Tên thương hiệu */}
          <div className="flex items-center gap-3 relative z-10 select-none">
            <img
              src="/logo.png"
              alt="MangaK Logo"
              className="h-9 w-9 object-contain rounded-lg"
            />
            <span className="text-xl font-bold tracking-wide flex items-center">
              <span className='text-background'>Manga</span>
              <span className="text-accent ml-0.5">K</span>
            </span>
          </div>

          {/* Tiêu đề Slogan lớn ở giữa */}
          <div className="space-y-6 max-w-sm my-auto relative z-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.25] text-background">
              Create your own <br />
              <span className="text-accent">Manga Universe</span>
            </h2>
            <p className="text-background text-sm leading-relaxed font-normal">
              A collaborative platform designed to streamline drawing tasks, review drafts, and manage publishing schedules in real-time.
            </p>

            {/* Các Feature nổi bật mô tả hệ thống */}
            <div className="bg-foreground border border-white/10 rounded-[24px] p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-background text-[10px] font-bold uppercase tracking-widest select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
                <span className='text-background'>System Features</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mt-4">
                <div className="p-3.5 rounded-xl bg-foreground border border-white/5 hover:bg-background/40 transition-colors">
                  <div className="text-xs font-bold text-background">5+ Roles</div>
                  <div className="text-sm text-background/40 mt-1">Granular Permissions</div>
                </div>
                <div className="p-3.5 rounded-xl bg-foreground border border-white/5 hover:bg-background/40 transition-colors">
                  <div className="text-xs font-bold text-background">Integrated system</div>
                  <div className="text-sm text-background/40 mt-1">Real-time Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Cột bên Phải (Form Đăng Nhập) --- */}
        {/* Nút quay lại nằm tuyệt đối ở góc */}
        <BackButton url='/' />
        
        {/* Vùng chứa form với nền lưới */}
        <div style={gridStyle}
          className="lg:mx-20 col-span-1 md:col-span-7 flex flex-col items-center justify-center p-6 px-12 md:p-12 relative">
          
          {/* Nhúng component Form Đăng nhập đã được bóc tách riêng */}
          <LoginForm />
        </div>

      </div>

    </div>
  );
}
