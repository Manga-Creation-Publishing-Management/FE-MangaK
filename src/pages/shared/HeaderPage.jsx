import { LogOut } from 'lucide-react';
import { LoginHook } from '../../features/auth/hooks/LoginHook';
import { authService } from '../../services/authService';
import { Logo } from '../../shared/components/Logo';

// Component hiển thị Header (thanh điều hướng trên cùng) trong layout của ứng dụng
export function HeaderPage({ roleName, avatarUrl }) {
    // Sử dụng hook LoginHook để lấy hàm navigate hỗ trợ việc chuyển trang sau khi đăng xuất
    const { navigate } = LoginHook();

    // Hàm xử lý hành động đăng xuất
    const handleLogout = async () => {
        // Gọi service logout để xóa token hoặc dọn dẹp phiên đăng nhập
        await authService.logout();
        // Chuyển hướng người dùng về trang chủ
        navigate('/');
    };

    return (
        <>
            {/* Thanh header sử dụng grid với 12 cột */}
            <div className="grid grid-cols-12 shadow p-2 px-8 bg-card">
                
                {/* Cột 1: Hiển thị avatar người dùng (chỉ hiện trên màn hình md trở lên) */}
                <div className="hidden md:block col-span-1 px-2 content-center">
                    <img className="rounded-full w-10"
                        src={avatarUrl} alt="Avatar Image" />
                </div>

                {/* Cột hiển thị Lời chào và Vai trò (Role)
                    Nếu là reader thì chiếm 3 cột, nếu là các role khác thì chiếm 5 cột
                */}
                <div className={`${roleName === 'reader' ? 'col-span-3' : 'col-span-5'} content-center`}>
                    <span className="text-sidebar-foreground text-lg font-medium">Welcome back!</span><br />
                    <span className="text-muted-foreground">{roleName}</span>
                </div>
                
                {/* Nếu role là 'reader', hiển thị thêm logo ở giữa header (chiếm 4 cột) */}
                {roleName === 'reader' &&
                    <div className="col-span-4 content-center justify-center">
                        <Logo />
                    </div>}

                {/* Cột hiển thị Nút Đăng xuất nằm ở góc phải
                    Điều chỉnh số lượng cột dựa theo việc có hiển thị Logo (của reader) hay không
                */}
                <div className={`${roleName === 'reader' ? 'col-span-4' : 'col-span-6'} content-center`}>
                    <div className='place-self-end'>
                        {/* Nút đăng xuất */}
                        <button onClick={handleLogout}
                            className='flex 
                        color-background text-muted-foreground
                        hover:text-accent
                        hover:rounded
                        p-2'>
                            <div className='content-center'> <LogOut /> </div>
                            <span className='p-2 font-medium'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}