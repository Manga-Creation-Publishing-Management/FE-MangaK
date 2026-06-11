import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../../services/authService";

// Hook tự tạo (Custom Hook) quản lý toàn bộ logic liên quan đến đăng nhập
export function LoginHook() {
    const navigate = useNavigate(); // Hook dùng để điều hướng trang (chuyển trang)

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
            console.log("Login API Response:", res);

            // Kiểm tra xem dữ liệu trả về có hợp lệ (là object) hay không
            if (!res || typeof res !== "object") {
                throw new Error(`Response from server is not a valid JSON object. Received: ${res}`);
            }

            // Trích xuất token từ response.
            // Do backend có thể trả về các cấu trúc khác nhau (lúc là res.token, lúc là res.data.accessToken...),
            // ta thử tất cả các trường hợp phổ biến để lấy token.
            const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken;

            // Tương tự, trích xuất thông tin user từ response
            let user = res.user || res.data?.user;

            // Nếu không tìm thấy object `user` lồng bên trong, kiểm tra xem role có nằm trực tiếp ở cấp ngoài cùng không
            if (!user) {
                const source = res.data || res;
                if (source && source.role) {
                    user = {
                        role: source.role,
                        email: source.email || email,
                        name: source.name || source.fullName || ""
                    };
                }
            }

            // Nếu không thể lấy được cả token lẫn thông tin user, coi như dữ liệu API trả về bị sai cấu trúc
            if (!token || !user) {
                console.error("Failed to parse login response:", res);
                const keys = Object.keys(res).join(", ");
                const nestedDataKeys = res.data ? ` (data: [${Object.keys(res.data).join(", ")}])` : "";
                throw new Error(`Invalid response structure. Received keys: [${keys}]${nestedDataKeys}. Expected 'token'/'accessToken' and 'user'/'role'.`);
            }

            // Đăng nhập thành công -> Lưu token và thông tin user vào trình duyệt (localStorage)
            localStorage.setItem('mangak-token', token);
            localStorage.setItem('accessToken', token); // Lưu dự phòng cho các logic cũ nếu có
            localStorage.setItem('user', JSON.stringify(user));

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
            const role = (user.role || '').toLowerCase();
            const rolePath = rolePathMap[role] || role;
            
            // Chuyển hướng người dùng sang trang dashboard tương ứng
            navigate(`/${rolePath}`);
            
        } catch (err) {
            // Nếu có lỗi (sai mật khẩu, lỗi mạng,...), lưu lại thông báo lỗi để hiển thị lên UI
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