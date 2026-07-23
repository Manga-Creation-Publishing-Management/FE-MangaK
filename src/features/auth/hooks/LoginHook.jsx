import { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { authService } from "../../../services/authService";

// Hook tự tạo (Custom Hook) quản lý toàn bộ logic liên quan đến đăng nhập
export function LoginHook() {
    const navigate = useNavigate(); // Hook dùng để điều hướng trang (chuyển trang)
    const { showAlert } = useToast();

    // Khởi tạo các State để lưu trữ dữ liệu form và trạng thái giao diện
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện mật khẩu (con mắt)
    const [isLoading, setIsLoading] = useState(false);       // Trạng thái cờ (flag) đang chờ call API
    const [error, setError] = useState(null);                // Trạng thái lưu thông báo lỗi nếu có

    // Hàm xử lý hành động submit form đăng nhập
    const handleSignIn = async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi reload trang mặc định của form submit
        setError(null);     // Reset lại lỗi cũ trước khi thử đăng nhập
        setIsLoading(true); // Bật hiệu ứng loading

        try {
            // Gọi API đăng nhập từ authService
            const res = await authService.login(email, password);

            // Kiểm tra xem dữ liệu trả về có hợp lệ (là object) hay không
            if (!res || typeof res !== "object" || !res.success) {
                throw new Error(res?.message || "Login failed on server.");
            }

            const data = res.data;
            if (!data) {
                throw new Error("No data returned in response.");
            }

            const { accessToken, refreshToken, userId, email: userEmail, firstName, lastName, role } = data;

            if (!accessToken || !role) {
                throw new Error("Missing accessToken or role in response data.");
            }

            // Tạo đối tượng user thống nhất
            const user = {
                id: userId,
                email: userEmail || email,
                role: role,
                name: `${firstName || ''} ${lastName || ''}`.trim()
            };

            // Đăng nhập thành công -> Lưu token và thông tin user vào trình duyệt (localStorage)
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken || '');
            localStorage.setItem('user', JSON.stringify(user));
            // Đăng nhập thành công thì thông báo ở trang layout


            // Đối tượng ánh xạ từ role của user sang đường dẫn trên thanh URL
            const rolePathMap = {
                mangaka: 'mangaka',
                assistant: 'assistant',
                tantou: 'tantou',
                editorial: 'editorial',
                admin: 'admin',
                reader: 'reader',
            };

            // Ép kiểu role về in thường và lấy đường dẫn tương ứng
            const userRoleKey = (user.role || '').toLowerCase();
            const rolePath = rolePathMap[userRoleKey] || userRoleKey;

            // Chuyển hướng người dùng sang trang dashboard tương ứng
            showAlert("Login successfully!");
            navigate(`/${rolePath}`);

        } catch (err) {
            // Nếu có lỗi (sai mật khẩu, lỗi mạng,...), lưu lại thông báo lỗi để hiển thị lên UI
            showAlert("Login failed! Please try again later.");
            setError(err.message);
        }
        finally {
            setIsLoading(false); // Tắt hiệu ứng loading dù thành công hay thất bại
        }
    };

    // Trả ra các state và hàm cần thiết để component giao diện (LoginForm) sử dụng
    return (
        { email, password, setEmail, setPassword, showPassword, setShowPassword, handleSignIn, navigate, isLoading, error }
    )
}