import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginHook } from '../../features/auth/hooks/LoginHook';

// Component biểu mẫu Đăng nhập (Login Form)
export function LoginForm() {

    // Trích xuất các state và hàm xử lý từ custom hook LoginHook
    // Giúp tách biệt logic xử lý (gọi API, lưu token) ra khỏi giao diện (UI)
    const {
        email, setEmail, password, setPassword,
        showPassword, setShowPassword, handleSignIn,
        error, isLoading
    } = LoginHook();

    return (
        // Vỏ ngoài của Form đăng nhập, thiết kế dạng thẻ Card đổ bóng
        <div className="w-full bg-background border border-border rounded-xl p-8
        shadow-xl transition-colors duration-300 relative">
            
            {/* --- Phần Header Của Form --- */}
            <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Sign in to Manga<span className="text-accent">K</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Enter your credentials below to access the system
                </p>
            </div>

            {/* --- Phần Form Nhập Liệu --- */}
            <form onSubmit={handleSignIn} className="space-y-5">

                {/* --- Ô Nhập Email --- */}
                <div className="space-y-2">
                    <label className="text text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Email
                    </label>
                    {/* Bao bọc input bằng một div để tạo viền focus (focus-within) và chèn icon bên trong */}
                    <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 
                    focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                        <User size={18} className="text-muted-foreground/80 shrink-0" />
                        <input
                            type="email"
                            required
                            placeholder="Enter email"
                            value={email} // Gắn giá trị state email
                            onChange={(e) => setEmail(e.target.value)} // Cập nhật state mỗi khi gõ
                            className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                        />
                    </div>
                </div>

                {/* --- Ô Nhập Password --- */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Password
                        </label>
                    </div>
                    
                    <div className="w-full bg-muted/40 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
                        <Lock size={18} className="text-muted-foreground/80 shrink-0" />
                        
                        {/* Ẩn/Hiện mật khẩu phụ thuộc vào giá trị state showPassword */}
                        <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent text-foreground placeholder-muted-foreground/70 outline-none w-full text-sm font-medium"
                        />
                        
                        {/* Nút bấm con mắt để thay đổi cờ showPassword */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground shrink-0 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    {/* Link quên mật khẩu (hiện tại chưa có chức năng) */}
                    <div className='flex w-full justify-end'>
                        <a href="#" className="text-xs font-semibold text-primary hover:underline">
                            Forgot password?
                        </a>
                    </div>
                </div>

                {/* --- Thông Báo Lỗi --- */}
                {/* Nếu state error có dữ liệu (khi API trả về lỗi) thì hiển thị cảnh báo đỏ */}
                {error && <p className='text-warning font-sm'> {error} </p>}

                {/* --- Nút Đăng Nhập --- */}
                {/* Tự động chuyển text và vô hiệu hoá nút (disabled) khi đang chờ API */}
                <button
                    type="submit" disabled={isLoading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm text-sm mt-6 cursor-pointer"
                >
                    {isLoading ? 'Loging in...' : 'Log In'}
                </button>
            </form>

            {/* --- Liên Kết Đăng Ký --- */}
            <div className="mt-8 text-center text-xs md:text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <a href="#" className="font-bold text-primary hover:underline ml-0.5">
                    Register now
                </a>
            </div>
        </div >
    )
}