import { ArrowLeft } from "lucide-react";
import { LoginHook } from "../../features/auth/hooks/LoginHook"

// Component Nút Quay lại (Back Button)
// Thường dùng ở trang đăng nhập để người dùng có thể quay lại trang trước đó (hoặc trang chủ)
export function BackButton({ url }) {
    // Tái sử dụng LoginHook chỉ để lấy hàm navigate (điều hướng)
    const { navigate } = LoginHook();

    return (
        // Nút được đặt vị trí tuyệt đối (absolute) ở góc trên bên phải màn hình
        <button onClick={() => navigate(url)}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-card border border-border 
            text-foreground hover:bg-muted/80 rounded-xl text-sm font-semibold shadow-sm transition-all 
            duration-200 cursor-pointer z-10"
        >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
        </button>
    )
}