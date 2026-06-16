// Component WelcomeLine: Hiển thị dòng tiêu đề chào mừng ở đầu các trang Dashboard
// Nhận vào roleName để tuỳ chỉnh tiêu đề theo vai trò (ví dụ: Mangaka Dashboard, Admin Dashboard...)
export function WelcomeLine({ roleName }) {
    return (
        <>
            {/* Căn lề nội dung bắt đầu từ bên trái */}
            <div className="flex justify-start">
                <div className="p-3 mb-5">
                    {/* Dòng chữ lớn hiển thị Role + Dashboard */}
                    <p className="text-sidebar-foreground font-medium text-2xl pb-1">{roleName} DashBoard</p>
                    {/* Lời chào phụ */}
                    <p className="text-muted-foreground">Welcome back! Here's your overview</p>
                </div>
            </div>
        </>

    );

}